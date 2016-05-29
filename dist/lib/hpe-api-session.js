'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HpeApiSession = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable new-cap */
/* eslint-disable quote-props */


var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _immutable = require('immutable');

var _requestRx = require('./request-rx');

var _hpeApiError = require('./hpe-api-error');

var _hpeApiPipeline = require('./hpe-api-pipeline');

var _hpeApiConfig = require('./hpe-api-config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HpeApiSession = exports.HpeApiSession = (0, _immutable.Record)({
  request: null,
  config: null
});

HpeApiSession.create = function () {
  var jar = _request2.default.jar();
  var signInRequest = _request2.default.defaults({ jar: jar });
  var options = {
    uri: _util2.default.format('%s/authentication/sign_in/', _hpeApiConfig.hpeApiConfig.hpeServerUrl),
    json: true,
    body: {
      user: _hpeApiConfig.hpeApiConfig.hpeUser,
      password: _hpeApiConfig.hpeApiConfig.hpePassword
    }
  };

  return _requestRx.RequestRx.post(signInRequest, options).flatMap(function (response) {
    if (response.statusCode !== 200) {
      throw _hpeApiError.HpeApiError.create(response.statusCode, JSON.stringify(response.body, null, 2));
    }

    return _rx2.default.Observable.from(jar.getCookies(_hpeApiConfig.hpeApiConfig.hpeServerUrl)).first(function (cookie) {
      return cookie.key === 'HPSSO_COOKIE_CSRF';
    }).map(function (cookie) {
      return cookie.value;
    }).map(function (csrfToken) {
      return signInRequest.defaults({
        headers: {
          'HPSSO-HEADER-CSRF': csrfToken,
          'HPECLIENTTYPE': 'HPE_CI_CLIENT'
        }
      });
    }).map(function (sessionRequest) {
      return new HpeApiSession({
        request: sessionRequest,
        config: _hpeApiConfig.hpeApiConfig
      });
    });
  });
};

HpeApiSession.getWorkspaceUri = function (session) {
  return _util2.default.format('%s/api/shared_spaces/%s/workspaces/%s', session.config.hpeServerUrl, session.config.hpeSharedSpace, session.config.hpeWorkspace);
};

HpeApiSession.findCiServer = function (session, instanceId) {
  var options = {
    uri: _util2.default.format('%s/ci_servers/', HpeApiSession.getWorkspaceUri(session)),
    json: true
  };

  return _requestRx.RequestRx.get(session.request, options).flatMap(function (response) {
    if (response.statusCode !== 200) {
      throw _hpeApiError.HpeApiError.create(response.statusCode, JSON.stringify(response.body, null, 2));
    }

    return _rx2.default.Observable.from(response.body.data).first(function (ciServer) {
      return ciServer.instance_id === instanceId;
    }, null, null);
  });
};

HpeApiSession.createCiServer = function (session, id, name) {
  var data = {
    instance_id: id,
    name: name,
    url: 'http://codefresh.io/',
    server_type: 'Codefresh'
  };

  var options = {
    uri: _util2.default.format('%s/ci_servers/', HpeApiSession.getWorkspaceUri(session)),
    json: true,
    body: {
      data: [data]
    }
  };

  return _requestRx.RequestRx.post(session.request, options).map(function (response) {
    if (response.statusCode !== 201) {
      throw _hpeApiError.HpeApiError.create(response.statusCode, JSON.stringify(response.body, null, 2));
    }

    return _extends({}, data, response.body.data[0]);
  });
};

HpeApiSession.createPipeline = function (session, ciServerHpeId, id, name) {
  var pipelineJobs = _hpeApiPipeline.HpeApiPipeline.jobs(id);
  var data = {
    name: name,
    root_job_ci_id: pipelineJobs[0].jobCiId,
    ci_server: {
      type: 'ci_server',
      id: ciServerHpeId
    },
    jobs: pipelineJobs
  };

  var options = {
    uri: _util2.default.format('%s/pipelines/', HpeApiSession.getWorkspaceUri(session)),
    json: true,
    body: {
      data: [data]
    }
  };

  return _requestRx.RequestRx.post(session.request, options).map(function (response) {
    if (response.statusCode !== 201) {
      throw _hpeApiError.HpeApiError.create(response.statusCode, JSON.stringify(response.body, null, 2));
    }

    return _extends({}, data, response.body.data[0]);
  });
};