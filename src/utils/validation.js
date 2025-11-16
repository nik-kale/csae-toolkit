/**
 * Validation Utilities
 * Schema validation similar to Zod
 */

export class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export const Validator = {
  /**
   * String validator
   */
  string() {
    return {
      _type: 'string',
      _rules: [],
      _optional: false,

      min(length) {
        this._rules.push((value) => {
          if (value.length < length) {
            return `String must be at least ${length} characters`;
          }
        });
        return this;
      },

      max(length) {
        this._rules.push((value) => {
          if (value.length > length) {
            return `String must be at most ${length} characters`;
          }
        });
        return this;
      },

      email() {
        this._rules.push((value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return 'Invalid email format';
          }
        });
        return this;
      },

      url() {
        this._rules.push((value) => {
          try {
            new URL(value);
          } catch {
            return 'Invalid URL format';
          }
        });
        return this;
      },

      regex(pattern, message) {
        this._rules.push((value) => {
          if (!pattern.test(value)) {
            return message || 'String does not match pattern';
          }
        });
        return this;
      },

      optional() {
        this._optional = true;
        return this;
      },

      validate(value) {
        if (value === undefined || value === null) {
          if (this._optional) return { success: true, data: value };
          return { success: false, error: 'Value is required' };
        }

        if (typeof value !== 'string') {
          return { success: false, error: 'Value must be a string' };
        }

        for (const rule of this._rules) {
          const error = rule(value);
          if (error) {
            return { success: false, error };
          }
        }

        return { success: true, data: value };
      }
    };
  },

  /**
   * Number validator
   */
  number() {
    return {
      _type: 'number',
      _rules: [],
      _optional: false,

      min(value) {
        this._rules.push((v) => {
          if (v < value) {
            return `Number must be at least ${value}`;
          }
        });
        return this;
      },

      max(value) {
        this._rules.push((v) => {
          if (v > value) {
            return `Number must be at most ${value}`;
          }
        });
        return this;
      },

      positive() {
        return this.min(0);
      },

      integer() {
        this._rules.push((v) => {
          if (!Number.isInteger(v)) {
            return 'Number must be an integer';
          }
        });
        return this;
      },

      optional() {
        this._optional = true;
        return this;
      },

      validate(value) {
        if (value === undefined || value === null) {
          if (this._optional) return { success: true, data: value };
          return { success: false, error: 'Value is required' };
        }

        if (typeof value !== 'number' || isNaN(value)) {
          return { success: false, error: 'Value must be a number' };
        }

        for (const rule of this._rules) {
          const error = rule(value);
          if (error) {
            return { success: false, error };
          }
        }

        return { success: true, data: value };
      }
    };
  },

  /**
   * Boolean validator
   */
  boolean() {
    return {
      _type: 'boolean',
      _optional: false,

      optional() {
        this._optional = true;
        return this;
      },

      validate(value) {
        if (value === undefined || value === null) {
          if (this._optional) return { success: true, data: value };
          return { success: false, error: 'Value is required' };
        }

        if (typeof value !== 'boolean') {
          return { success: false, error: 'Value must be a boolean' };
        }

        return { success: true, data: value };
      }
    };
  },

  /**
   * Object validator
   */
  object(schema) {
    return {
      _type: 'object',
      _schema: schema,
      _optional: false,

      optional() {
        this._optional = true;
        return this;
      },

      validate(value) {
        if (value === undefined || value === null) {
          if (this._optional) return { success: true, data: value };
          return { success: false, error: 'Value is required' };
        }

        if (typeof value !== 'object' || Array.isArray(value)) {
          return { success: false, error: 'Value must be an object' };
        }

        const errors = {};
        const data = {};

        for (const [key, validator] of Object.entries(this._schema)) {
          const result = validator.validate(value[key]);
          if (!result.success) {
            errors[key] = result.error;
          } else {
            data[key] = result.data;
          }
        }

        if (Object.keys(errors).length > 0) {
          return { success: false, error: 'Validation failed', errors };
        }

        return { success: true, data };
      }
    };
  },

  /**
   * Array validator
   */
  array(elementValidator) {
    return {
      _type: 'array',
      _elementValidator: elementValidator,
      _rules: [],
      _optional: false,

      min(length) {
        this._rules.push((value) => {
          if (value.length < length) {
            return `Array must have at least ${length} elements`;
          }
        });
        return this;
      },

      max(length) {
        this._rules.push((value) => {
          if (value.length > length) {
            return `Array must have at most ${length} elements`;
          }
        });
        return this;
      },

      optional() {
        this._optional = true;
        return this;
      },

      validate(value) {
        if (value === undefined || value === null) {
          if (this._optional) return { success: true, data: value };
          return { success: false, error: 'Value is required' };
        }

        if (!Array.isArray(value)) {
          return { success: false, error: 'Value must be an array' };
        }

        for (const rule of this._rules) {
          const error = rule(value);
          if (error) {
            return { success: false, error };
          }
        }

        // Validate each element
        const data = [];
        const errors = [];

        for (let i = 0; i < value.length; i++) {
          const result = this._elementValidator.validate(value[i]);
          if (!result.success) {
            errors.push({ index: i, error: result.error });
          } else {
            data.push(result.data);
          }
        }

        if (errors.length > 0) {
          return { success: false, error: 'Array validation failed', errors };
        }

        return { success: true, data };
      }
    };
  }
};

// Common validation schemas
export const schemas = {
  settings: Validator.object({
    autoLoadStorage: Validator.boolean(),
    historyLimit: Validator.number().min(10).max(500),
    notificationDuration: Validator.number().min(1000).max(10000),
    enableKeyboardShortcuts: Validator.boolean()
  }),

  copyHistoryEntry: Validator.object({
    selector: Validator.string().min(1),
    value: Validator.string().optional(),
    timestamp: Validator.string(),
    id: Validator.number()
  }),

  storageData: Validator.object({}).optional(),

  theme: Validator.string().regex(/^(dark|light)$/, 'Theme must be dark or light')
};

export default {
  Validator,
  ValidationError,
  schemas
};
