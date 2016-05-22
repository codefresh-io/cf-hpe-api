import _ from 'lodash';
import Rx from 'rx';
import Util from 'util';
import Xml2js from 'xml2js';
import request from 'request';
import { RequestRx } from 'lib/request-rx';
import { HpeApiError } from 'lib/hpe-api-error';
import { HpeApiSession } from 'lib/hpe-api-session';
import { HpeApiPipeline } from 'lib/hpe-api-pipeline';
import { hpeApiConfig } from './hpe-api-config';

export const HpeApi = {};

HpeApi.connect = () => {
  const jar = request.jar();
  const signInRequest = request.defaults({ jar });
  const options = {
    uri: Util.format('%s/authentication/sign_in/', hpeApiConfig.hpeServerUrl),
    json: true,
    body: {
      user: hpeApiConfig.hpeUser,
      password: hpeApiConfig.hpePassword,
    },
  };

  return RequestRx
    .post(signInRequest, options)
    .map(response => {
      if (response.statusCode !== 200) {
        throw new HpeApiError(
          response.statusCode,
          JSON.stringify(response.body, null, 2));
      }

      const csrfToken =
        _(jar.getCookies(hpeApiConfig.hpeServerUrl))
          .find(cookie => cookie.key === 'HPSSO_COOKIE_CSRF')
          .value;

      const sessionRequest = signInRequest.defaults({
        headers: {
          'HPSSO-HEADER-CSRF': csrfToken,
        },
      });

      return HpeApiSession.create(sessionRequest, hpeApiConfig);
    });
};

HpeApi.getWorkspaceUri = (session) => {
  return Util.format(
    '%s/api/shared_spaces/%s/workspaces/%s',
    session.config.hpeServerUrl,
    session.config.hpeSharedSpace,
    session.config.hpeWorkspace);
};

HpeApi.findCiServer = (session, instanceId) => {
  const options = {
    uri: Util.format('%s/ci_servers/', HpeApi.getWorkspaceUri(session)),
    json: true,
  };

  return RequestRx
    .get(session.request, options)
    .flatMap(response => {
      if (response.statusCode !== 200) {
        throw new HpeApiError(
          response.statusCode,
          JSON.stringify(response.body, null, 2));
      }

      return Rx.Observable
        .from(response.body.data)
        .first(ciServer => ciServer.instance_id === instanceId, null, null);
    });
};

HpeApi.createCiServer = (session, server) => {
  const data = {
    instance_id: server.instanceId,
    name: server.name,
    url: 'http://codefresh.io/',
    server_type: 'Codefresh',
  };

  const options = {
    uri: Util.format('%s/ci_servers/', HpeApi.getWorkspaceUri(session)),
    json: true,
    body: {
      data: [data],
    },
  };

  return RequestRx
    .post(session.request, options)
    .map(response => {
      if (response.statusCode !== 201) {
        throw new HpeApiError(
          response.statusCode,
          JSON.stringify(response.body, null, 2));
      }

      return _.assign({}, response.body.data[0], data);
    });
};

HpeApi.createPipeline = (session, pipeline) => {
  const pipelineJobs = HpeApiPipeline.jobs(pipeline.id);
  const data = {
    name: pipeline.name,
    root_job_ci_id: pipelineJobs[0].jobCiId,
    ci_server: {
      type: 'ci_server',
      id: pipeline.serverId,
    },
    jobs: pipelineJobs,
  };

  const options = {
    uri: Util.format('%s/pipelines/', HpeApi.getWorkspaceUri(session)),
    json: true,
    body: {
      data: [data],
    },
  };

  return RequestRx
    .post(session.request, options)
    .map(response => {
      if (response.statusCode !== 201) {
        throw new HpeApiError(
          response.statusCode,
          JSON.stringify(response.body, null, 2));
      }

      return _.assign({}, response.body.data[0], data);
    });
};

HpeApi.reportPipelineStepStatus = (session, stepStatus) => {
  const jobCiId = HpeApiPipeline.jobId(stepStatus.pipelineId, stepStatus.stepId);
  const rootJobCiId = HpeApiPipeline.jobId(stepStatus.pipelineId, 'pipeline');

  const data = {
    serverCiId: stepStatus.serverInstanceId,
    jobCiId,
    buildCiId: stepStatus.buildId,
    buildName: stepStatus.buildName,
    startTime: stepStatus.startTime,
    duration: stepStatus.duration,
    status: stepStatus.status,
    result: stepStatus.result,
  };

  if (jobCiId !== rootJobCiId) {
    data.causes = [
      {
        jobCiId: rootJobCiId,
        buildCiId: stepStatus.buildId,
      },
    ];
  }

  const options = {
    uri: Util.format('%s/analytics/ci/builds/', HpeApi.getWorkspaceUri(session)),
    json: true,
    body: data,
  };

  return RequestRx
    .put(session.request, options)
    .map(response => {
      if (response.statusCode !== 200) {
        throw new HpeApiError(
          response.statusCode,
          JSON.stringify(response.body, null, 2));
      }

      return _.assign({}, response.body, data);
    });
};

HpeApi.reportPipelineTestResults = (session, testResult) => {
  const jobCiId = HpeApiPipeline.jobId(testResult.pipelineId, testResult.stepId);
  const builder = new Xml2js.Builder();
  const data = builder.buildObject({
    test_result: {
      build: {
        $: {
          server_id: testResult.serverInstanceId,
          job_id: jobCiId,
          job_name: jobCiId,
          build_id: testResult.buildId,
          build_name: testResult.buildId,
        },
      },
      test_runs: {
        test_run: {
          $: {
            name: testResult.testRuns[0].testName,
            started: testResult.testRuns[0].started,
            duration: testResult.testRuns[0].duration,
            status: testResult.testRuns[0].status,
            module: testResult.testRuns[0].module,
            package: testResult.testRuns[0].package,
            class: testResult.testRuns[0].class,
          },
        },
      },
    },
  });

  const options = {
    uri: Util.format('%s/test-results/', HpeApi.getWorkspaceUri(session)),
    'content-type': 'application/xml',
    body: data,
  };

  return RequestRx
    .post(session.request, options)
    .map(response => {
      if (response.statusCode !== 202) {
        throw new HpeApiError(
          response.statusCode,
          JSON.stringify(response.body, null, 2));
      }

      return _.assign({}, response.body, data);
    });
};
