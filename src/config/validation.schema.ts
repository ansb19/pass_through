import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production').required(),
    NODE_NETWORK: Joi.string().valid('localhost', 'remote').required(),
    PORT: Joi.number().default(3000),

    DB_TYPE: Joi.string().default('postgres').required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),

    SESSION_SECRET: Joi.string().required(),
    EMAIL_SERVICE: Joi.string().required(),
    EMAIL_HOST: Joi.string().required(),
    EMAIL_PORT: Joi.number().required(),
    EMAIL_USER: Joi.string().required(),
    EMAIL_PASSWORD: Joi.string().required(),

    SMS_API_KEY: Joi.string().required(),
    SMS_API_SECRET: Joi.string().required(),
    SENDER_PHONE: Joi.string().required(),

});