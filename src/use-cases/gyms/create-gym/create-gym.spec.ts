import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateGymUseCase } from './create-gym'

describe('#CreateGymUseCase unit test', (): void => {
  describe('when creating gym', (): void => {
    let gymsRepository: InMemoryGymsRepository
    // sut = system under test
    let sut: CreateGymUseCase

    beforeEach(async (): Promise<void> => {
      gymsRepository = new InMemoryGymsRepository()
      sut = new CreateGymUseCase(gymsRepository)
    })

    afterEach((): void => {
      vi.clearAllMocks()
    })

    it('should be able to create gym', async (): Promise<void> => {
      const { gym } = await sut.execute({
        title: 'JavaScript Gym',
        description: null,
        latitude: -15.79152,
        longitude: -47.8913192,
        phone: null,
      })

      expect(gym.id).toEqual(expect.any(String))
    })
  })
})
