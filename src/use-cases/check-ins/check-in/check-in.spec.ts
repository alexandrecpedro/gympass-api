import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error'
import { Decimal } from '@prisma/client/runtime/library'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'

describe('#CheckInUseCase unit test', (): void => {
  describe('when checking in', (): void => {
    let checkInsRepository: InMemoryCheckInsRepository
    let gymsRepository: InMemoryGymsRepository
    // sut = system under test
    let sut: CheckInUseCase

    beforeEach(async (): Promise<void> => {
      checkInsRepository = new InMemoryCheckInsRepository()
      gymsRepository = new InMemoryGymsRepository()
      sut = new CheckInUseCase(checkInsRepository, gymsRepository)

      await gymsRepository.create({
        id: 'gym-01',
        title: 'JavaScript Gym',
        description: '',
        latitude: -15.79152,
        longitude: -47.8913192,
        phone: '',
      })

      vi.useFakeTimers()
    })

    afterEach((): void => {
      vi.useRealTimers()
      vi.clearAllMocks()
    })

    it('should be able to check in', async (): Promise<void> => {
      vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

      const { checkIn } = await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -15.79152,
        userLongitude: -47.8913192,
      })

      expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice on the same day', async (): Promise<void> => {
      vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

      await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -15.79152,
        userLongitude: -47.8913192,
      })

      await expect(() =>
        sut.execute({
          gymId: 'gym-01',
          userId: 'user-01',
          userLatitude: -15.79152,
          userLongitude: -47.8913192,
        }),
      ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('should be able to check in twice on different days', async (): Promise<void> => {
      vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

      await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -15.79152,
        userLongitude: -47.8913192,
      })

      vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

      const { checkIn } = await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -15.79152,
        userLongitude: -47.8913192,
      })

      expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in on distant gym', async (): Promise<void> => {
      gymsRepository.gyms.push({
        id: 'gym-02',
        title: 'JavaScript Gym',
        description: '',
        latitude: new Decimal(-15.7336978),
        longitude: new Decimal(-47.8757838),
        phone: '',
      })

      vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

      await expect(() =>
        sut.execute({
          gymId: 'gym-02',
          userId: 'user-01',
          userLatitude: -15.79152,
          userLongitude: -47.8913192,
        }),
      ).rejects.toBeInstanceOf(MaxDistanceError)
    })
  })
})
