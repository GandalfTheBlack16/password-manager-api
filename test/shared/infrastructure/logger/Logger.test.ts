import { logger } from '../../../../src/shared/infrastructure/logger/Logger.js'
describe('Custom logger utility', () => {
  it('Logger should be defined', () => {
    expect(logger).toBeDefined()
  })
})
