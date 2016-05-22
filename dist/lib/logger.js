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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9sb2dnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7QUFFTyxJQUFNLDBCQUFTLEVBQWY7O0FBRVAsSUFBTSxnQkFBZ0IsU0FBaEIsYUFBZ0IsQ0FBQyxLQUFELEVBQVEsUUFBUixFQUFrQixPQUFsQjtBQUFBLG9DQUE4QixJQUE5QjtBQUE4QixRQUE5QjtBQUFBOztBQUFBLFNBQ3BCLFFBQVEsS0FBUixFQUFlLGVBQUssTUFBTCxDQUNiLG1CQURhLEVBRWIsSUFBSSxJQUFKLEdBQVcsV0FBWCxFQUZhLEVBR2IsS0FIYSxFQUliLFFBSmEsRUFLYixnQkFBRSxLQUFGLENBQVEsZUFBSyxNQUFiLEdBQXNCLE9BQXRCLFNBQWtDLElBQWxDLEVBTGEsQ0FBZixDQURvQjtBQUFBLENBQXRCOztBQVFBLE9BQU8sR0FBUCxHQUFhLGdCQUFFLEtBQUYsQ0FBUSxhQUFSLENBQWI7QUFDQSxPQUFPLEtBQVAsR0FBZSxPQUFPLEdBQVAsQ0FBVyxPQUFYLENBQWY7QUFDQSxPQUFPLElBQVAsR0FBYyxPQUFPLEdBQVAsQ0FBVyxNQUFYLENBQWQ7QUFDQSxPQUFPLElBQVAsR0FBYyxPQUFPLEdBQVAsQ0FBVyxNQUFYLENBQWQ7QUFDQSxPQUFPLEtBQVAsR0FBZSxPQUFPLEdBQVAsQ0FBVyxPQUFYLENBQWY7QUFDQSxPQUFPLFNBQVAsR0FBbUIsT0FBTyxHQUFQLENBQVcsV0FBWCxDQUFuQjs7QUFFQSxPQUFPLE1BQVAsR0FBZ0IsVUFBQyxRQUFEO0FBQUEsU0FBZTtBQUM3QixzQkFENkI7QUFFN0IsV0FBTyxPQUFPLEtBQVAsQ0FBYSxRQUFiLENBRnNCO0FBRzdCLFVBQU0sT0FBTyxJQUFQLENBQVksUUFBWixDQUh1QjtBQUk3QixVQUFNLE9BQU8sSUFBUCxDQUFZLFFBQVosQ0FKdUI7QUFLN0IsV0FBTyxPQUFPLEtBQVAsQ0FBYSxRQUFiLENBTHNCO0FBTTdCLGVBQVcsT0FBTyxTQUFQLENBQWlCLFFBQWpCO0FBTmtCLEdBQWY7QUFBQSxDQUFoQiIsImZpbGUiOiJsaWIvbG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuaW1wb3J0IFIgZnJvbSAncmFtZGEnO1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCc7XG5cbmV4cG9ydCBjb25zdCBMb2dnZXIgPSB7fTtcblxuY29uc3QgbG9nRm9ybWF0TGluZSA9IChsZXZlbCwgY2F0ZWdvcnksIG1lc3NhZ2UsIC4uLmFyZ3MpID0+XG4gIGNvbnNvbGVbbGV2ZWxdKHV0aWwuZm9ybWF0KFxuICAgICdbJXNdIFslc10gJXMgLSAlcycsXG4gICAgbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIGxldmVsLFxuICAgIGNhdGVnb3J5LFxuICAgIFIuYXBwbHkodXRpbC5mb3JtYXQsIFttZXNzYWdlLCAuLi5hcmdzXSkpKTtcblxuTG9nZ2VyLmxvZyA9IFIuY3VycnkobG9nRm9ybWF0TGluZSk7XG5Mb2dnZXIuZGVidWcgPSBMb2dnZXIubG9nKCdkZWJ1ZycpO1xuTG9nZ2VyLmluZm8gPSBMb2dnZXIubG9nKCdpbmZvJyk7XG5Mb2dnZXIud2FybiA9IExvZ2dlci5sb2coJ3dhcm4nKTtcbkxvZ2dlci5lcnJvciA9IExvZ2dlci5sb2coJ2Vycm9yJyk7XG5Mb2dnZXIuZXhjZXB0aW9uID0gTG9nZ2VyLmxvZygnZXhjZXB0aW9uJyk7XG5cbkxvZ2dlci5jcmVhdGUgPSAoY2F0ZWdvcnkpID0+ICh7XG4gIGNhdGVnb3J5LFxuICBkZWJ1ZzogTG9nZ2VyLmRlYnVnKGNhdGVnb3J5KSxcbiAgaW5mbzogTG9nZ2VyLmluZm8oY2F0ZWdvcnkpLFxuICB3YXJuOiBMb2dnZXIud2FybihjYXRlZ29yeSksXG4gIGVycm9yOiBMb2dnZXIuZXJyb3IoY2F0ZWdvcnkpLFxuICBleGNlcHRpb246IExvZ2dlci5leGNlcHRpb24oY2F0ZWdvcnkpLFxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
