// controllers/CarDealer.controller.ts
import { Request, Response } from "express"
import { CarDealerStore } from "../store/CarDealer.store"
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from "../utils/http-status"

export const createCarDealer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, city } = req.body
    if (!name || !email || !city) {
      res
        .status(BAD_REQUEST)
        .json({ success: false, error: "Name, email, and city are required" })
      return
    }
    const dealer = CarDealerStore.create({ name, email, city })
    res.status(CREATED).json({ success: true, data: dealer })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create dealer",
      })
  }
}

export const getAllCarDealers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const dealers = CarDealerStore.findAll()
    res.status(OK).json({ success: true, data: dealers })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch dealers",
      })
  }
}

export const getCarDealerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const dealer = CarDealerStore.findById(id)
    if (!dealer) {
      res.status(NOT_FOUND).json({ success: false, error: "Dealer not found" })
      return
    }
    res.status(OK).json({ success: true, data: dealer })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch dealer",
      })
  }
}

export const updateCarDealer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const existing = CarDealerStore.findById(id)
    if (!existing) {
      res.status(NOT_FOUND).json({ success: false, error: "Dealer not found" })
      return
    }
    const updated = CarDealerStore.update(id, req.body)
    res.status(OK).json({ success: true, data: updated })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update dealer",
      })
  }
}

export const deleteCarDealer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const existing = CarDealerStore.findById(id)
    if (!existing) {
      res.status(NOT_FOUND).json({ success: false, error: "Dealer not found" })
      return
    }
    CarDealerStore.delete(id)
    res.status(OK).json({ success: true, data: {} })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete dealer",
      })
  }
}
