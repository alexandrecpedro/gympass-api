import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '../../check-ins/fetch-user-check-ins-history/fetch-user-check-ins-history'

export function makeFetchUserCheckInsHistoryUseCase(): FetchUserCheckInsHistoryUseCase {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

  return useCase
}
