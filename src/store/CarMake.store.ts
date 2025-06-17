// store/CarMake.store.ts
import { CarMake } from "../models/CarMake.model"
import { generateId } from "../utils/generate-id"

const makes: Map<string, CarMake> = new Map()

export const CarMakeStore = {
  create: (data: Omit<CarMake, "id" | "createdAt" | "updatedAt">): CarMake => {
    const id = generateId()
    const now = new Date()
    const make: CarMake = { id, ...data, createdAt: now, updatedAt: now }
    makes.set(id, make)
    return make
  },

  findAll: (): CarMake[] => Array.from(makes.values()),

  findById: (id: string): CarMake | undefined => makes.get(id),

  update: (
    id: string,
    data: Partial<Omit<CarMake, "id" | "createdAt" | "updatedAt">>
  ): CarMake | undefined => {
    const existing = makes.get(id)
    if (!existing) return undefined
    const updated: CarMake = { ...existing, ...data, updatedAt: new Date() }
    makes.set(id, updated)
    return updated
  },

  delete: (id: string): boolean => makes.delete(id),
}
