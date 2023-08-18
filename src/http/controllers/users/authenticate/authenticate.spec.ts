import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate User test (E2E)', (): void => {
  describe('when authenticating an user', (): void => {
    beforeAll(async (): Promise<void> => {
      await app.ready()
    })

    afterAll(async (): Promise<void> => {
      await app.close()
    })

    it('should be able to authenticate an user', async (): Promise<void> => {
      await request(app.server).post('/users').send({
        name: 'Gilbert Poole',
        email: 'wedape@unlaf.it',
        password: '718936',
      })

      const response = await request(app.server).post('/sessions').send({
        email: 'wedape@unlaf.it',
        password: '718936',
      })

      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual({
        token: expect.any(String),
      })
    })
  })
})
