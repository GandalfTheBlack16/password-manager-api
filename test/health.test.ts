import { type Response } from 'express'
import { MongoConnection } from '../src/user/infrastructure/db/MongoConnection.js'
import { HealthCheck } from '../src/health.js'

describe('Healthcheck controller', () => {
  let response: Response
  let mongoConnection: MongoConnection
  beforeAll(() => {
    mongoConnection = new MongoConnection()
    response = {
      json: jest.fn()
    } as unknown as Response
  })

  it('Should return dabase down if no database connection', () => {
    const expectedResponse = {
      application: 'UP',
      database: 'DOWN'
    }
    jest.spyOn(mongoConnection, 'getDataBaseInfo').mockReturnValue('')
    HealthCheck(response, mongoConnection)
    expect(response.json).toHaveBeenCalledWith(expectedResponse)
  })

  it('Should return dabase up if database connection', () => {
    const expectedResponse = {
      application: 'UP',
      database: 'UP'
    }
    jest.spyOn(mongoConnection, 'getDataBaseInfo').mockReturnValue('fakeValue')
    HealthCheck(response, mongoConnection)
    expect(response.json).toHaveBeenCalledWith(expectedResponse)
  })
})
