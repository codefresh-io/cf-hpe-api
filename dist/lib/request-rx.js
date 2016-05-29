'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestRx = undefined;

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RequestRx = exports.RequestRx = {};

RequestRx.get = function (request, options) {
  return _rx2.default.Observable.create(function (observer) {
    return request.get(options, function (error, response) {
      if (error) {
        observer.onError(error);
        return;
      }

      observer.onNext(response);
      observer.onCompleted();
    });
  });
};

RequestRx.post = function (request, options) {
  return _rx2.default.Observable.create(function (observer) {
    request.post(options, function (error, response) {
      if (error) {
        observer.onError(error);
        return;
      }

      observer.onNext(response);
      observer.onCompleted();
    });
  });
};

RequestRx.put = function (request, options) {
  return _rx2.default.Observable.create(function (observer) {
    request.put(options, function (error, response) {
      if (error) {
        observer.onError(error);
        return;
      }

      observer.onNext(response);
      observer.onCompleted();
    });
  });
};

RequestRx.delete = function (request, options) {
  return _rx2.default.Observable.create(function (observer) {
    request.delete(options, function (error, response) {
      if (error) {
        observer.onError(error);
        return;
      }

      observer.onNext(response);
      observer.onCompleted();
    });
  });
};