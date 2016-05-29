/* eslint-disable new-cap */
import { Record } from 'immutable';

export const HpeApiConfig = Record({
  hpeServerUrl: null,
  hpeUser: null,
  hpePassword: null,
  hpeSharedSpace: null,
  hpeWorkspace: null,
});

HpeApiConfig.create = (hpeServerUrl, hpeUser, hpePassword, hpeSharedSpace, hpeWorkspace) => {
  return new HpeApiConfig({
    hpeServerUrl,
    hpeUser,
    hpePassword,
    hpeSharedSpace,
    hpeWorkspace,
  });
};
