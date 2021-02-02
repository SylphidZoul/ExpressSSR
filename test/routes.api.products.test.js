const assert = require('assert')
const proxyquire = require('proxyquire')
const { productsMock, ProductsServiceMock } = require('../utils/mocks/products')
const testServer = require('../utils/testserver')

describe('routes - api - products', () => {
  const route = proxyquire('../routes/api/products', {
    '../../services/products': ProductsServiceMock
  })

  const request = testServer(route)

  describe('GET /products', () => {
    it('should respond with status 200', (done) => {
      request.get('/api/products').expect(200, done)
    })

    it('should respond with content type json', (done) => {
      request.get('/api/products').expect('Content-type', /json/, done)
    })

    it('should respond with not error', (done) => {
      request.get('/api/products').end((err, res) => {
        assert.strictEqual(err, null)
        done()
      })
    })

    it('should respond with the list of products', (done) => {
      request.get('/api/products').end((_, res) => {
        assert.deepStrictEqual(res.body, {
          data: productsMock,
          message: 'Products listed'
        })
        done()
      })
    })
  })
})
