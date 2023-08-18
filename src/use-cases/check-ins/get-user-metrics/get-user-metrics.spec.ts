import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'

describe('#GetUserMetricsUseCase unit test', (): void => {
  describe('when getting user check-ins count from metrics', (): void => {
    let checkInsRepository: InMemoryCheckInsRepository
    // sut = system under test
    let sut: GetUserMetricsUseCase

    beforeEach(async (): Promise<void> => {
      checkInsRepository = new InMemoryCheckInsRepository()
      sut = new GetUserMetricsUseCase(checkInsRepository)
    })

    afterEach((): void => {
      vi.clearAllMocks()
    })

    it('should be able to get check-ins count from metrics', async (): Promise<void> => {
      await checkInsRepository.create({
        gym_id: 'gym-01',
        user_id: 'user-01',
      })

      await checkInsRepository.create({
        gym_id: 'gym-02',
        user_id: 'user-01',
      })

      const { checkInsCount } = await sut.execute({
        userId: 'user-01',
      })

      expect(checkInsCount).toEqual(2)
    })
  })
})
