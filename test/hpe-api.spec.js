/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import R from 'ramda';
import util from 'util';
import { expect } from 'chai';
import {
  HpeApiConfig,
  HpeApiSession,
  HpeApiBuildSession,
  HpeApiPipeline,
  HpeApiTestResult,
} from 'cf-hpe-api';

const hpeApiConfig = HpeApiConfig.create(
  process.env.CF_HPE_SERVER_URL,
  process.env.CF_HPE_USER,
  process.env.CF_HPE_PASSWORD,
  process.env.CF_HPE_SHARED_SPACE,
  process.env.CF_HPE_WORKSPACE);

describe('HpeApi', function () {
  this.slow(5000);
  this.timeout(15000);

  this.session = null;
  this.buildSession = null;
  this.ciServerId = null;
  this.ciServerHpeId = null;
  this.pipelineId = null;
  this.buildStartTime = null;

  const makeId = R.compose(R.toLower, (R.replace(' ', '-')));

  function reportPipelineStepStatusHelper(test, stepId, status, result, done) {
    HpeApiBuildSession
      .reportBuildPipelineStepStatus(
        test.buildSession,
        stepId,
        test.buildStartTime,
        Date.now() - test.buildStartTime,
        status,
        result)
      .subscribe(
        () => done(),
        error => done(error));
  }

  it('Should create a session', function (done) {
    HpeApiSession
      .create(hpeApiConfig)
      .subscribe(
        session => {
          this.session = session;
          done();
        },
        error => done(error));
  });

  it('Should create a CI server', function (done) {
    const ciServerName = util.format('Codefresh %d', Date.now());
    const ciServerId = makeId(ciServerName);

    HpeApiSession
      .createCiServer(this.session, ciServerId, ciServerName)
      .subscribe(
        response => {
          expect(response.id).to.be.a('number');
          expect(response.instance_id).to.equal(ciServerId);
          expect(response.name).to.equal(ciServerName);
          expect(response.server_type).to.equal('Codefresh');

          this.ciServerId = ciServerId;
          this.ciServerHpeId = response.id;
          done();
        },
        error => done(error));
  });

  it('Should find a CI server', function (done) {
    HpeApiSession
      .findCiServer(this.session, this.ciServerId)
      .subscribe(
        response => {
          expect(response.id).to.be.a('number');
          expect(response.instance_id).to.equal(this.ciServerId);
          done();
        },
        error => done(error));
  });

  it('Should create a CI server pipeline ', function (done) {
    const pipelineName = util.format('Pipeline %d', Date.now());
    const pipelineId = makeId(pipelineName);

    HpeApiSession
      .createPipeline(this.session, this.ciServerHpeId, pipelineId, pipelineName)
      .subscribe(
        response => {
          expect(response.id).to.be.a('number');
          expect(response.root_job.id).to.be.a('number');
          expect(response.ci_server.id).to.equal(this.ciServerHpeId);
          expect(response.name).to.equal(pipelineName);

          const pipelineJobs = HpeApiPipeline.jobs(pipelineId);
          expect(response.root_job_ci_id).to.equal(pipelineJobs[0].jobCiId);
          expect(response.jobs[0].jobCiId).to.equal(pipelineJobs[0].jobCiId);
          expect(response.jobs[1].jobCiId).to.equal(pipelineJobs[1].jobCiId);
          expect(response.jobs[2].jobCiId).to.equal(pipelineJobs[2].jobCiId);
          expect(response.jobs[3].jobCiId).to.equal(pipelineJobs[3].jobCiId);
          expect(response.jobs[4].jobCiId).to.equal(pipelineJobs[4].jobCiId);
          expect(response.jobs[5].jobCiId).to.equal(pipelineJobs[5].jobCiId);
          expect(response.jobs[6].jobCiId).to.equal(pipelineJobs[6].jobCiId);
          expect(response.jobs[7].jobCiId).to.equal(pipelineJobs[7].jobCiId);

          this.pipelineId = pipelineId;
          done();
        },
        error => done(error));
  });

  it('Should create build session', function () {
    const buildName = util.format('Build %d', Date.now());
    const buildId = makeId(buildName);

    this.buildSession = HpeApiBuildSession.create(
      this.session,
      this.ciServerId,
      this.pipelineId,
      buildId,
      buildName
    );
  });

  it('Should report pipeline status as "running"', function (done) {
    const buildStartTime = Date.now();

    HpeApiBuildSession
      .reportBuildPipelineStepStatus(
        this.buildSession,
        'pipeline',
        buildStartTime,
        0,
        'running',
        'unavailable')
      .subscribe(
        () => {
          this.buildStartTime = buildStartTime;
          done();
        },
        error => done(error));
  });

  it('Should report pipeline step "clone-repository" status as "finished"', function (done) {
    reportPipelineStepStatusHelper(this, 'clone-repository', 'finished', 'success', done);
  });

  it('Should report pipeline step "build-dockerfile" status as "finished"', function (done) {
    reportPipelineStepStatusHelper(this, 'build-dockerfile', 'finished', 'success', done);
  });

  it('Should report pipeline step "unit-test-script" status as "finished"', function (done) {
    reportPipelineStepStatusHelper(this, 'unit-test-script', 'finished', 'success', done);
  });

  it('Should report pipeline step "push-docker-registry" status as "finished"', function (done) {
    reportPipelineStepStatusHelper(this, 'push-docker-registry', 'finished', 'success', done);
  });

  it('Should report pipeline step "integration-test-script" status as "finished"', function (done) {
    reportPipelineStepStatusHelper(this, 'integration-test-script', 'finished', 'success', done);
  });

  it('Should report pipeline step "security-validation" status as "finished"', function (done) {
    reportPipelineStepStatusHelper(this, 'security-validation', 'finished', 'success', done);
  });

  it('Should report pipeline step "deploy-script" status as "finished"', function (done) {
    reportPipelineStepStatusHelper(this, 'deploy-script', 'finished', 'success', done);
  });

  it('Should publish test success results #1', function (done) {
    const testResult = HpeApiTestResult.create(
      'Should pass unit test #1',
      Date.now(),
      1000,
      'Passed',
      'cf-hpe',
      'test-1',
      'hpe');

    HpeApiBuildSession
      .reportBuildPipelineTestResults(this.buildSession, 'unit-test-script', [testResult])
      .subscribe(() => done(),
        error => done(error));
  });

  it('Should publish test failed results #2', function (done) {
    const testResult = HpeApiTestResult.create(
      'Should pass unit test #2',
      Date.now(),
      1000,
      'Failed',
      'cf-hpe',
      'test-1',
      'hpe',
      'exception',
      'Should pass unit test #2',
      'at org.junit.Assert.fail(Assert.java:88)\n' +
      'at org.junit.Assert.failNotEquals(Assert.java:743)');

    HpeApiBuildSession
      .reportBuildPipelineTestResults(this.buildSession, 'unit-test-script', [testResult])
      .subscribe(() => done(),
        error => done(error));
  });

  it('Should publish test success results #3', function (done) {
    const testResult = HpeApiTestResult.create(
      'Should pass integration test #1',
      Date.now(),
      1000,
      'Passed',
      'cf-hpe',
      'test-2',
      'hpe');

    HpeApiBuildSession
      .reportBuildPipelineTestResults(this.buildSession, 'integration-test-script', [testResult])
      .subscribe(() => done(),
        error => done(error));
  });

  it('Should publish test failed results #4', function (done) {
    const testResult = HpeApiTestResult.create(
      'Should pass integration test #2',
      Date.now(),
      1000,
      'Failed',
      'cf-hpe',
      'test-2',
      'hpe',
      'exception',
      'Should pass integration test #2',
      'at org.junit.Assert.fail(Assert.java:88)\n' +
      'at org.junit.Assert.failNotEquals(Assert.java:743)');

    HpeApiBuildSession
      .reportBuildPipelineTestResults(this.buildSession, 'integration-test-script', [testResult])
      .subscribe(() => done(),
        error => done(error));
  });

  it('Should report pipeline status as "finished"', function (done) {
    HpeApiBuildSession
      .reportBuildPipelineStepStatus(
        this.buildSession,
        'pipeline',
        this.buildStartTime,
        Date.now() - this.buildStartTime,
        'finished',
        'success')
      .subscribe(
        () => done(),
        error => done(error));
  });
});
