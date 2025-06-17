// store/Car.store.ts
import { Car } from "../models/Car.model"
import { generateId } from "../utils/generate-id"

const cars: Map<string, Car> = new Map()

export const CarStore = {
  create: (data: Omit<Car, "id" | "createdAt" | "updatedAt">): Car => {
    const id = generateId()
    const now = new Date()
    const car: Car = { id, ...data, createdAt: now, updatedAt: now }
    cars.set(id, car)
    return car
  },

  findAll: (): Car[] => Array.from(cars.values()),

  findById: (id: string): Car | undefined => cars.get(id),

  findByDealerId: (dealerId: string): Car[] =>
    Array.from(cars.values()).filter((c) => c.dealerId === dealerId),

  findByCarMakeId: (carMakeId: string): Car[] =>
    Array.from(cars.values()).filter((c) => c.carMakeId === carMakeId),

  update: (
    id: string,
    data: Partial<Omit<Car, "id" | "createdAt" | "updatedAt">>
  ): Car | undefined => {
    const existing = cars.get(id)
    if (!existing) return undefined
    const updated: Car = { ...existing, ...data, updatedAt: new Date() }
    cars.set(id, updated)
    return updated
  },

  delete: (id: string): boolean => cars.delete(id),
}
