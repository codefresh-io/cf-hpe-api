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

export const HpeApiBuildSession = Record({
  request: null,
  config: null,
});

HpeApiBuildSession.create = (request, config) => new HpeApiSession({
  request,
  config,
});
