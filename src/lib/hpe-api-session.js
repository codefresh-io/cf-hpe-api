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
  session: null,
  ciServerId: null,
  pipelineId: null,
  buildId: null,
  buildName: null,
});

HpeApiBuildSession.create = (session, ciServerId, pipelineId, buildId, buildName) =>
  new HpeApiBuildSession({
    session,
    ciServerId,
    pipelineId,
    buildId,
    buildName,
  });
