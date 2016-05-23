import util from 'util';

export const HpeApiError = {};

HpeApiError.create = (statusCode, message, ...args) => {
  const error = new Error();
  error.name = 'HpeApiError';
  error.statusCode = statusCode;
  error.message = message ? util.format(message, ...args) : '';
  return error;
};
