/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name : ['hccampos'],
  /**
   * Your New Relic license key.
   */
  license_key : '4b03c38aec542f96087533a3e77a1575f398ecff',
  logging : {
    level : 'error'
  }
};
