import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

describe('#SearchGymsUseCase unit test', (): void => {
  describe('when searching for gyms', (): void => {
    let gymsRepository: InMemoryGymsRepository
    // sut = system under test
    let sut: SearchGymsUseCase

    beforeEach(async (): Promise<void> => {
      gymsRepository = new InMemoryGymsRepository()
      sut = new SearchGymsUseCase(gymsRepository)
    })

    afterEach((): void => {
      vi.clearAllMocks()
    })

    it('should be able to search for gyms', async (): Promise<void> => {
      await gymsRepository.create({
        title: 'JavaScript Gym',
        description: null,
        phone: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

      await gymsRepository.create({
        title: 'TypeScript Gym',
        description: null,
        phone: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

      const { gyms } = await sut.execute({
        query: 'JavaScript',
        page: 1,
      })

      expect(gyms).toHaveLength(1)
      expect(gyms).toEqual([
        expect.objectContaining({ title: 'JavaScript Gym' }),
      ])
    })

    it('should be able to fetch paginated gym search', async (): Promise<void> => {
      for (let i = 1; i <= 22; i++) {
        await gymsRepository.create({
          title: `JavaScript Gym ${i}`,
          description: null,
          phone: null,
          latitude: -27.2092052,
          longitude: -49.6401091,
        })
      }

      const { gyms } = await sut.execute({
        query: 'JavaScript',
        page: 2,
      })

      expect(gyms).toHaveLength(2)
      expect(gyms).toEqual([
        expect.objectContaining({ title: 'JavaScript Gym 21' }),
        expect.objectContaining({ title: 'JavaScript Gym 22' }),
      ])
    })
  })
})
