import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'

describe('#GetUserProfileUseCase unit test', (): void => {
  describe('when getting an user profile', (): void => {
    let usersRepository: InMemoryUsersRepository
    // sut = system under test
    let sut: GetUserProfileUseCase

    beforeEach((): void => {
      usersRepository = new InMemoryUsersRepository()
      sut = new GetUserProfileUseCase(usersRepository)
    })

    afterEach((): void => {
      vi.clearAllMocks()
    })

    it('should be able to get an user profile', async (): Promise<void> => {
      const createdUser = await usersRepository.create({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      })

      const { user } = await sut.execute({
        userId: createdUser.id,
      })

      expect(user.name).toEqual(createdUser.name)
    })

    it('should not be able to get an user profile with wrong id', async (): Promise<void> => {
      await expect(() =>
        sut.execute({
          userId: 'non-existing-id',
        }),
      ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
  })
})
