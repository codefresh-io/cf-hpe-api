'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HpeApiError = undefined;

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HpeApiError = exports.HpeApiError = {};

HpeApiError.create = function (statusCode, message) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var error = new Error();
  error.name = 'HpeApiError';
  error.statusCode = statusCode;
  error.message = message ? _util2.default.format.apply(_util2.default, [message].concat(args)) : '';
  return error;
};