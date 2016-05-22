/* eslint-disable new-cap */
import { Record } from 'immutable';

export const HpeApiSession = Record({
  request: null,
  config: null,
});

HpeApiSession.create = (request, config) => new HpeApiSession({
  request,
  config,
});
