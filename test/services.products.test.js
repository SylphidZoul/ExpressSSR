const assert = require('assert')
const proxyquire = require('proxyquire')

const {
  MongoLibMock,
  getAllStub,
  createStub
} = require('../utils/mocks/mongoLib')

const {
  productsMock,
  filteredProductsMock
} = require('../utils/mocks/products')

describe('Services - products', () => {
  const ProductsService = proxyquire('../services/products', {
    '../lib/mongo': MongoLibMock
  })

  const productsService = new ProductsService()

  describe('when getProducts method is called', async () => {
    it('should call the getAll MongoLib method', async () => {
      await productsService.getProducts({})
      assert.deepStrictEqual(getAllStub.called, true)
    })

    it('should return an array of products', async () => {
      const result = await productsService.getProducts({})
      const expected = productsMock
      assert.deepStrictEqual(result, expected)
    })
  })

  describe('when getProduct method is called with tags', async () => {
    it('should call the getAll MongoLib method with tags args', async () => {
      await productsService.getProducts({ tags: ['expensive'] })
      const tagQuery = { tags: { $in: ['expensive'] } }
      assert.deepStrictEqual(getAllStub.calledWith('products', tagQuery), true)
    })

    it('should return an array of products filtered by the tag', async () => {
      const result = await productsService.getProducts({ tags: ['expensive'] })
      const expected = filteredProductsMock('expensive')
      assert.deepStrictEqual(result, expected)
    })
  })
})
