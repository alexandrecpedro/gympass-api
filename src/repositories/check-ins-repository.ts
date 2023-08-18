import { CheckIn, Prisma } from '@prisma/client'

export interface ICheckInsRepository {
  countByUserId(userId: string): Promise<number>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findById(id: string): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  save(checkIn: CheckIn): Promise<CheckIn>
}
