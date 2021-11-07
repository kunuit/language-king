import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  JWT_SECRET_ACCESS: Joi.string().required(),
  EXPIRES_IN_ACCESS: Joi.number().required(),
  JWT_SECRET_REFRESH: Joi.string().required(),
  EXPIRES_IN_REFRESH: Joi.number().required(),
});
