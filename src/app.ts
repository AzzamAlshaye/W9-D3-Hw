import express, { Express, Request, Response, NextFunction } from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import logger from "./utils/logger"
import { dev, port } from "./utils/helpers"
import listRoutes from "./routes/list.routes"
import itemRoutes from "./routes/item.routes"
import { OK, INTERNAL_SERVER_ERROR } from "./utils/http-status"

// Load environment variables from a .env file into process.env
dotenv.config()

const app: Express = express()

// ─── Middleware ────────────────────────────────────────────────────────────────

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors())

// Set various HTTP headers for security (e.g., hide X-Powered-By, enable HSTS)
app.use(helmet())

// Log HTTP requests using morgan, sending logs through our Winston logger
app.use(
  morgan("tiny", {
    stream: {
      write: (message) => logger.info(message.trim()), // trim newline
    },
  })
)

// Parse incoming JSON payloads
app.use(express.json())

// Parse URL-encoded payloads (from HTML forms)
app.use(express.urlencoded({ extended: true }))

// ─── Routes ────────────────────────────────────────────────────────────────────

// Mount list-related endpoints under /api/lists
app.use("/api/lists", listRoutes)

// Mount item-related endpoints under /api/lists/:listId/items
// mergeParams in the router lets us read req.params.listId
app.use("/api/lists/:listId/items", itemRoutes)

// A simple welcome route at the root URL
app.get("/", (req: Request, res: Response) => {
  res
    .status(OK) // 200 OK
    .json({ message: "List & Items API - Welcome!" })
})

// ─── Error Handling ────────────────────────────────────────────────────────────

// Catch-all error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log error details
  logger.error("Error:", err.message)

  // Respond with 500 Internal Server Error
  res.status(INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Something went wrong!",
    // In development, include the error message for debugging
    error: dev ? err.message : undefined,
  })
})

// ─── Start Server ──────────────────────────────────────────────────────────────

// Listen on the configured port (from env or 3000)
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})
