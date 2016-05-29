'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HpeApiPipeline = undefined;

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable new-cap */


var pipelineSteps = (0, _immutable.List)([{
  id: 'pipeline',
  name: 'Codefresh Build'
}, {
  id: 'clone-repository',
  name: 'Clone Repository'
}, {
  id: 'build-dockerfile',
  name: 'Build Dockerfile'
}, {
  id: 'unit-test-script',
  name: 'Unit Test Script'
}, {
  id: 'push-docker-registry',
  name: 'Push to Docker Registry'
}, {
  id: 'integration-test-script',
  name: 'Integration Test Script'
}, {
  id: 'security-validation',
  name: 'Security Validation'
}, {
  id: 'deploy-script',
  name: 'Deploy Script'
}]);

var HpeApiPipeline = exports.HpeApiPipeline = {};

HpeApiPipeline.steps = function () {
  return pipelineSteps;
};

HpeApiPipeline.jobs = function (pipelineId) {
  return HpeApiPipeline.steps().reduce(function (result, step) {
    result.push({
      jobCiId: HpeApiPipeline.jobIdForStep(pipelineId, step.id),
      name: step.name
    });
    return result;
  }, []);
};

HpeApiPipeline.jobIdForStep = function (pipelineId, stepId) {
  return _util2.default.format('%s-%s', pipelineId, stepId);
};