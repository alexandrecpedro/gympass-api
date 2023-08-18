import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('User Profile test (E2E)', (): void => {
  describe('when getting user profile', (): void => {
    beforeAll(async (): Promise<void> => {
      await app.ready()
    })

    afterAll(async (): Promise<void> => {
      await app.close()
    })

    it('should be able to get user profile', async (): Promise<void> => {
      const { token } = await createAndAuthenticateUser(app)

      const profileResponse = await request(app.server)
        .get('/me')
        .set('Authorization', `Bearer ${token}`)
        .send()

      expect(profileResponse.statusCode).toEqual(200)
      expect(profileResponse.body.user).toEqual(
        expect.objectContaining({
          name: 'John Doe',
        }),
      )
    })
  })
})
