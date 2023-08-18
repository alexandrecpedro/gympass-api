import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Check-in History test (E2E)', (): void => {
  describe('when fetching the history of check-ins', (): void => {
    beforeAll(async (): Promise<void> => {
      await app.ready()
    })

    afterAll(async (): Promise<void> => {
      await app.close()
    })

    it('should be able to list the history of check-ins', async (): Promise<void> => {
      const { token } = await createAndAuthenticateUser(app)

      const user = await prisma.user.findFirstOrThrow()

      const gym = await prisma.gym.create({
        data: {
          title: 'JavaScript Gym',
          latitude: -27.2092052,
          longitude: -49.6401091,
        },
      })

      await prisma.checkIn.createMany({
        data: [
          {
            gym_id: gym.id,
            user_id: user.id,
          },
          {
            gym_id: gym.id,
            user_id: user.id,
          },
        ],
      })

      const response = await request(app.server)
        .get(`/check-ins/history`)
        .set('Authorization', `Bearer ${token}`)
        .send()

      expect(response.statusCode).toEqual(200)
      expect(response.body.checkIns).toEqual([
        expect.objectContaining({
          gym_id: gym.id,
          user_id: user.id,
        }),
        expect.objectContaining({
          gym_id: gym.id,
          user_id: user.id,
        }),
      ])
    })
  })
})
