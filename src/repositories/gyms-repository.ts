import { Gym, Prisma } from '@prisma/client'

export interface IFindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface IGymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
  findManyNearby(data: IFindManyNearbyParams): Promise<Gym[]>
  searchMany(query: string, page: number): Promise<Gym[]>
}
