import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { hash } from 'bcryptjs'
import { AuthenticateUseCase } from './authenticate'

describe('#AuthenticateUseCase unit test', (): void => {
  describe('when authenticating an user', (): void => {
    let usersRepository: InMemoryUsersRepository
    // sut = system under test
    let sut: AuthenticateUseCase

    beforeEach((): void => {
      usersRepository = new InMemoryUsersRepository()
      sut = new AuthenticateUseCase(usersRepository)
    })

    afterEach((): void => {
      vi.clearAllMocks()
    })

    it('should be able to authenticate', async (): Promise<void> => {
      await usersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      })

      const { user } = await sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      })

      expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async (): Promise<void> => {
      await expect(() =>
        sut.execute({
          email: 'johndoe@example.com',
          password: '123456',
        }),
      ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async (): Promise<void> => {
      await usersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      })

      expect(async () => {
        await sut.execute({
          email: 'johndoe@example.com',
          password: '123123',
        })
      }).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
  })
})
