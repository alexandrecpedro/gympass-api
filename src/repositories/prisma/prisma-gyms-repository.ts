import { prisma } from '@/lib/prisma'
import { Gym, Prisma } from '@prisma/client'

import { IFindManyNearbyParams, IGymsRepository } from '../gyms-repository'

export class PrismaGymsRepository implements IGymsRepository {
  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async findManyNearby({
    latitude,
    longitude,
  }: IFindManyNearbyParams): Promise<Gym[]> {
    // Haversine Formula = calculates distance between two points of Earth
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms 
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return gyms
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }
}
