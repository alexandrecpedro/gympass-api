import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym test (E2E)', (): void => {
  describe('when creating gym', (): void => {
    beforeAll(async (): Promise<void> => {
      await app.ready()
    })

    afterAll(async (): Promise<void> => {
      await app.close()
    })

    it('should be able to create a gym', async (): Promise<void> => {
      const { token } = await createAndAuthenticateUser(app, true)

      const response = await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'JavaScript Gym',
          description: 'Some description',
          phone: '11981778959',
          latitude: -15.79152,
          longitude: -47.8913192,
        })

      expect(response.statusCode).toEqual(201)
    })
  })
})
