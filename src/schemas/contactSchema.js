import Joi from "joi";

const baseContactSchema = {
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal"),
};

export const createContactSchema = Joi.object({
  ...baseContactSchema,
  name: baseContactSchema.name.required(),
  phoneNumber: baseContactSchema.phoneNumber.required(),
  contactType: baseContactSchema.contactType.required(),
});

export const updateContactSchema = Joi.object(baseContactSchema).min(1);

// Ek olarak, açık şema tanımı
export const createContactSchemaExplicit = Joi.object({
  name: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal"),
});

export const updateContactSchemaExplicit = Joi.object({
  name: Joi.string(),
  phoneNumber: Joi.string(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal"),
});
