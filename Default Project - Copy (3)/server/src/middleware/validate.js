import { ApiError } from '../utils/errors.js';

/**
 * Validates req.body against a zod schema and replaces it with the parsed,
 * stripped value. Returns 422 with per-field messages the UI can display.
 */
export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'form',
        message: issue.message,
      }));
      return next(new ApiError(422, errors[0]?.message || 'Please check the form and try again.', errors));
    }
    req.body = result.data;
    next();
  };
}
