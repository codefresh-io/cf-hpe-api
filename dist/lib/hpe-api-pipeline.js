'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HpeApiPipeline = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pipelineSteps = [{
  id: 'pipeline',
  name: 'Codefresh Build'
}, {
  id: 'clone-repository',
  name: 'Clone Repository'
}, {
  id: 'build-dockerfile',
  name: 'Build Dockerfile'
}, {
  id: 'unit-test-script',
  name: 'Unit Test Script'
}, {
  id: 'push-docker-registry',
  name: 'Push to Docker Registry'
}, {
  id: 'integration-test-script',
  name: 'Integration Test Script'
}, {
  id: 'security-validation',
  name: 'Security Validation'
}, {
  id: 'deploy-script',
  name: 'Deploy Script'
}];

var HpeApiPipeline = exports.HpeApiPipeline = function () {
  function HpeApiPipeline() {
    _classCallCheck(this, HpeApiPipeline);
  }

  _createClass(HpeApiPipeline, null, [{
    key: 'steps',
    value: function steps() {
      return pipelineSteps;
    }
  }, {
    key: 'jobId',
    value: function jobId(pipelineId, stepId) {
      return _util2.default.format('%s-%s', pipelineId, stepId);
    }
  }, {
    key: 'jobs',
    value: function jobs(pipelineId) {
      return (0, _lodash2.default)(HpeApiPipeline.steps()).map(function (step) {
        var result = {
          jobCiId: HpeApiPipeline.jobId(pipelineId, step.id),
          name: step.name
        };

        return result;
      }).value();
    }
  }]);

  return HpeApiPipeline;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9ocGUtYXBpLXBpcGVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTSxnQkFBZ0IsQ0FDcEI7QUFDRSxNQUFJLFVBRE47QUFFRSxRQUFNO0FBRlIsQ0FEb0IsRUFLcEI7QUFDRSxNQUFJLGtCQUROO0FBRUUsUUFBTTtBQUZSLENBTG9CLEVBU3BCO0FBQ0UsTUFBSSxrQkFETjtBQUVFLFFBQU07QUFGUixDQVRvQixFQWFwQjtBQUNFLE1BQUksa0JBRE47QUFFRSxRQUFNO0FBRlIsQ0Fib0IsRUFpQnBCO0FBQ0UsTUFBSSxzQkFETjtBQUVFLFFBQU07QUFGUixDQWpCb0IsRUFxQnBCO0FBQ0UsTUFBSSx5QkFETjtBQUVFLFFBQU07QUFGUixDQXJCb0IsRUF5QnBCO0FBQ0UsTUFBSSxxQkFETjtBQUVFLFFBQU07QUFGUixDQXpCb0IsRUE2QnBCO0FBQ0UsTUFBSSxlQUROO0FBRUUsUUFBTTtBQUZSLENBN0JvQixDQUF0Qjs7SUFtQ2EsYyxXQUFBLGM7Ozs7Ozs7NEJBQ0k7QUFDYixhQUFPLGFBQVA7QUFDRDs7OzBCQUVZLFUsRUFBWSxNLEVBQVE7QUFDL0IsYUFBTyxlQUFLLE1BQUwsQ0FBWSxPQUFaLEVBQXFCLFVBQXJCLEVBQWlDLE1BQWpDLENBQVA7QUFDRDs7O3lCQUVXLFUsRUFBWTtBQUN0QixhQUFPLHNCQUFFLGVBQWUsS0FBZixFQUFGLEVBQ0osR0FESSxDQUNBLGdCQUFRO0FBQ1gsWUFBTSxTQUFTO0FBQ2IsbUJBQVMsZUFBZSxLQUFmLENBQXFCLFVBQXJCLEVBQWlDLEtBQUssRUFBdEMsQ0FESTtBQUViLGdCQUFNLEtBQUs7QUFGRSxTQUFmOztBQUtBLGVBQU8sTUFBUDtBQUNELE9BUkksRUFTSixLQVRJLEVBQVA7QUFVRCIsImZpbGUiOiJsaWIvaHBlLWFwaS1waXBlbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgdXRpbCBmcm9tICd1dGlsJztcblxuY29uc3QgcGlwZWxpbmVTdGVwcyA9IFtcbiAge1xuICAgIGlkOiAncGlwZWxpbmUnLFxuICAgIG5hbWU6ICdDb2RlZnJlc2ggQnVpbGQnLFxuICB9LFxuICB7XG4gICAgaWQ6ICdjbG9uZS1yZXBvc2l0b3J5JyxcbiAgICBuYW1lOiAnQ2xvbmUgUmVwb3NpdG9yeScsXG4gIH0sXG4gIHtcbiAgICBpZDogJ2J1aWxkLWRvY2tlcmZpbGUnLFxuICAgIG5hbWU6ICdCdWlsZCBEb2NrZXJmaWxlJyxcbiAgfSxcbiAge1xuICAgIGlkOiAndW5pdC10ZXN0LXNjcmlwdCcsXG4gICAgbmFtZTogJ1VuaXQgVGVzdCBTY3JpcHQnLFxuICB9LFxuICB7XG4gICAgaWQ6ICdwdXNoLWRvY2tlci1yZWdpc3RyeScsXG4gICAgbmFtZTogJ1B1c2ggdG8gRG9ja2VyIFJlZ2lzdHJ5JyxcbiAgfSxcbiAge1xuICAgIGlkOiAnaW50ZWdyYXRpb24tdGVzdC1zY3JpcHQnLFxuICAgIG5hbWU6ICdJbnRlZ3JhdGlvbiBUZXN0IFNjcmlwdCcsXG4gIH0sXG4gIHtcbiAgICBpZDogJ3NlY3VyaXR5LXZhbGlkYXRpb24nLFxuICAgIG5hbWU6ICdTZWN1cml0eSBWYWxpZGF0aW9uJyxcbiAgfSxcbiAge1xuICAgIGlkOiAnZGVwbG95LXNjcmlwdCcsXG4gICAgbmFtZTogJ0RlcGxveSBTY3JpcHQnLFxuICB9LFxuXTtcblxuZXhwb3J0IGNsYXNzIEhwZUFwaVBpcGVsaW5lIHtcbiAgc3RhdGljIHN0ZXBzKCkge1xuICAgIHJldHVybiBwaXBlbGluZVN0ZXBzO1xuICB9XG5cbiAgc3RhdGljIGpvYklkKHBpcGVsaW5lSWQsIHN0ZXBJZCkge1xuICAgIHJldHVybiB1dGlsLmZvcm1hdCgnJXMtJXMnLCBwaXBlbGluZUlkLCBzdGVwSWQpO1xuICB9XG5cbiAgc3RhdGljIGpvYnMocGlwZWxpbmVJZCkge1xuICAgIHJldHVybiBfKEhwZUFwaVBpcGVsaW5lLnN0ZXBzKCkpXG4gICAgICAubWFwKHN0ZXAgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgICAgam9iQ2lJZDogSHBlQXBpUGlwZWxpbmUuam9iSWQocGlwZWxpbmVJZCwgc3RlcC5pZCksXG4gICAgICAgICAgbmFtZTogc3RlcC5uYW1lLFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KVxuICAgICAgLnZhbHVlKCk7XG4gIH1cbn1cblxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
