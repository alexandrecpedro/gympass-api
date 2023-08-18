import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Check-in test (E2E)', (): void => {
  describe('when creating check-in', (): void => {
    beforeAll(async (): Promise<void> => {
      await app.ready()
    })

    afterAll(async (): Promise<void> => {
      await app.close()
    })

    it('should be able to create a check-in', async (): Promise<void> => {
      const { token } = await createAndAuthenticateUser(app)

      const gym = await prisma.gym.create({
        data: {
          title: 'JavaScript Gym',
          latitude: -15.79152,
          longitude: -47.8913192,
        },
      })

      const response = await request(app.server)
        .post(`/gyms/${gym.id}/check-ins`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          latitude: -15.79152,
          longitude: -47.8913192,
        })

      expect(response.statusCode).toEqual(201)
    })
  })
})
