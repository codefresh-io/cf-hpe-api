'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestRx = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RequestRx = exports.RequestRx = function () {
  function RequestRx() {
    _classCallCheck(this, RequestRx);
  }

  _createClass(RequestRx, null, [{
    key: 'get',
    value: function get(request, options) {
      return _rx2.default.Observable.create(function (observer) {
        request.get(options, function (error, response) {
          if (error) {
            observer.onError(error);
            return;
          }

          observer.onNext(response);
          observer.onCompleted();
        });
      });
    }
  }, {
    key: 'post',
    value: function post(request, options) {
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
    }
  }, {
    key: 'put',
    value: function put(request, options) {
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
    }
  }, {
    key: 'delete',
    value: function _delete(request, options) {
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
    }
  }]);

  return RequestRx;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9yZXF1ZXN0LXJ4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7Ozs7OztJQUVhLFMsV0FBQSxTOzs7Ozs7O3dCQUNBLE8sRUFBUyxPLEVBQVM7QUFDM0IsYUFBTyxhQUFHLFVBQUgsQ0FBYyxNQUFkLENBQXFCLG9CQUFZO0FBQ3RDLGdCQUFRLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLFVBQUMsS0FBRCxFQUFRLFFBQVIsRUFBcUI7QUFDeEMsY0FBSSxLQUFKLEVBQVc7QUFDVCxxQkFBUyxPQUFULENBQWlCLEtBQWpCO0FBQ0E7QUFDRDs7QUFFRCxtQkFBUyxNQUFULENBQWdCLFFBQWhCO0FBQ0EsbUJBQVMsV0FBVDtBQUNELFNBUkQ7QUFTRCxPQVZNLENBQVA7QUFXRDs7O3lCQUVXLE8sRUFBUyxPLEVBQVM7QUFDNUIsYUFBTyxhQUFHLFVBQUgsQ0FBYyxNQUFkLENBQXFCLG9CQUFZO0FBQ3RDLGdCQUFRLElBQVIsQ0FBYSxPQUFiLEVBQXNCLFVBQUMsS0FBRCxFQUFRLFFBQVIsRUFBcUI7QUFDekMsY0FBSSxLQUFKLEVBQVc7QUFDVCxxQkFBUyxPQUFULENBQWlCLEtBQWpCO0FBQ0E7QUFDRDs7QUFFRCxtQkFBUyxNQUFULENBQWdCLFFBQWhCO0FBQ0EsbUJBQVMsV0FBVDtBQUNELFNBUkQ7QUFTRCxPQVZNLENBQVA7QUFXRDs7O3dCQUVVLE8sRUFBUyxPLEVBQVM7QUFDM0IsYUFBTyxhQUFHLFVBQUgsQ0FBYyxNQUFkLENBQXFCLG9CQUFZO0FBQ3RDLGdCQUFRLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLFVBQUMsS0FBRCxFQUFRLFFBQVIsRUFBcUI7QUFDeEMsY0FBSSxLQUFKLEVBQVc7QUFDVCxxQkFBUyxPQUFULENBQWlCLEtBQWpCO0FBQ0E7QUFDRDs7QUFFRCxtQkFBUyxNQUFULENBQWdCLFFBQWhCO0FBQ0EsbUJBQVMsV0FBVDtBQUNELFNBUkQ7QUFTRCxPQVZNLENBQVA7QUFXRDs7OzRCQUVhLE8sRUFBUyxPLEVBQVM7QUFDOUIsYUFBTyxhQUFHLFVBQUgsQ0FBYyxNQUFkLENBQXFCLG9CQUFZO0FBQ3RDLGdCQUFRLE1BQVIsQ0FBZSxPQUFmLEVBQXdCLFVBQUMsS0FBRCxFQUFRLFFBQVIsRUFBcUI7QUFDM0MsY0FBSSxLQUFKLEVBQVc7QUFDVCxxQkFBUyxPQUFULENBQWlCLEtBQWpCO0FBQ0E7QUFDRDs7QUFFRCxtQkFBUyxNQUFULENBQWdCLFFBQWhCO0FBQ0EsbUJBQVMsV0FBVDtBQUNELFNBUkQ7QUFTRCxPQVZNLENBQVA7QUFXRCIsImZpbGUiOiJsaWIvcmVxdWVzdC1yeC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSeCBmcm9tICdyeCc7XG5cbmV4cG9ydCBjbGFzcyBSZXF1ZXN0Ungge1xuICBzdGF0aWMgZ2V0KHJlcXVlc3QsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gUnguT2JzZXJ2YWJsZS5jcmVhdGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgcmVxdWVzdC5nZXQob3B0aW9ucywgKGVycm9yLCByZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBvYnNlcnZlci5vbkVycm9yKGVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBvYnNlcnZlci5vbk5leHQocmVzcG9uc2UpO1xuICAgICAgICBvYnNlcnZlci5vbkNvbXBsZXRlZCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgcG9zdChyZXF1ZXN0LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuY3JlYXRlKG9ic2VydmVyID0+IHtcbiAgICAgIHJlcXVlc3QucG9zdChvcHRpb25zLCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIG9ic2VydmVyLm9uRXJyb3IoZXJyb3IpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG9ic2VydmVyLm9uTmV4dChyZXNwb25zZSk7XG4gICAgICAgIG9ic2VydmVyLm9uQ29tcGxldGVkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBwdXQocmVxdWVzdCwgb3B0aW9ucykge1xuICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmNyZWF0ZShvYnNlcnZlciA9PiB7XG4gICAgICByZXF1ZXN0LnB1dChvcHRpb25zLCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIG9ic2VydmVyLm9uRXJyb3IoZXJyb3IpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG9ic2VydmVyLm9uTmV4dChyZXNwb25zZSk7XG4gICAgICAgIG9ic2VydmVyLm9uQ29tcGxldGVkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBkZWxldGUocmVxdWVzdCwgb3B0aW9ucykge1xuICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmNyZWF0ZShvYnNlcnZlciA9PiB7XG4gICAgICByZXF1ZXN0LmRlbGV0ZShvcHRpb25zLCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIG9ic2VydmVyLm9uRXJyb3IoZXJyb3IpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG9ic2VydmVyLm9uTmV4dChyZXNwb25zZSk7XG4gICAgICAgIG9ic2VydmVyLm9uQ29tcGxldGVkKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
