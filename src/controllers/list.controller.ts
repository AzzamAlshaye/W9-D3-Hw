import { Request, Response } from "express"
import { listStore } from "../store/list.store"
import { itemStore } from "../store/item.store"
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from "../utils/http-status"

// Create a new list
export const createList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description = "" } = req.body // Read title and optional description

    // If title is missing, return 400 Bad Request
    if (!title) {
      res.status(BAD_REQUEST).json({
        success: false,
        error: "Title is required",
      })
      return
    }

    // Create the list and return it with 201 Created
    const list = listStore.create({ title, description })
    res.status(CREATED).json({
      success: true,
      data: list,
    })
  } catch (error) {
    // On error, return 400 with the error message
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create list",
    })
  }
}

// Get all lists
export const getLists = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Fetch and return all lists with 200 OK
    const lists = listStore.findAll()
    res.status(OK).json({
      success: true,
      data: lists,
    })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch lists",
    })
  }
}

// Get a single list by ID, including its items
export const getList = async (req: Request, res: Response): Promise<void> => {
  try {
    // Look up the list
    const list = listStore.findById(req.params.id)
    if (!list) {
      // If not found, return 404 Not Found
      res.status(NOT_FOUND).json({
        success: false,
        error: "List not found",
      })
      return
    }

    // Fetch items belonging to this list
    const items = itemStore.findByListId(list.id)
    // Return list data plus its items
    res.status(OK).json({
      success: true,
      data: {
        ...list,
        items,
      },
    })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch list",
    })
  }
}

// Update an existing list
export const updateList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Attempt to update; if ID not found, update returns null/undefined
    const list = listStore.update(req.params.id, req.body)
    if (!list) {
      // 404 if list doesn't exist
      res.status(NOT_FOUND).json({
        success: false,
        error: "List not found",
      })
      return
    }

    // Return updated list with 200 OK
    res.status(OK).json({
      success: true,
      data: list,
    })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to update list",
    })
  }
}

// Delete a list and all its items
export const deleteList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Try deleting the list; returns truthy if deleted
    const deleted = listStore.delete(req.params.id)
    if (!deleted) {
      // 404 if list not found
      res.status(NOT_FOUND).json({
        success: false,
        error: "List not found",
      })
      return
    }

    // Also remove any items tied to this list
    itemStore.deleteByListId(req.params.id)

    // Return empty object on success
    res.status(OK).json({
      success: true,
      data: {},
    })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete list",
    })
  }
}
