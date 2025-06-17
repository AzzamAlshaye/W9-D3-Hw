import { Request, Response } from "express"
import { itemStore } from "../store/item.store"
import { listStore } from "../store/list.store"
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from "../utils/http-status"

// Create a new item in a specific list
export const createItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { listId } = req.params // ID of the list from the URL
    const { title, description = "", completed = false } = req.body // Read fields from request body

    // If title is missing, return 400 Bad Request
    if (!title) {
      res.status(BAD_REQUEST).json({
        success: false,
        error: "Title is required",
      })
      return
    }

    // Check that the list exists
    const list = listStore.findById(listId)
    if (!list) {
      res.status(NOT_FOUND).json({
        // 404 if list not found
        success: false,
        error: "List not found",
      })
      return
    }

    // Create the item and return it with 201 Created
    const item = itemStore.create({ listId, title, description, completed })
    res.status(CREATED).json({
      success: true,
      data: item,
    })
  } catch (error) {
    // On any error, return 400 with the error message
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create item",
    })
  }
}

// Get all items for a specific list
export const getListItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { listId } = req.params

    // Ensure list exists
    const list = listStore.findById(listId)
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: "List not found",
      })
      return
    }

    // Fetch and return items with 200 OK
    const items = itemStore.findByListId(listId)
    res.status(OK).json({
      success: true,
      data: items,
    })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch items",
    })
  }
}

// Get one specific item by its ID within a list
export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, id } = req.params

    // Check list exists
    const list = listStore.findById(listId)
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: "List not found",
      })
      return
    }

    // Check item exists and belongs to this list
    const item = itemStore.findById(id)
    if (!item || item.listId !== listId) {
      res.status(NOT_FOUND).json({
        success: false,
        error: "Item not found in this list",
      })
      return
    }

    // Return the item
    res.status(OK).json({
      success: true,
      data: item,
    })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch item",
    })
  }
}

// Update an existing item
export const updateItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { listId, id } = req.params

    // Verify the list exists
    const list = listStore.findById(listId)
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: "List not found",
      })
      return
    }

    // Verify the item exists and is in this list
    const existingItem = itemStore.findById(id)
    if (!existingItem || existingItem.listId !== listId) {
      res.status(NOT_FOUND).json({
        success: false,
        error: "Item not found in this list",
      })
      return
    }

    // Perform the update with data from req.body
    const item = itemStore.update(id, req.body)
    res.status(OK).json({
      success: true,
      data: item,
    })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to update item",
    })
  }
}

// Delete an item
export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { listId, id } = req.params

    // Ensure the parent list exists
    const list = listStore.findById(listId)
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: "List not found",
      })
      return
    }

    // Ensure the item exists in that list
    const existingItem = itemStore.findById(id)
    if (!existingItem || existingItem.listId !== listId) {
      res.status(NOT_FOUND).json({
        success: false,
        error: "Item not found in this list",
      })
      return
    }

    // Delete the item and return empty object on success
    itemStore.delete(id)
    res.status(OK).json({
      success: true,
      data: {},
    })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete item",
    })
  }
}
