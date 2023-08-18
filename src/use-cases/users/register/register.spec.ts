import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { IRegisterUseCaseRequest, RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

describe('#RegisterUseCase unit test', (): void => {
  let usersRepository: InMemoryUsersRepository
  let sut: RegisterUseCase

  const newUser: IRegisterUseCaseRequest = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  }

  beforeEach((): void => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  afterEach((): void => {
    vi.clearAllMocks()
  })

  describe('when registering an user', (): void => {
    it('should be able to register an user', async (): Promise<void> => {
      const { user } = await sut.execute(newUser)

      expect(user.id).toEqual(expect.any(String))
    })

    it(`should hash an user's password upon registration`, async (): Promise<void> => {
      const { user } = await sut.execute(newUser)

      const isPasswordCorrectlyHashed = await compare(
        newUser.password,
        user.password_hash,
      )

      expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async (): Promise<void> => {
      await sut.execute(newUser)

      await expect(() =>
        sut.execute({
          name: 'Derek Mendez',
          email: newUser.email,
          password: '979586',
        }),
      ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
  })
})
