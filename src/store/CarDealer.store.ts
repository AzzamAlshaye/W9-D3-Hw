// store/CarDealer.store.ts
import { CarDealer } from "../models/CarDealer.model"
import { generateId } from "../utils/generate-id"

const dealers: Map<string, CarDealer> = new Map()

export const CarDealerStore = {
  create: (
    data: Omit<CarDealer, "id" | "createdAt" | "updatedAt">
  ): CarDealer => {
    const id = generateId()
    const now = new Date()
    const dealer: CarDealer = { id, ...data, createdAt: now, updatedAt: now }
    dealers.set(id, dealer)
    return dealer
  },

  findAll: (): CarDealer[] => Array.from(dealers.values()),

  findById: (id: string): CarDealer | undefined => dealers.get(id),

  update: (
    id: string,
    data: Partial<Omit<CarDealer, "id" | "createdAt" | "updatedAt">>
  ): CarDealer | undefined => {
    const existing = dealers.get(id)
    if (!existing) return undefined
    const updated: CarDealer = { ...existing, ...data, updatedAt: new Date() }
    dealers.set(id, updated)
    return updated
  },

  delete: (id: string): boolean => dealers.delete(id),
}
