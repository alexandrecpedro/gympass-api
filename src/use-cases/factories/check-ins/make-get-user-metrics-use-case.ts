import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsUseCase } from '../../check-ins/get-user-metrics/get-user-metrics'

export function makeGetUserMetricsUseCase(): GetUserMetricsUseCase {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new GetUserMetricsUseCase(checkInsRepository)

  return useCase
}
