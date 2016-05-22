/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import './config.env';
import _ from 'lodash';
import util from 'util';
import { expect } from 'chai';
import { HpeApi, HpeApiPipeline } from 'cf-hpe-api';

describe('HpeApi', function () {
  this.slow(5000);
  this.timeout(15000);

  const testData = {
    session: null,
    serverId: null,
    serverInstanceId: null,
    pipelineId: null,
    rootJobBuildId: null,
    rootJobStartTime: null,
  };

  function reportPipelineStepStatusHelper(stepId, status, result, done) {
    const stepStatus = {
      stepId,
      serverInstanceId: testData.serverInstanceId,
      pipelineId: testData.pipelineId,
      buildId: testData.rootJobBuildId,
      startTime: testData.rootJobStartTime,
      duration: _.now() - testData.rootJobStartTime,
      status,
      result,
    };

    HpeApi
      .reportPipelineStepStatus(testData.session, stepStatus)
      .subscribe(
        () => done(),
        error => done(error));
  }

  it('Should open a session', function (done) {
    HpeApi
      .connect()
      .subscribe(
        session => {
          testData.session = session;
          done();
        },
        error => done(error));
  });

  it('Should create a CI server', function (done) {
    const serverName = util.format('Codefresh %d', _.now());
    const serverInstanceId = _.kebabCase(serverName);

    const server = {
      instanceId: serverInstanceId,
      name: serverName,
    };

    HpeApi
      .createCiServer(testData.session, server)
      .subscribe(
        response => {
          expect(response.id).to.be.a('number');
          expect(response.instance_id).to.equal(server.instanceId);
          expect(response.name).to.equal(server.name);
          expect(response.server_type).to.equal('Codefresh');

          testData.serverId = response.id;
          testData.serverInstanceId = response.instance_id;
          done();
        },
        error => done(error));
  });

  it('Should find a CI server', function (done) {
    HpeApi
      .findCiServer(testData.session, testData.serverInstanceId)
      .subscribe(
        response => {
          expect(response.id).to.be.a('number');
          expect(response.instance_id).to.equal(testData.serverInstanceId);
          done();
        },
        error => done(error));
  });

  it('Should create a CI server pipeline ', function (done) {
    const pipelineName = util.format('Pipeline %d', _.now());
    const pipelineId = _.kebabCase(pipelineName);

    const pipeline = {
      id: pipelineId,
      name: pipelineName,
      serverId: testData.serverId,
    };

    HpeApi
      .createPipeline(testData.session, pipeline)
      .subscribe(
        response => {
          expect(response.id).to.be.a('number');
          expect(response.root_job.id).to.be.a('number');
          expect(response.ci_server.id).to.equal(testData.serverId);
          expect(response.name).to.equal(pipeline.name);

          const pipelineJobs = HpeApiPipeline.jobs(pipeline.id);
          expect(response.root_job_ci_id).to.equal(pipelineJobs[0].jobCiId);
          expect(response.jobs[0].jobCiId).to.equal(pipelineJobs[0].jobCiId);
          expect(response.jobs[1].jobCiId).to.equal(pipelineJobs[1].jobCiId);
          expect(response.jobs[2].jobCiId).to.equal(pipelineJobs[2].jobCiId);
          expect(response.jobs[3].jobCiId).to.equal(pipelineJobs[3].jobCiId);
          expect(response.jobs[4].jobCiId).to.equal(pipelineJobs[4].jobCiId);
          expect(response.jobs[5].jobCiId).to.equal(pipelineJobs[5].jobCiId);
          expect(response.jobs[6].jobCiId).to.equal(pipelineJobs[6].jobCiId);
          expect(response.jobs[7].jobCiId).to.equal(pipelineJobs[7].jobCiId);

          testData.pipelineId = pipeline.id;
          done();
        },
        error => done(error));
  });

  it('Should report pipeline status as "running"', function (done) {
    const buildName = util.format('Build %d', _.now());
    const buildId = _.kebabCase(buildName);

    const stepStatus = {
      stepId: 'pipeline',
      serverInstanceId: testData.serverInstanceId,
      pipelineId: testData.pipelineId,
      buildId,
      buildName,
      startTime: _.now(),
      duration: undefined,
      status: 'running',
      result: 'unavailable',
    };

    HpeApi
      .reportPipelineStepStatus(testData.session, stepStatus)
      .subscribe(
        () => {
          testData.rootJobBuildId = stepStatus.buildId;
          testData.rootJobStartTime = stepStatus.startTime;
          done();
        },
        error => done(error));
  });

  it('Should report pipeline step "clone-repository" status as "finished"', function (done) {
    reportPipelineStepStatusHelper('clone-repository', 'finished', 'success', done);
  });

  it('Should report pipeline step "build-dockerfile" status as "finished"', function (done) {
    reportPipelineStepStatusHelper('build-dockerfile', 'finished', 'success', done);
  });

  it('Should report pipeline step "unit-test-script" status as "finished"', function (done) {
    reportPipelineStepStatusHelper('unit-test-script', 'finished', 'success', done);
  });

  it('Should report pipeline step "push-docker-registry" status as "finished"', function (done) {
    reportPipelineStepStatusHelper('push-docker-registry', 'finished', 'success', done);
  });

  it('Should report pipeline step "integration-test-script" status as "finished"', function (done) {
    reportPipelineStepStatusHelper('integration-test-script', 'finished', 'success', done);
  });

  it('Should report pipeline step "security-validation" status as "finished"', function (done) {
    reportPipelineStepStatusHelper('security-validation', 'finished', 'success', done);
  });

  it('Should report pipeline step "deploy-script" status as "finished"', function (done) {
    reportPipelineStepStatusHelper('deploy-script', 'finished', 'success', done);
  });

  it('Should publish test success results #1', function (done) {
    const testResult = {
      stepId: 'unit-test-script',
      serverInstanceId: testData.serverInstanceId,
      pipelineId: testData.pipelineId,
      buildId: testData.rootJobBuildId,
      testRuns: [
        {
          testName: 'Should pass unit test #1',
          started: _.now(),
          duration: 1000,
          status: 'Passed',
          package: 'cf-hpe',
          module: 'test-1',
          class: 'hpe',
        },
      ],
    };

    HpeApi
      .reportPipelineTestResults(testData.session, testResult)
      .subscribe(() => done(),
        error => done(error));
  });

  it('Should publish test failed results #2', function (done) {
    const testResult = {
      stepId: 'unit-test-script',
      serverInstanceId: testData.serverInstanceId,
      pipelineId: testData.pipelineId,
      buildId: testData.rootJobBuildId,
      testRuns: [
        {
          testName: 'Should pass unit test #2',
          started: _.now(),
          duration: 1000,
          status: 'Failed',
          package: 'cf-hpe',
          module: 'test-1',
          class: 'hpe',
        },
      ],
    };

    HpeApi
      .reportPipelineTestResults(testData.session, testResult)
      .subscribe(() => done(),
        error => done(error));
  });

  it('Should publish test success results #3', function (done) {
    const testResult = {
      stepId: 'integration-test-script',
      serverInstanceId: testData.serverInstanceId,
      pipelineId: testData.pipelineId,
      buildId: testData.rootJobBuildId,
      testRuns: [
        {
          testName: 'Should pass integration test #1',
          started: _.now(),
          duration: 1000,
          status: 'Passed',
          package: 'cf-hpe',
          module: 'test-2',
          class: 'hpe',
        },
      ],
    };

    HpeApi
      .reportPipelineTestResults(testData.session, testResult)
      .subscribe(() => done(),
        error => done(error));
  });

  it('Should publish test failed results #4', function (done) {
    const testResult = {
      stepId: 'integration-test-script',
      serverInstanceId: testData.serverInstanceId,
      pipelineId: testData.pipelineId,
      buildId: testData.rootJobBuildId,
      testRuns: [
        {
          testName: 'Should pass integration test #2',
          started: _.now(),
          duration: 1000,
          status: 'Failed',
          package: 'cf-hpe',
          module: 'test-2',
          class: 'hpe',
        },
      ],
    };

    HpeApi
      .reportPipelineTestResults(testData.session, testResult)
      .subscribe(() => done(),
        error => done(error));
  });

  it('Should report pipeline status as "finished"', function (done) {
    const stepStatus = {
      stepId: 'pipeline',
      serverInstanceId: testData.serverInstanceId,
      pipelineId: testData.pipelineId,
      buildId: testData.rootJobBuildId,
      startTime: testData.rootJobStartTime,
      duration: _.now() - testData.rootJobStartTime,
      status: 'finished',
      result: 'success',
    };

    HpeApi
      .reportPipelineStepStatus(testData.session, stepStatus)
      .subscribe(() => done(),
        error => done(error));
  });
});
