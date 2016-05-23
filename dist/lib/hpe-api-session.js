'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HpeApiBuildSession = exports.HpeApiSession = undefined;

var _immutable = require('immutable');

var HpeApiSession = exports.HpeApiSession = (0, _immutable.Record)({
  request: null,
  config: null
}); /* eslint-disable new-cap */


HpeApiSession.create = function (request, config) {
  return new HpeApiSession({
    request: request,
    config: config
  });
};

var HpeApiBuildSession = exports.HpeApiBuildSession = (0, _immutable.Record)({
  session: null,
  ciServerId: null,
  pipelineId: null,
  buildId: null,
  buildName: null
});

HpeApiBuildSession.create = function (session, ciServerId, pipelineId, buildId, buildName) {
  return new HpeApiBuildSession({
    session: session,
    ciServerId: ciServerId,
    pipelineId: pipelineId,
    buildId: buildId,
    buildName: buildName
  });
};