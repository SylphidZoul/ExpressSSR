const express = require('express')
const path = require('path')
const boom = require('boom')
const debug = require('debug')('app:server')
const helmet = require('helmet')
const productsRouter = require('./routes/views/products')
const productsApi = require('./routes/api/products')
const authApiRouter = require('./routes/api/auth')
const { logErrors, wrapErrors, clientErrorHandler, errorHandler } = require('./utils/middleswares/errorHandlers')
const isRequestAjaxOrApi = require('./utils/isRequestAjaxOrApi')

const app = express()

app.use(helmet())
app.use(express.json())

app.use('/static', express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use('/products', productsRouter)
productsApi(app)
app.use('/api/auth', authApiRouter)

app.get('/', (req, res) => {
  res.redirect('/products')
})

app.use(function (req, res, next) {
  if (isRequestAjaxOrApi(req)) {
    const {
      output: { statusCode, payload }
    } = boom.notFound()
    res.status(statusCode).json(payload)
  } else {
    res.status(404).render('404')
  }
})

app.use(logErrors)
app.use(wrapErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

const server = app.listen(8000, () => {
  debug(`Listening http://localhost:${server.address().port}`)
})
