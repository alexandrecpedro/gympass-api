import { IUsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { User } from '@prisma/client'
import { compare } from 'bcryptjs'

interface IAuthenticateUseCaseRequest {
  email: string
  password: string
}

interface IAuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateUseCaseRequest): Promise<IAuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const passwordMatches = await compare(password, user.password_hash)

    if (!passwordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
