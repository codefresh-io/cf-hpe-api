'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HpeApiConfig = undefined;

var _immutable = require('immutable');

var HpeApiConfig = exports.HpeApiConfig = (0, _immutable.Record)({
  hpeServerUrl: null,
  hpeUser: null,
  hpePassword: null,
  hpeSharedSpace: null,
  hpeWorkspace: null
}); /* eslint-disable new-cap */


HpeApiConfig.create = function (hpeServerUrl, hpeUser, hpePassword, hpeSharedSpace, hpeWorkspace) {
  return new HpeApiConfig({
    hpeServerUrl: hpeServerUrl,
    hpeUser: hpeUser,
    hpePassword: hpePassword,
    hpeSharedSpace: hpeSharedSpace,
    hpeWorkspace: hpeWorkspace
  });
};