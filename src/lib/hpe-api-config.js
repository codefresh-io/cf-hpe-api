import config from '12factor-config';

export const hpeApiConfig = config({
  hpeServerUrl: {
    env: 'CF_HPE_SERVER_URL',
    type: 'string',
    required: true,
  },

  hpeUser: {
    env: 'CF_HPE_USER',
    type: 'string',
    required: true,
  },

  hpePassword: {
    env: 'CF_HPE_PASSWORD',
    type: 'string',
    required: true,
  },

  hpeSharedSpace: {
    env: 'CF_HPE_SHARED_SPACE',
    type: 'string',
    required: true,
  },

  hpeWorkspace: {
    env: 'CF_HPE_WORKSPACE',
    type: 'string',
    required: true,
  },
});
