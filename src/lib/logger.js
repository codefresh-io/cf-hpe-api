/* eslint-disable no-console */
import R from 'ramda';
import util from 'util';

export const Logger = {};

const logFormatLine = (level, category, message, ...args) =>
  console[level](util.format(
    '[%s] [%s] %s - %s',
    new Date().toISOString(),
    level,
    category,
    R.apply(util.format, [message, ...args])));

Logger.log = R.curry(logFormatLine);
Logger.debug = Logger.log('debug');
Logger.info = Logger.log('info');
Logger.warn = Logger.log('warn');
Logger.error = Logger.log('error');
Logger.exception = Logger.log('exception');

Logger.create = (category) => ({
  category,
  debug: Logger.debug(category),
  info: Logger.info(category),
  warn: Logger.warn(category),
  error: Logger.error(category),
  exception: Logger.exception(category),
});
