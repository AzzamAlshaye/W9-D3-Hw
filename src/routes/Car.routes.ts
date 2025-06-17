// routes/Car.routes.ts
import { Router } from "express"
import {
  createCar,
  getAllCars,
  getCarsByDealer,
  getCarsByCarMake,
  getCarById,
  updateCar,
  deleteCar,
} from "../controllers/Car.controller"

const carRouter = Router()

carRouter.route("/").get(getAllCars).post(createCar)

carRouter.route("/:id").get(getCarById).put(updateCar).delete(deleteCar)

const dealerCarsRouter = Router({ mergeParams: true })
dealerCarsRouter.route("/").get(getCarsByDealer)

const makeCarsRouter = Router({ mergeParams: true })
makeCarsRouter.route("/").get(getCarsByCarMake)

export { carRouter, dealerCarsRouter, makeCarsRouter }
