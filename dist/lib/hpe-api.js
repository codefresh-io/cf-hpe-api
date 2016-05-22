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
          id: pipeline.serverId
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
        serverCiId: stepStatus.serverInstanceId,
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
              server_id: testResult.serverInstanceId,
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
//# sourceMappingURL=data:application/json;base64,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QztBQUMvQixnQkFBTSw2QkFDSixTQUFTLFVBREwsRUFFSixLQUFLLFNBQUwsQ0FBZSxTQUFTLElBQXhCLEVBQThCLElBQTlCLEVBQW9DLENBQXBDLENBRkksQ0FBTjtBQUdEOztBQUVELGVBQU8saUJBQUUsTUFBRixDQUFTLEVBQVQsRUFBYSxTQUFTLElBQXRCLEVBQTRCLElBQTVCLENBQVA7QUFDRCxPQVZJLENBQVA7QUFXRCIsImZpbGUiOiJsaWIvaHBlLWFwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUnggZnJvbSAncngnO1xuaW1wb3J0IFV0aWwgZnJvbSAndXRpbCc7XG5pbXBvcnQgWG1sMmpzIGZyb20gJ3htbDJqcyc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcbmltcG9ydCB7IFJlcXVlc3RSeCB9IGZyb20gJ2xpYi9yZXF1ZXN0LXJ4JztcbmltcG9ydCB7IEhwZUFwaUVycm9yIH0gZnJvbSAnbGliL2hwZS1hcGktZXJyb3InO1xuaW1wb3J0IHsgSHBlQXBpUGlwZWxpbmUgfSBmcm9tICdsaWIvaHBlLWFwaS1waXBlbGluZSc7XG5pbXBvcnQgeyBocGVBcGlDb25maWcgfSBmcm9tICcuL2hwZS1hcGktY29uZmlnJztcblxuZXhwb3J0IGNsYXNzIEhwZUFwaSB7XG5cbiAgc3RhdGljIGNvbm5lY3QoKSB7XG4gICAgY29uc3QgamFyID0gcmVxdWVzdC5qYXIoKTtcbiAgICBjb25zdCBzaWduSW5SZXF1ZXN0ID0gcmVxdWVzdC5kZWZhdWx0cyh7IGphciB9KTtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgdXJpOiBVdGlsLmZvcm1hdCgnJXMvYXV0aGVudGljYXRpb24vc2lnbl9pbi8nLCBocGVBcGlDb25maWcuaHBlU2VydmVyVXJsKSxcbiAgICAgIGpzb246IHRydWUsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHVzZXI6IGhwZUFwaUNvbmZpZy5ocGVVc2VyLFxuICAgICAgICBwYXNzd29yZDogaHBlQXBpQ29uZmlnLmhwZVBhc3N3b3JkLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIFJlcXVlc3RSeFxuICAgICAgLnBvc3Qoc2lnbkluUmVxdWVzdCwgb3B0aW9ucylcbiAgICAgIC5tYXAocmVzcG9uc2UgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEhwZUFwaUVycm9yKFxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSxcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmJvZHksIG51bGwsIDIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNzcmZUb2tlbiA9XG4gICAgICAgICAgXyhqYXIuZ2V0Q29va2llcyhocGVBcGlDb25maWcuaHBlU2VydmVyVXJsKSlcbiAgICAgICAgICAgIC5maW5kKGNvb2tpZSA9PiBjb29raWUua2V5ID09PSAnSFBTU09fQ09PS0lFX0NTUkYnKVxuICAgICAgICAgICAgLnZhbHVlO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaHBlQXBpQ29uZmlnLFxuICAgICAgICAgIHJlcXVlc3Q6IHNpZ25JblJlcXVlc3QuZGVmYXVsdHMoe1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAnSFBTU08tSEVBREVSLUNTUkYnOiBjc3JmVG9rZW4sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICB9O1xuICAgICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0V29ya3NwYWNlVXJpKHNlc3Npb24pIHtcbiAgICByZXR1cm4gVXRpbC5mb3JtYXQoXG4gICAgICAnJXMvYXBpL3NoYXJlZF9zcGFjZXMvJXMvd29ya3NwYWNlcy8lcycsXG4gICAgICBzZXNzaW9uLmhwZUFwaUNvbmZpZy5ocGVTZXJ2ZXJVcmwsXG4gICAgICBzZXNzaW9uLmhwZUFwaUNvbmZpZy5ocGVTaGFyZWRTcGFjZSxcbiAgICAgIHNlc3Npb24uaHBlQXBpQ29uZmlnLmhwZVdvcmtzcGFjZSk7XG4gIH1cblxuICBzdGF0aWMgZmluZENpU2VydmVyKHNlc3Npb24sIGluc3RhbmNlSWQpIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgdXJpOiBVdGlsLmZvcm1hdCgnJXMvY2lfc2VydmVycy8nLCBIcGVBcGkuZ2V0V29ya3NwYWNlVXJpKHNlc3Npb24pKSxcbiAgICAgIGpzb246IHRydWUsXG4gICAgfTtcblxuICAgIHJldHVybiBSZXF1ZXN0UnhcbiAgICAgIC5nZXQoc2Vzc2lvbi5yZXF1ZXN0LCBvcHRpb25zKVxuICAgICAgLmZsYXRNYXAocmVzcG9uc2UgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEhwZUFwaUVycm9yKFxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSxcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmJvZHksIG51bGwsIDIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBSeC5PYnNlcnZhYmxlXG4gICAgICAgICAgLmZyb20ocmVzcG9uc2UuYm9keS5kYXRhKVxuICAgICAgICAgIC5maXJzdChjaVNlcnZlciA9PiBjaVNlcnZlci5pbnN0YW5jZV9pZCA9PT0gaW5zdGFuY2VJZCwgbnVsbCwgbnVsbCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVDaVNlcnZlcihzZXNzaW9uLCBzZXJ2ZXIpIHtcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgaW5zdGFuY2VfaWQ6IHNlcnZlci5pbnN0YW5jZUlkLFxuICAgICAgbmFtZTogc2VydmVyLm5hbWUsXG4gICAgICB1cmw6ICdodHRwOi8vY29kZWZyZXNoLmlvLycsXG4gICAgICBzZXJ2ZXJfdHlwZTogJ0NvZGVmcmVzaCcsXG4gICAgfTtcblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICB1cmk6IFV0aWwuZm9ybWF0KCclcy9jaV9zZXJ2ZXJzLycsIEhwZUFwaS5nZXRXb3Jrc3BhY2VVcmkoc2Vzc2lvbikpLFxuICAgICAganNvbjogdHJ1ZSxcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgZGF0YTogW2RhdGFdLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIFJlcXVlc3RSeFxuICAgICAgLnBvc3Qoc2Vzc2lvbi5yZXF1ZXN0LCBvcHRpb25zKVxuICAgICAgLm1hcChyZXNwb25zZSA9PiB7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXNDb2RlICE9PSAyMDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgSHBlQXBpRXJyb3IoXG4gICAgICAgICAgICByZXNwb25zZS5zdGF0dXNDb2RlLFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuYm9keSwgbnVsbCwgMikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF8uYXNzaWduKHt9LCByZXNwb25zZS5ib2R5LmRhdGFbMF0sIGRhdGEpO1xuICAgICAgfSk7XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlUGlwZWxpbmUoc2Vzc2lvbiwgcGlwZWxpbmUpIHtcbiAgICBjb25zdCBwaXBlbGluZUpvYnMgPSBIcGVBcGlQaXBlbGluZS5qb2JzKHBpcGVsaW5lLmlkKTtcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgbmFtZTogcGlwZWxpbmUubmFtZSxcbiAgICAgIHJvb3Rfam9iX2NpX2lkOiBwaXBlbGluZUpvYnNbMF0uam9iQ2lJZCxcbiAgICAgIGNpX3NlcnZlcjoge1xuICAgICAgICB0eXBlOiAnY2lfc2VydmVyJyxcbiAgICAgICAgaWQ6IHBpcGVsaW5lLnNlcnZlcklkLFxuICAgICAgfSxcbiAgICAgIGpvYnM6IHBpcGVsaW5lSm9icyxcbiAgICB9O1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIHVyaTogVXRpbC5mb3JtYXQoJyVzL3BpcGVsaW5lcy8nLCBIcGVBcGkuZ2V0V29ya3NwYWNlVXJpKHNlc3Npb24pKSxcbiAgICAgIGpzb246IHRydWUsXG4gICAgICBib2R5OiB7XG4gICAgICAgIGRhdGE6IFtkYXRhXSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIHJldHVybiBSZXF1ZXN0UnhcbiAgICAgIC5wb3N0KHNlc3Npb24ucmVxdWVzdCwgb3B0aW9ucylcbiAgICAgIC5tYXAocmVzcG9uc2UgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSAhPT0gMjAxKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEhwZUFwaUVycm9yKFxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSxcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmJvZHksIG51bGwsIDIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfLmFzc2lnbih7fSwgcmVzcG9uc2UuYm9keS5kYXRhWzBdLCBkYXRhKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIHJlcG9ydFBpcGVsaW5lU3RlcFN0YXR1cyhzZXNzaW9uLCBzdGVwU3RhdHVzKSB7XG4gICAgY29uc3Qgam9iQ2lJZCA9IEhwZUFwaVBpcGVsaW5lLmpvYklkKHN0ZXBTdGF0dXMucGlwZWxpbmVJZCwgc3RlcFN0YXR1cy5zdGVwSWQpO1xuICAgIGNvbnN0IHJvb3RKb2JDaUlkID0gSHBlQXBpUGlwZWxpbmUuam9iSWQoc3RlcFN0YXR1cy5waXBlbGluZUlkLCAncGlwZWxpbmUnKTtcblxuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICBzZXJ2ZXJDaUlkOiBzdGVwU3RhdHVzLnNlcnZlckluc3RhbmNlSWQsXG4gICAgICBqb2JDaUlkLFxuICAgICAgYnVpbGRDaUlkOiBzdGVwU3RhdHVzLmJ1aWxkSWQsXG4gICAgICBidWlsZE5hbWU6IHN0ZXBTdGF0dXMuYnVpbGROYW1lLFxuICAgICAgc3RhcnRUaW1lOiBzdGVwU3RhdHVzLnN0YXJ0VGltZSxcbiAgICAgIGR1cmF0aW9uOiBzdGVwU3RhdHVzLmR1cmF0aW9uLFxuICAgICAgc3RhdHVzOiBzdGVwU3RhdHVzLnN0YXR1cyxcbiAgICAgIHJlc3VsdDogc3RlcFN0YXR1cy5yZXN1bHQsXG4gICAgfTtcblxuICAgIGlmIChqb2JDaUlkICE9PSByb290Sm9iQ2lJZCkge1xuICAgICAgZGF0YS5jYXVzZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBqb2JDaUlkOiByb290Sm9iQ2lJZCxcbiAgICAgICAgICBidWlsZENpSWQ6IHN0ZXBTdGF0dXMuYnVpbGRJZCxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIHVyaTogVXRpbC5mb3JtYXQoJyVzL2FuYWx5dGljcy9jaS9idWlsZHMvJywgSHBlQXBpLmdldFdvcmtzcGFjZVVyaShzZXNzaW9uKSksXG4gICAgICBqc29uOiB0cnVlLFxuICAgICAgYm9keTogZGF0YSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIFJlcXVlc3RSeFxuICAgICAgLnB1dChzZXNzaW9uLnJlcXVlc3QsIG9wdGlvbnMpXG4gICAgICAubWFwKHJlc3BvbnNlID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDIwMCkge1xuICAgICAgICAgIHRocm93IG5ldyBIcGVBcGlFcnJvcihcbiAgICAgICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUsXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShyZXNwb25zZS5ib2R5LCBudWxsLCAyKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gXy5hc3NpZ24oe30sIHJlc3BvbnNlLmJvZHksIGRhdGEpO1xuICAgICAgfSk7XG4gIH1cblxuICBzdGF0aWMgcmVwb3J0UGlwZWxpbmVUZXN0UmVzdWx0cyhzZXNzaW9uLCB0ZXN0UmVzdWx0KSB7XG4gICAgY29uc3Qgam9iQ2lJZCA9IEhwZUFwaVBpcGVsaW5lLmpvYklkKHRlc3RSZXN1bHQucGlwZWxpbmVJZCwgdGVzdFJlc3VsdC5zdGVwSWQpO1xuICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgWG1sMmpzLkJ1aWxkZXIoKTtcbiAgICBjb25zdCBkYXRhID0gYnVpbGRlci5idWlsZE9iamVjdCh7XG4gICAgICB0ZXN0X3Jlc3VsdDoge1xuICAgICAgICBidWlsZDoge1xuICAgICAgICAgICQ6IHtcbiAgICAgICAgICAgIHNlcnZlcl9pZDogdGVzdFJlc3VsdC5zZXJ2ZXJJbnN0YW5jZUlkLFxuICAgICAgICAgICAgam9iX2lkOiBqb2JDaUlkLFxuICAgICAgICAgICAgam9iX25hbWU6IGpvYkNpSWQsXG4gICAgICAgICAgICBidWlsZF9pZDogdGVzdFJlc3VsdC5idWlsZElkLFxuICAgICAgICAgICAgYnVpbGRfbmFtZTogdGVzdFJlc3VsdC5idWlsZElkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHRlc3RfcnVuczoge1xuICAgICAgICAgIHRlc3RfcnVuOiB7XG4gICAgICAgICAgICAkOiB7XG4gICAgICAgICAgICAgIG5hbWU6IHRlc3RSZXN1bHQudGVzdFJ1bnNbMF0udGVzdE5hbWUsXG4gICAgICAgICAgICAgIHN0YXJ0ZWQ6IHRlc3RSZXN1bHQudGVzdFJ1bnNbMF0uc3RhcnRlZCxcbiAgICAgICAgICAgICAgZHVyYXRpb246IHRlc3RSZXN1bHQudGVzdFJ1bnNbMF0uZHVyYXRpb24sXG4gICAgICAgICAgICAgIHN0YXR1czogdGVzdFJlc3VsdC50ZXN0UnVuc1swXS5zdGF0dXMsXG4gICAgICAgICAgICAgIG1vZHVsZTogdGVzdFJlc3VsdC50ZXN0UnVuc1swXS5tb2R1bGUsXG4gICAgICAgICAgICAgIHBhY2thZ2U6IHRlc3RSZXN1bHQudGVzdFJ1bnNbMF0ucGFja2FnZSxcbiAgICAgICAgICAgICAgY2xhc3M6IHRlc3RSZXN1bHQudGVzdFJ1bnNbMF0uY2xhc3MsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIHVyaTogVXRpbC5mb3JtYXQoJyVzL3Rlc3QtcmVzdWx0cy8nLCBIcGVBcGkuZ2V0V29ya3NwYWNlVXJpKHNlc3Npb24pKSxcbiAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veG1sJyxcbiAgICAgIGJvZHk6IGRhdGEsXG4gICAgfTtcblxuICAgIHJldHVybiBSZXF1ZXN0UnhcbiAgICAgIC5wb3N0KHNlc3Npb24ucmVxdWVzdCwgb3B0aW9ucylcbiAgICAgIC5tYXAocmVzcG9uc2UgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSAhPT0gMjAyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEhwZUFwaUVycm9yKFxuICAgICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzQ29kZSxcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmJvZHksIG51bGwsIDIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfLmFzc2lnbih7fSwgcmVzcG9uc2UuYm9keSwgZGF0YSk7XG4gICAgICB9KTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
