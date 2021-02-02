const boom = require('boom')

const validate = (data, schema) => {
  const { error } = schema.validate(data)
  return error
}

const validationHandler = (schema, check = 'body') => (req, res, next) => {
  const error = validate(req[check], schema)
  error ? next(boom.badRequest(error)) : next()
}

module.exports = validationHandler
