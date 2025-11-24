import Joi from 'joi';

export const signupSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 6 characters long and include at least one number and one special character (!@#$%^&*).',
    }),
  role: Joi.string().valid('admin', 'employee').optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
