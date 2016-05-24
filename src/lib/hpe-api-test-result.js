/* eslint-disable new-cap */
import { Record } from 'immutable';

export const HpeApiTestResult = Record({
  name: null,
  started: null,
  duration: null,
  status: null,
  package: null,
  module: null,
  class: null,
});

HpeApiTestResult.create = (name, started, duration, status, package_, module, class_) => {
  return new HpeApiTestResult({
    name,
    started,
    duration,
    status,
    package: package_,
    module,
    class: class_,
  });
};
