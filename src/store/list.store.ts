import { List } from "../models/list.model"
import { generateId } from "../utils/generate-id"

// In-memory storage: Map from list ID to List object
const lists: Map<string, List> = new Map()

/**
 * Create a new list.
 * - data: all list fields except id, createdAt, updatedAt
 * - returns the newly created List
 */
const create = (data: Omit<List, "id" | "createdAt" | "updatedAt">): List => {
  const id = generateId() // generate unique ID
  const now = new Date() // timestamp for creation & update
  const list: List = {
    id,
    ...data, // title, description
    createdAt: now,
    updatedAt: now,
  }

  lists.set(id, list) // save in the Map
  return list // return the new list
}

/**
 * Return all lists in storage.
 */
const findAll = (): List[] => {
  return Array.from(lists.values())
}

/**
 * Find one list by its ID.
 * - returns the List or undefined if not found
 */
const findById = (id: string): List | undefined => {
  return lists.get(id)
}

/**
 * Update an existing list.
 * - id: the list ID to update
 * - data: partial fields to change (cannot change id or createdAt)
 * - returns the updated List or undefined if no such list exists
 */
const update = (
  id: string,
  data: Partial<Omit<List, "id" | "createdAt">>
): List | undefined => {
  const list = lists.get(id)
  if (!list) return undefined // no list with this ID

  // merge existing list with new data and update timestamp
  const updatedList: List = {
    ...list,
    ...data,
    updatedAt: new Date(),
  }

  lists.set(id, updatedList) // save updated list
  return updatedList
}

/**
 * Delete one list by ID.
 * - returns true if the list was deleted, false if it didn’t exist
 */
const deleteList = (id: string): boolean => {
  return lists.delete(id)
}

// Export the store API with clear names
export const listStore = {
  create,
  findAll,
  findById,
  update,
  delete: deleteList,
}
