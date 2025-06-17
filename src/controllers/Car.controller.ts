// src/controllers/Car.controller.ts
import { Request, Response } from "express"
import { CarStore } from "../store/Car.store"
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from "../utils/http-status"

// Create a new car
export const createCar = async (req: Request, res: Response): Promise<void> => {
  try {
    // Allow dealerId/carMakeId from either body or URL params
    const dealerId = req.body.dealerId ?? req.params.dealerId
    const carMakeId = req.body.carMakeId ?? req.params.carMakeId
    const { name, price, year, color, wheelsCount } = req.body

    // Validate required fields
    if (
      !dealerId ||
      !carMakeId ||
      !name ||
      price == null ||
      year == null ||
      !color ||
      wheelsCount == null
    ) {
      res.status(BAD_REQUEST).json({
        success: false,
        error:
          "dealerId, carMakeId, name, price, year, color, and wheelsCount are all required",
      })
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
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create car",
    })
  }
}

// Get all cars
export const getAllCars = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const cars = CarStore.findAll()
    res.status(OK).json({ success: true, data: cars })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch cars",
    })
  }
}

// Get cars by dealer ID
export const getCarsByDealer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { dealerId } = req.params

    // 1) Validate that the client actually sent a dealerId
    if (!dealerId) {
      res
        .status(BAD_REQUEST)
        .json({ success: false, error: "dealerId parameter is required" })
      return
    }

    // 2) Fetch and filter
    const cars = CarStore.findAll().filter((car) => car.dealerId === dealerId)

    // 3) If you want a 404 when there are no matching cars:
    if (cars.length === 0) {
      res
        .status(NOT_FOUND)
        .json({
          success: false,
          error: `No cars found for dealerId ${dealerId}`,
        })
      return
    }

    // 4) Otherwise return the list
    res.status(OK).json({ success: true, data: cars })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch cars by dealer",
    })
  }
}

// Get cars by carMake ID
export const getCarsByCarMake = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { carMakeId } = req.params

    // 1) Validate that the client actually sent a carMakeId
    if (!carMakeId) {
      res
        .status(BAD_REQUEST)
        .json({ success: false, error: "carMakeId parameter is required" })
      return
    }

    // 2) Fetch and filter
    const cars = CarStore.findAll().filter((car) => car.carMakeId === carMakeId)

    // 3) If you want a 404 when there are no matching cars:
    if (cars.length === 0) {
      res
        .status(NOT_FOUND)
        .json({
          success: false,
          error: `No cars found for carMakeId ${carMakeId}`,
        })
      return
    }

    // 4) Otherwise return the list
    res.status(OK).json({ success: true, data: cars })
  } catch (error) {
    res.status(BAD_REQUEST).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch cars by car make",
    })
  }
}

// Get a single car by ID
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
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch car",
    })
  }
}

// Update an existing car
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
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to update car",
    })
  }
}

// Delete a car
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
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete car",
    })
  }
}
