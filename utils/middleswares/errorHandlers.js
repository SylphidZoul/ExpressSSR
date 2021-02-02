const Sentry = require('@sentry/node')
const boom = require('boom')
const debug = require('debug')('app:error')
const { config } = require('../../config')
const isRequestAjaxOrApi = require('../isRequestAjaxOrApi')

const withErrorStack = (err, stack) => {
  if (config.dev) return { ...err, stack }
}

Sentry.init({ dsn: 'https://d20bd0d208e14a0c800a4808c67525c1@o505356.ingest.sentry.io/5593531' })

const logErrors = (err, res, req, next) => {
  Sentry.captureException(err)
  debug(err.stack)
  next(err)
}

const wrapErrors = (err, req, res, next) => {
  if (!err.isBoom) {
    next(boom.badImplementation(err))
  }

  next(err)
}

const clientErrorHandler = (err, req, res, next) => {
  const {
    output: { statusCode, payload }
  } = err

  // Catch errors for AJAX request or if an error ocurrs while streaming
  if (isRequestAjaxOrApi(req) || res.headersSent) {
    res.status(statusCode).json(withErrorStack(payload, err.stack))
  } else {
    next(err)
  }
}

const errorHandler = (err, req, res, next) => {
  const {
    output: { statusCode, payload }
  } = err

  res.status(statusCode)
  res.render('error', withErrorStack(payload, err.stack))
}

module.exports = {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  errorHandler
}
