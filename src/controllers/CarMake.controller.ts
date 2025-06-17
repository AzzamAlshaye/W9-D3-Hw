// controllers/CarMake.controller.ts
import { Request, Response } from "express"
import { CarMakeStore } from "../store/CarMake.store"
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from "../utils/http-status"

export const createCarMake = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { country, brand } = req.body
    if (!country || !brand) {
      res
        .status(BAD_REQUEST)
        .json({ success: false, error: "Country and brand are required" })
      return
    }
    const carMake = CarMakeStore.create({ country, brand })
    res.status(CREATED).json({ success: true, data: carMake })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create car make",
      })
  }
}

export const getAllCarMakes = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const makes = CarMakeStore.findAll()
    res.status(OK).json({ success: true, data: makes })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch car makes",
      })
  }
}

export const getCarMakeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const make = CarMakeStore.findById(id)
    if (!make) {
      res.status(NOT_FOUND).json({ success: false, error: "CarMake not found" })
      return
    }
    res.status(OK).json({ success: true, data: make })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch car make",
      })
  }
}

export const updateCarMake = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const existing = CarMakeStore.findById(id)
    if (!existing) {
      res.status(NOT_FOUND).json({ success: false, error: "CarMake not found" })
      return
    }
    const updated = CarMakeStore.update(id, req.body)
    res.status(OK).json({ success: true, data: updated })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update car make",
      })
  }
}

export const deleteCarMake = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const existing = CarMakeStore.findById(id)
    if (!existing) {
      res.status(NOT_FOUND).json({ success: false, error: "CarMake not found" })
      return
    }
    CarMakeStore.delete(id)
    res.status(OK).json({ success: true, data: {} })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete car make",
      })
  }
}
