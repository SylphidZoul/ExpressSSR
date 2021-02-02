const express = require('express')
const passport = require('passport')
const ProductService = require('../../services/products')
const validation = require('../../utils/middleswares/validationHandler')
const {
  productIdSchema,
  createProductSchema,
  updateProductSchema
} = require('../../utils/schemas/products')

require('../../utils/auth/strategies/jwt')

const cacheResponse = require('../../utils/cacheResponse')
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../../utils/time')

const productService = new ProductService()

const productsApi = (app) => {
  const router = express()
  app.use('/api/products', router)

  router.get('/', async (req, res, next) => {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
    const { tags } = req.query

    try {
      const products = await productService.getProducts({ tags })
      res.status(200).json({
        data: products,
        message: 'Products listed'
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/:productId', async (req, res, next) => {
    cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
    const { productId } = req.params

    try {
      const product = await productService.getProduct({ productId })

      res.status(200).json({
        data: product,
        message: 'Product retrieved'
      })
    } catch (error) {
      next(error)
    }
  })

  router.post('/', passport.authenticate('jwt', { session: false }), validation(createProductSchema), async (req, res, next) => {
    try {
      const product = await productService.createProduct({ product: req.body })

      res.status(201).json({
        data: product,
        message: 'Products created'
      })
    } catch (error) {
      next(error)
    }
  })

  router.put(
    '/:productId',
    passport.authenticate('jwt', { session: false }),
    validation({ productId: productIdSchema }, 'params'),
    validation(updateProductSchema),
    async (req, res, next) => {
      const { productId } = req.params

      try {
        const product = await productService.updateProduct({ productId, product: req.body })

        res.status(200).json({
          data: product,
          message: 'Product updated'
        })
      } catch (error) {
        next(error)
      }
    }
  )

  router.delete('/productId', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    const { productId } = req.params

    try {
      const product = await productService.deleteProduct({ productId })

      res.status(200).json({
        data: product,
        message: 'Product deleted'
      })
    } catch (error) {
      next(error)
    }
  })
}

module.exports = productsApi
