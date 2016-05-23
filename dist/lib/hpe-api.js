'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HpeApi = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _requestRx = require('./request-rx');

var _hpeApiError = require('./hpe-api-error');

var _hpeApiPipeline = require('./hpe-api-pipeline');

var _hpeApiConfig = require('./hpe-api-config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HpeApi = exports.HpeApi = function () {
  function HpeApi() {
    _classCallCheck(this, HpeApi);
  }

  _createClass(HpeApi, null, [{
    key: 'connect',
    value: function connect() {
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

      return _requestRx.RequestRx.post(signInRequest, options).map(function (response) {
        if (response.statusCode !== 200) {
          throw new _hpeApiError.HpeApiError(response.statusCode, JSON.stringify(response.body, null, 2));
        }

        var csrfToken = (0, _lodash2.default)(jar.getCookies(_hpeApiConfig.hpeApiConfig.hpeServerUrl)).find(function (cookie) {
          return cookie.key === 'HPSSO_COOKIE_CSRF';
        }).value;

        return {
          hpeApiConfig: _hpeApiConfig.hpeApiConfig,
          request: signInRequest.defaults({
            headers: {
              'HPSSO-HEADER-CSRF': csrfToken
            }
          })
        };
      });
    }
  }, {
    key: 'getWorkspaceUri',
    value: function getWorkspaceUri(session) {
      return _util2.default.format('%s/api/shared_spaces/%s/workspaces/%s', session.hpeApiConfig.hpeServerUrl, session.hpeApiConfig.hpeSharedSpace, session.hpeApiConfig.hpeWorkspace);
    }
  }, {
    key: 'findCiServer',
    value: function findCiServer(session, instanceId) {
      var options = {
        uri: _util2.default.format('%s/ci_servers/', HpeApi.getWorkspaceUri(session)),
        json: true
      };

      return _requestRx.RequestRx.get(session.request, options).flatMap(function (response) {
        if (response.statusCode !== 200) {
          throw new _hpeApiError.HpeApiError(response.statusCode, JSON.stringify(response.body, null, 2));
        }

        return _rx2.default.Observable.from(response.body.data).first(function (ciServer) {
          return ciServer.instance_id === instanceId;
        }, null, null);
      });
    }
  }, {
    key: 'createCiServer',
    value: function createCiServer(session, server) {
      var data = {
        instance_id: server.instanceId,
        name: server.name,
        url: 'http://codefresh.io/',
        server_type: 'Codefresh'
      };

      var options = {
        uri: _util2.default.format('%s/ci_servers/', HpeApi.getWorkspaceUri(session)),
        json: true,
        body: {
          data: [data]
        }
      };

      return _requestRx.RequestRx.post(session.request, options).map(function (response) {
        if (response.statusCode !== 201) {
          throw new _hpeApiError.HpeApiError(response.statusCode, JSON.stringify(response.body, null, 2));
        }

        return _lodash2.default.assign({}, response.body.data[0], data);
      });
    }
  }, {
    key: 'createPipeline',
    value: function createPipeline(session, pipeline) {
      var pipelineJobs = _hpeApiPipeline.HpeApiPipeline.jobs(pipeline.id);
      var data = {
        name: pipeline.name,
        root_job_ci_id: pipelineJobs[0].jobCiId,
        ci_server: {
          type: 'ci_server',
          id: pipeline.ciServerHpeId
        },
        jobs: pipelineJobs
      };

      var options = {
        uri: _util2.default.format('%s/pipelines/', HpeApi.getWorkspaceUri(session)),
        json: true,
        body: {
          data: [data]
        }
      };

      return _requestRx.RequestRx.post(session.request, options).map(function (response) {
        if (response.statusCode !== 201) {
          throw new _hpeApiError.HpeApiError(response.statusCode, JSON.stringify(response.body, null, 2));
        }

        return _lodash2.default.assign({}, response.body.data[0], data);
      });
    }
  }, {
    key: 'reportPipelineStepStatus',
    value: function reportPipelineStepStatus(session, stepStatus) {
      var jobCiId = _hpeApiPipeline.HpeApiPipeline.jobId(stepStatus.pipelineId, stepStatus.stepId);
      var rootJobCiId = _hpeApiPipeline.HpeApiPipeline.jobId(stepStatus.pipelineId, 'pipeline');

      var data = {
        serverCiId: stepStatus.ciServerId,
        jobCiId: jobCiId,
        buildCiId: stepStatus.buildId,
        buildName: stepStatus.buildName,
        startTime: stepStatus.startTime,
        duration: stepStatus.duration,
        status: stepStatus.status,
        result: stepStatus.result
      };

      if (jobCiId !== rootJobCiId) {
        data.causes = [{
          jobCiId: rootJobCiId,
          buildCiId: stepStatus.buildId
        }];
      }

      var options = {
        uri: _util2.default.format('%s/analytics/ci/builds/', HpeApi.getWorkspaceUri(session)),
        json: true,
        body: data
      };

      return _requestRx.RequestRx.put(session.request, options).map(function (response) {
        if (response.statusCode !== 200) {
          throw new _hpeApiError.HpeApiError(response.statusCode, JSON.stringify(response.body, null, 2));
        }

        return _lodash2.default.assign({}, response.body, data);
      });
    }
  }, {
    key: 'reportPipelineTestResults',
    value: function reportPipelineTestResults(session, testResult) {
      var jobCiId = _hpeApiPipeline.HpeApiPipeline.jobId(testResult.pipelineId, testResult.stepId);
      var builder = new _xml2js2.default.Builder();
      var data = builder.buildObject({
        test_result: {
          build: {
            $: {
              server_id: testResult.ciServerId,
              job_id: jobCiId,
              job_name: jobCiId,
              build_id: testResult.buildId,
              build_name: testResult.buildId
            }
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
                class: testResult.testRuns[0].class
              }
            }
          }
        }
      });

      var options = {
        uri: _util2.default.format('%s/test-results/', HpeApi.getWorkspaceUri(session)),
        'content-type': 'application/xml',
        body: data
      };

      return _requestRx.RequestRx.post(session.request, options).map(function (response) {
        if (response.statusCode !== 202) {
          throw new _hpeApiError.HpeApiError(response.statusCode, JSON.stringify(response.body, null, 2));
        }

        return _lodash2.default.assign({}, response.body, data);
      });
    }
  }]);

  return HpeApi;
}();
