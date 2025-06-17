// controllers/Car.controller.ts
import { Request, Response } from "express"
import { CarStore } from "../store/Car.store"
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from "../utils/http-status"

export const createCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dealerId, carMakeId, name, price, year, color, wheelsCount } =
      req.body
    if (
      !dealerId ||
      !carMakeId ||
      !name ||
      price == null ||
      year == null ||
      !color ||
      wheelsCount == null
    ) {
      res
        .status(BAD_REQUEST)
        .json({ success: false, error: "All car fields are required" })
      return
    }
    const car = CarStore.create({
      dealerId,
      carMakeId,
      name,
      price,
      year,
      color,
      wheelsCount,
    })
    res.status(CREATED).json({ success: true, data: car })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to create car",
      })
  }
}

export const getAllCars = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const cars = CarStore.findAll()
    res.status(OK).json({ success: true, data: cars })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch cars",
      })
  }
}

export const getCarsByDealer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { dealerId } = req.params
    const cars = CarStore.findByDealerId(dealerId)
    res.status(OK).json({ success: true, data: cars })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch cars by dealer",
      })
  }
}

export const getCarsByCarMake = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { carMakeId } = req.params
    const cars = CarStore.findByCarMakeId(carMakeId)
    res.status(OK).json({ success: true, data: cars })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch cars by car make",
      })
  }
}

export const getCarById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const car = CarStore.findById(id)
    if (!car) {
      res.status(NOT_FOUND).json({ success: false, error: "Car not found" })
      return
    }
    res.status(OK).json({ success: true, data: car })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch car",
      })
  }
}

export const updateCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const existing = CarStore.findById(id)
    if (!existing) {
      res.status(NOT_FOUND).json({ success: false, error: "Car not found" })
      return
    }
    const updated = CarStore.update(id, req.body)
    res.status(OK).json({ success: true, data: updated })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to update car",
      })
  }
}

export const deleteCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const existing = CarStore.findById(id)
    if (!existing) {
      res.status(NOT_FOUND).json({ success: false, error: "Car not found" })
      return
    }
    CarStore.delete(id)
    res.status(OK).json({ success: true, data: {} })
  } catch (error) {
    res
      .status(BAD_REQUEST)
      .json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete car",
      })
  }
}
