import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register User test (E2E)', (): void => {
  describe('when registering an user', (): void => {
    beforeAll(async (): Promise<void> => {
      await app.ready()
    })

    afterAll(async (): Promise<void> => {
      await app.close()
    })

    it('should be able to register an user', async (): Promise<void> => {
      const response = await request(app.server).post('/users').send({
        name: 'Gilbert Poole',
        email: 'wedape@unlaf.it',
        password: '718936',
      })

      expect(response.statusCode).toEqual(201)
    })
  })
})
