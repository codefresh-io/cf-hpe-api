'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hpeApiConfig = undefined;

var _factorConfig = require('12factor-config');

var _factorConfig2 = _interopRequireDefault(_factorConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hpeApiConfig = exports.hpeApiConfig = (0, _factorConfig2.default)({
  hpeServerUrl: {
    env: 'CF_HPE_SERVER_URL',
    type: 'string',
    required: true
  },

  hpeUser: {
    env: 'CF_HPE_USER',
    type: 'string',
    required: true
  },

  hpePassword: {
    env: 'CF_HPE_PASSWORD',
    type: 'string',
    required: true
  },

  hpeSharedSpace: {
    env: 'CF_HPE_SHARED_SPACE',
    type: 'string',
    required: true
  },

  hpeWorkspace: {
    env: 'CF_HPE_WORKSPACE',
    type: 'string',
    required: true
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9ocGUtYXBpLWNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUVPLElBQU0sc0NBQWUsNEJBQU87QUFDakMsZ0JBQWM7QUFDWixTQUFLLG1CQURPO0FBRVosVUFBTSxRQUZNO0FBR1osY0FBVTtBQUhFLEdBRG1COztBQU9qQyxXQUFTO0FBQ1AsU0FBSyxhQURFO0FBRVAsVUFBTSxRQUZDO0FBR1AsY0FBVTtBQUhILEdBUHdCOztBQWFqQyxlQUFhO0FBQ1gsU0FBSyxpQkFETTtBQUVYLFVBQU0sUUFGSztBQUdYLGNBQVU7QUFIQyxHQWJvQjs7QUFtQmpDLGtCQUFnQjtBQUNkLFNBQUsscUJBRFM7QUFFZCxVQUFNLFFBRlE7QUFHZCxjQUFVO0FBSEksR0FuQmlCOztBQXlCakMsZ0JBQWM7QUFDWixTQUFLLGtCQURPO0FBRVosVUFBTSxRQUZNO0FBR1osY0FBVTtBQUhFO0FBekJtQixDQUFQLENBQXJCIiwiZmlsZSI6ImxpYi9ocGUtYXBpLWNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb25maWcgZnJvbSAnMTJmYWN0b3ItY29uZmlnJztcblxuZXhwb3J0IGNvbnN0IGhwZUFwaUNvbmZpZyA9IGNvbmZpZyh7XG4gIGhwZVNlcnZlclVybDoge1xuICAgIGVudjogJ0NGX0hQRV9TRVJWRVJfVVJMJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgfSxcblxuICBocGVVc2VyOiB7XG4gICAgZW52OiAnQ0ZfSFBFX1VTRVInLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICB9LFxuXG4gIGhwZVBhc3N3b3JkOiB7XG4gICAgZW52OiAnQ0ZfSFBFX1BBU1NXT1JEJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgfSxcblxuICBocGVTaGFyZWRTcGFjZToge1xuICAgIGVudjogJ0NGX0hQRV9TSEFSRURfU1BBQ0UnLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICB9LFxuXG4gIGhwZVdvcmtzcGFjZToge1xuICAgIGVudjogJ0NGX0hQRV9XT1JLU1BBQ0UnLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICB9LFxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
