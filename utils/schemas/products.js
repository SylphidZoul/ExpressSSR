const Joi = require('@hapi/joi')

const productTagSchema = Joi.array().items(Joi.string().max(10))

const productIdSchema = Joi.object({
  productId: Joi.string().pattern(/^[0-9a-fA-F]\{24}$/)
})

const createProductSchema = Joi.object({
  name: Joi.string().max(50).required(),
  price: Joi.number().min(1).max(1000000),
  image: Joi.string().required(),
  tags: productTagSchema
})

const updateProductSchema = Joi.object({
  name: Joi.string().max(50),
  price: Joi.number().min(1).max(1000000),
  image: Joi.string(),
  tags: productTagSchema
})

module.exports = {
  productIdSchema,
  productTagSchema,
  createProductSchema,
  updateProductSchema
}
