/* eslint-disable new-cap */
import { Record } from 'immutable';

export const HpeApiTestResult = Record({
  name: null,
  started: null,
  duration: null,
  status: null,
  errorType: null,
  errorMessage: null,
  errorStackTrace: null,
});

HpeApiTestResult.create = (
  name,
  started,
  duration,
  status,
  errorType,
  errorMessage,
  errorStackTrace) => {
  return new HpeApiTestResult({
    name,
    started,
    duration,
    status,
    errorType,
    errorMessage,
    errorStackTrace,
  });
};
