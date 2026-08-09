/**
 * 业务 API 统一出口
 */
import * as login from './login';
import * as dashboard from './dashboard';
import * as authzUser from './authz/user';
import * as authzRole from './authz/role';
import * as authzResource from './authz/resource';
import * as authzOrg from './authz/org';
import * as systemConfig from './system/config';
import * as systemDict from './system/dict';
import * as systemLog from './system/log';
import * as systemMessage from './system/message';
import * as toolCodegen from './tool/codegen';

export {
  login,
  dashboard,
  authzUser,
  authzRole,
  authzResource,
  authzOrg,
  systemConfig,
  systemDict,
  systemLog,
  systemMessage,
  toolCodegen,
};
