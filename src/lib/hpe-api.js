/* eslint-disable quote-props */
import Rx from 'rx';
import util from 'util';
import Xml2js from 'xml2js';
import request from 'request';
import { RequestRx } from 'lib/request-rx';
import { HpeApiError } from 'lib/hpe-api-error';
import { HpeApiPipeline } from 'lib/hpe-api-pipeline';
import { HpeApiSession, HpeApiBuildSession } from 'lib/hpe-api-session';
import { hpeApiConfig } from './hpe-api-config';

export const HpeApi = {};

HpeApi.createSession = () => {
  const jar = request.jar();
  const signInRequest = request.defaults({ jar });
  const options = {
    uri: util.format(
      '%s/authentication/sign_in/',
      hpeApiConfig.hpeServerUrl),
    json: true,
    body: {
      user: hpeApiConfig.hpeUser,
      password: hpeApiConfig.hpePassword,
    },
  };

  return RequestRx
    .post(signInRequest, options)
    .flatMap(response => {
      if (response.statusCode !== 200) {
        throw HpeApiError.create(
          response.statusCode,
          JSON.stringify(response.body, null, 2));
      }

      return Rx.Observable
        .from(jar.getCookies(hpeApiConfig.hpeServerUrl))
        .first(cookie => cookie.key === 'HPSSO_COOKIE_CSRF')
        .map(cookie => cookie.value)
        .map(csrfToken => signInRequest.defaults({
          headers: {
            'HPSSO-HEADER-CSRF': csrfToken,
            'HPECLIENTTYPE': 'HPE_CI_CLIENT',
          },
        }))
        .map(sessionRequest => HpeApiSession.create(
          sessionRequest,
          hpeApiConfig));
    });
};

HpeApi.getWorkspaceUri = (session) => {
  return util.format(
    '%s/api/shared_spaces/%s/workspaces/%s',
    session.config.hpeServerUrl,
    session.config.hpeSharedSpace,
    session.config.hpeWorkspace);
};

HpeApi.findCiServer = (session, instanceId) => {
  const options = {
    uri: util.format(
      '%s/ci_servers/',
      HpeApi.getWorkspaceUri(session)),
    json: true,
  };

  return RequestRx
    .get(session.request, options)
    .flatMap(response => {
      if (response.statusCode !== 200) {
        throw HpeApiError.create(
          response.statusCode,
          JSON.stringify(response.body, null, 2));
      }

      return Rx.Observable
        .from(response.body.data)
        .first(ciServer => ciServer.instance_id === instanceId, null, null);
    });
};

HpeApi.createCiServer = (session, id, name) => {
  const data = {
    instance_id: id,
    name,
    url: 'http://codefresh.io/',
    server_type: 'Codefresh',
  };

  const options = {
    uri: util.format(
      '%s/ci_servers/',
      HpeApi.getWorkspaceUri(session)),
    json: true,
    body: {
      data: [data],
    },
  };

  return RequestRx
    .post(session.request, options)
    .map(response => {
      if (response.statusCode !== 201) {
        throw HpeApiError.create(
          response.statusCode,
          JSON.stringify(response.body, null, 2));
      }

      return {
        ...data,
        ...response.body.data[0],
      };
    });
};

HpeApi.createPipeline = (session, ciServerHpeId, id, name) => {
  const pipelineJobs = HpeApiPipeline.jobs(id);
  const data = {
    name,
    root_job_ci_id: pipelineJobs[0].jobCiId,
    ci_server: {
      type: 'ci_server',
      id: ciServerHpeId,
    },
    jobs: pipelineJobs,
  };

  const options = {
    uri: util.format('%s/pipelines/', HpeApi.getWorkspaceUri(session)),
    json: true,
    body: {
      data: [data],
    },
  };

  return RequestRx
    .post(session.request, options)
    .map(response => {
      if (response.statusCode !== 201) {
        throw HpeApiError.create(
          response.statusCode,
          JSON.stringify(response.body, null, 2));
      }

      return {
        ...data,
        ...response.body.data[0],
      };
    });
};

HpeApi.createBuildSession = (session, ciServerId, pipelineId, buildId, buildName) =>
  HpeApiBuildSession.create(session, ciServerId, pipelineId, buildId, buildName);

HpeApi.reportBuildPipelineStepStatus =
  (buildSession, stepId, startTime, duration, status, result) => {
    const jobCiId = HpeApiPipeline.jobIdForStep(buildSession.pipelineId, stepId);
    const rootJobCiId = HpeApiPipeline.jobIdForStep(buildSession.pipelineId, 'pipeline');

    const data = {
      serverCiId: buildSession.ciServerId,
      jobCiId,
      buildCiId: buildSession.buildId,
      buildName: buildSession.buildName,
      startTime,
      duration,
      status,
      result,
    };

    if (jobCiId !== rootJobCiId) {
      data.causes = [
        {
          jobCiId: rootJobCiId,
          buildCiId: buildSession.buildId,
        },
      ];
    }

    const options = {
      uri: util.format(
        '%s/analytics/ci/builds/',
        HpeApi.getWorkspaceUri(buildSession.session)),
      json: true,
      body: data,
    };

    return RequestRx
      .put(buildSession.session.request, options)
      .map(response => {
        if (response.statusCode !== 200) {
          throw HpeApiError.create(
            response.statusCode,
            JSON.stringify(response.body, null, 2));
        }

        return {
          ...data,
          ...response.body,
        };
      });
  };

HpeApi.reportBuildPipelineTestResults = (buildSession, stepId, testResult) => {
  const builder = new Xml2js.Builder();
  const jobCiId = HpeApiPipeline.jobIdForStep(buildSession.pipelineId, stepId);

  const data = builder.buildObject({
    test_result: {
      build: {
        $: {
          server_id: buildSession.ciServerId,
          job_id: jobCiId,
          job_name: jobCiId,
          build_id: buildSession.buildId,
          build_name: buildSession.buildName,
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
    uri: util.format(
      '%s/test-results/',
      HpeApi.getWorkspaceUri(buildSession.session)),
    'content-type': 'application/xml',
    body: data,
  };

  return RequestRx
    .post(buildSession.session.request, options)
    .map(response => {
      if (response.statusCode !== 202) {
        throw HpeApiError.create(
          response.statusCode,
          JSON.stringify(response.body, null, 2));
      }

      return {
        ...data,
        ...response.body,
      };
    });
};
