import _ from 'lodash';
import util from 'util';

const pipelineSteps = [
  {
    id: 'pipeline',
    name: 'Codefresh Build',
  },
  {
    id: 'clone-repository',
    name: 'Clone Repository',
  },
  {
    id: 'build-dockerfile',
    name: 'Build Dockerfile',
  },
  {
    id: 'unit-test-script',
    name: 'Unit Test Script',
  },
  {
    id: 'push-docker-registry',
    name: 'Push to Docker Registry',
  },
  {
    id: 'integration-test-script',
    name: 'Integration Test Script',
  },
  {
    id: 'security-validation',
    name: 'Security Validation',
  },
  {
    id: 'deploy-script',
    name: 'Deploy Script',
  },
];

export const HpeApiPipeline = {};

HpeApiPipeline.steps = () => pipelineSteps;

HpeApiPipeline.jobs = (pipelineId) =>
  _(HpeApiPipeline.steps())
    .map(step => {
      const result = {
        jobCiId: HpeApiPipeline.jobIdForStep(pipelineId, step.id),
        name: step.name,
      };

      return result;
    })
    .value();

HpeApiPipeline.jobIdForStep = (pipelineId, stepId) =>
  util.format('%s-%s', pipelineId, stepId);
