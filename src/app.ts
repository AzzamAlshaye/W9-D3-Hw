import express, { Express, Request, Response, NextFunction } from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import logger from "./utils/logger"
import { dev, port } from "./utils/helpers"
import listRoutes from "./routes/list.routes"
import itemRoutes from "./routes/item.routes"
import dealerRouter from "./routes/CarDealer.routes"
import makeRouter from "./routes/CarMake.routes"
import {
  carRouter,
  dealerCarsRouter,
  makeCarsRouter,
} from "./routes/Car.routes"
import { OK, INTERNAL_SERVER_ERROR } from "./utils/http-status"

// Load environment variables
dotenv.config()

const app: Express = express()

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors())
app.use(helmet())
app.use(
  morgan("tiny", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/lists", listRoutes)
app.use("/api/lists/:listId/items", itemRoutes)

app.use("/api/dealers", dealerRouter)
app.use("/api/carmakes", makeRouter)
app.use("/api/cars", carRouter)
app.use("/api/dealers/:dealerId/cars", dealerCarsRouter)
app.use("/api/carmakes/:carMakeId/cars", makeCarsRouter)

// Welcome endpoint
type HealthResponse = { message: string }
app.get("/", (_req: Request, res: Response<HealthResponse>) => {
  res.status(OK).json({ message: "API is running!" })
})

// ─── Error Handling ────────────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error("Error:", err.message)
  res.status(INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Something went wrong!",
    error: dev ? err.message : undefined,
  })
})

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})
