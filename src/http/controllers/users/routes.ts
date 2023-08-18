import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { authenticate } from './authenticate/authenticate'
import { profile } from './profile/profile'
import { refresh } from './refresh/refresh'
import { register } from './register/register'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  /** Authenticate */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
