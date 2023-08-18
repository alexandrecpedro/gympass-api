import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gyms test (E2E)', (): void => {
  describe('when searching gyms', (): void => {
    beforeAll(async (): Promise<void> => {
      await app.ready()
    })

    afterAll(async (): Promise<void> => {
      await app.close()
    })

    it('should be able to search gyms by title', async (): Promise<void> => {
      const { token } = await createAndAuthenticateUser(app, true)

      await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'JavaScript Gym',
          description: 'Some description',
          phone: '11981778959',
          latitude: -15.79152,
          longitude: -47.8913192,
        })

      await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'TypeScript Gym',
          description: 'Some description',
          phone: '11981778959',
          latitude: -15.79152,
          longitude: -47.8913192,
        })

      const response = await request(app.server)
        .get('/gyms/search')
        .query({
          query: 'JavaScript',
        })
        .set('Authorization', `Bearer ${token}`)
        .send()

      expect(response.statusCode).toEqual(200)
      expect(response.body.gyms).toHaveLength(1)
      expect(response.body.gyms).toEqual([
        expect.objectContaining({
          title: 'JavaScript Gym',
        }),
      ])
    })
  })
})
