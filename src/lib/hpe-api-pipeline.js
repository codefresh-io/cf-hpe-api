/* eslint-disable new-cap */
import util from 'util';
import { List } from 'immutable';

const pipelineSteps = List([
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
]);

export const HpeApiPipeline = {};

HpeApiPipeline.steps = () => pipelineSteps;

HpeApiPipeline.jobs = (pipelineId) =>
  HpeApiPipeline
    .steps()
    .reduce(
      (result, step) => {
        result.push({
          jobCiId: HpeApiPipeline.jobIdForStep(pipelineId, step.id),
          name: step.name,
        });
        return result;
      },
      []);

HpeApiPipeline.jobIdForStep = (pipelineId, stepId) =>
  util.format('%s-%s', pipelineId, stepId);
