import { Item } from "../models/item.model"
import { generateId } from "../utils/generate-id"

// In-memory storage: Map from item ID to Item object
const items: Map<string, Item> = new Map()

/**
 * Create a new item.
 * - data: all item fields except id, createdAt, updatedAt
 * - returns the newly created Item
 */
const create = (data: Omit<Item, "id" | "createdAt" | "updatedAt">): Item => {
  const id = generateId() // generate a unique ID
  const now = new Date() // timestamp for creation & update
  const item: Item = {
    id,
    ...data, // listId, title, description, completed
    createdAt: now,
    updatedAt: now,
  }

  items.set(id, item) // save in the Map
  return item // return the new item
}

/**
 * Return all items in storage.
 */
const findAll = (): Item[] => {
  return Array.from(items.values())
}

/**
 * Find one item by its ID.
 * - returns the Item or undefined if not found
 */
const findById = (id: string): Item | undefined => {
  return items.get(id)
}

/**
 * Get all items that belong to a specific list.
 */
const findByListId = (listId: string): Item[] => {
  // filter all items by matching listId
  return findAll().filter((item) => item.listId === listId)
}

/**
 * Update an existing item.
 * - id: the item ID to update
 * - data: partial fields to change (cannot change id, listId, createdAt)
 * - returns the updated Item or undefined if no such item
 */
const update = (
  id: string,
  data: Partial<Omit<Item, "id" | "listId" | "createdAt">>
): Item | undefined => {
  const item = items.get(id)
  if (!item) return undefined // no item with this ID

  // merge existing item with new data and update timestamp
  const updatedItem: Item = {
    ...item,
    ...data,
    updatedAt: new Date(),
  }

  items.set(id, updatedItem) // save updated item
  return updatedItem
}

/**
 * Delete one item by ID.
 * - returns true if the item was deleted, false if it didn’t exist
 */
const deleteItem = (id: string): boolean => {
  return items.delete(id)
}

/**
 * Delete all items for a given list.
 */
const deleteByListId = (listId: string): void => {
  // find items in that list and remove each one
  const itemsToDelete = findByListId(listId)
  itemsToDelete.forEach((item) => items.delete(item.id))
}

// Export the store API with clear names
export const itemStore = {
  create,
  findAll,
  findById,
  findByListId,
  update,
  delete: deleteItem,
  deleteByListId,
}
