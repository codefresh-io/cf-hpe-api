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