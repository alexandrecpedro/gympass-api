import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGymsUseCase } from '../../gyms/fetch-nearby-gyms/fetch-nearby-gyms'

export function makeFetchNearbyGymsUseCase(): FetchNearbyGymsUseCase {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new FetchNearbyGymsUseCase(gymsRepository)

  return useCase
}
