// src/routes/Car.routes.ts
import { Router, Request, Response } from "express"
import {
  createCar,
  getAllCars,
  getCarsByDealer,
  getCarsByCarMake,
  getCarById,
  updateCar,
  deleteCar,
} from "../controllers/Car.controller"
import { CREATED, OK } from "../utils/http-status"
import { CarStore } from "../store/Car.store"

// Top-level car router: list and create with full body
export const carRouter = Router()
carRouter
  .route("/")
  .get(getAllCars)
  .post((req: Request, res: Response) => {
    const car = CarStore.create(req.body)
    res.status(CREATED).json({ success: true, data: car })
  })
carRouter.route("/:id").get(getCarById).put(updateCar).delete(deleteCar)

// Nested under /dealers/:dealerId/cars
export const dealerCarsRouter = Router({ mergeParams: true })
dealerCarsRouter
  .route("/")
  .get(getCarsByDealer)
  .post((req: Request, res: Response) => {
    const { dealerId } = req.params
    const car = CarStore.create({ dealerId, ...req.body })
    res.status(CREATED).json({ success: true, data: car })
  })

// Nested under /carmakes/:carMakeId/cars
export const makeCarsRouter = Router({ mergeParams: true })
makeCarsRouter
  .route("/")
  .get(getCarsByCarMake)
  .post((req: Request, res: Response) => {
    const { carMakeId } = req.params
    const car = CarStore.create({ carMakeId, ...req.body })
    res.status(CREATED).json({ success: true, data: car })
  })

// Combined nested under /dealers/:dealerId/carmakes/:carMakeId/cars
export const dealerMakeCarsRouter = Router({ mergeParams: true })
dealerMakeCarsRouter
  .route("/")
  .get((req: Request, res: Response) => {
    const { dealerId, carMakeId } = req.params
    const cars = CarStore.findAll().filter(
      (c) => c.dealerId === dealerId && c.carMakeId === carMakeId
    )
    res.status(OK).json({ success: true, data: cars })
  })
  .post((req: Request, res: Response) => {
    const { dealerId, carMakeId } = req.params
    const car = CarStore.create({ dealerId, carMakeId, ...req.body })
    res.status(CREATED).json({ success: true, data: car })
  })
