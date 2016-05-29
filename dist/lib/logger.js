'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logger = undefined;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
var Logger = exports.Logger = {};

var logFormatLine = function logFormatLine(level, category, message) {
  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  return console[level](_util2.default.format('[%s] [%s] %s - %s', new Date().toISOString(), level, category, _ramda2.default.apply(_util2.default.format, [message].concat(args))));
};

Logger.log = _ramda2.default.curry(logFormatLine);
Logger.debug = Logger.log('debug');
Logger.info = Logger.log('info');
Logger.warn = Logger.log('warn');
Logger.error = Logger.log('error');
Logger.exception = Logger.log('exception');

Logger.create = function (category) {
  return {
    category: category,
    debug: Logger.debug(category),
    info: Logger.info(category),
    warn: Logger.warn(category),
    error: Logger.error(category),
    exception: Logger.exception(category)
  };
};