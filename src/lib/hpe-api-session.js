/* eslint-disable new-cap */
/* eslint-disable quote-props */
import Rx from 'rx';
import util from 'util';
import request from 'request';
import { Record } from 'immutable';
import { RequestRx } from 'lib/request-rx';
import { HpeApiError } from 'lib/hpe-api-error';
import { HpeApiPipeline } from 'lib/hpe-api-pipeline';

export const HpeApiSession = Record({
  request: null,
  config: null,
});

HpeApiSession.create = (hpeApiConfig) => {
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
        .map(sessionRequest => new HpeApiSession({
          request: sessionRequest,
          config: hpeApiConfig,
        }));
    });
};

HpeApiSession.getWorkspaceUri = (session) => {
  return util.format(
    '%s/api/shared_spaces/%s/workspaces/%s',
    session.config.hpeServerUrl,
    session.config.hpeSharedSpace,
    session.config.hpeWorkspace);
};

HpeApiSession.findCiServer = (session, instanceId) => {
  const options = {
    uri: util.format(
      '%s/ci_servers/',
      HpeApiSession.getWorkspaceUri(session)),
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

HpeApiSession.createCiServer = (session, id, name) => {
  const data = {
    instance_id: id,
    name,
    url: 'http://codefresh.io/',
    server_type: 'Codefresh',
  };

  const options = {
    uri: util.format(
      '%s/ci_servers/',
      HpeApiSession.getWorkspaceUri(session)),
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

HpeApiSession.createPipeline = (session, ciServerHpeId, id, name) => {
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
    uri: util.format('%s/pipelines/', HpeApiSession.getWorkspaceUri(session)),
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
