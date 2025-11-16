/**
 * CSAE Config Validator
 * Validates CSAE configuration structure and provides helpful error messages
 */

export function validateCSAEConfig(config) {
  const errors = [];
  const warnings = [];

  if (!config || typeof config !== 'object') {
    errors.push('Config must be a valid object');
    return { isValid: false, errors, warnings };
  }

  // Check for common CSAE config properties
  const expectedProps = ['campaigns', 'settings', 'version'];
  const actualProps = Object.keys(config);

  // Check if config has expected structure
  if (!actualProps.some(prop => expectedProps.includes(prop))) {
    warnings.push('Config may not be a valid CSAE configuration');
  }

  // Validate campaigns if present
  if (config.campaigns) {
    if (!Array.isArray(config.campaigns)) {
      errors.push('campaigns must be an array');
    } else {
      config.campaigns.forEach((campaign, index) => {
        if (!campaign.id) {
          errors.push(`Campaign at index ${index} is missing required 'id' field`);
        }
        if (!campaign.name) {
          warnings.push(`Campaign at index ${index} is missing 'name' field`);
        }
      });
    }
  }

  // Validate settings if present
  if (config.settings && typeof config.settings !== 'object') {
    errors.push('settings must be an object');
  }

  // Validate version if present
  if (config.version && typeof config.version !== 'string') {
    warnings.push('version should be a string');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function formatValidationResults(results) {
  let message = '';

  if (results.isValid) {
    message = '✅ Config is valid!\n';
  } else {
    message = '❌ Config has errors:\n';
  }

  if (results.errors.length > 0) {
    message += '\nErrors:\n' + results.errors.map(e => `  • ${e}`).join('\n');
  }

  if (results.warnings.length > 0) {
    message += '\n\nWarnings:\n' + results.warnings.map(w => `  ⚠️ ${w}`).join('\n');
  }

  return message;
}

export default {
  validateCSAEConfig,
  formatValidationResults
};
