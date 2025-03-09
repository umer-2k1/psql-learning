import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import ApiError from "./utils/ApiError";
import loggerMiddleware from "./middleware/logger.middleware";
import swaggerFile from "../swagger_output.json"; // Generated Swagger file
import swaggerUi from "swagger-ui-express";
import router from "./routes";
import { handleInvalidRoute } from "./middleware/invalidRoute.middleware";
import mongoSanitize from "express-mongo-sanitize";
import { rateLimit } from "express-rate-limit";

const app = express();
// Middlewares
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(loggerMiddleware);

// Apply mongoSanitize middleware
app.use(mongoSanitize());
app.use(
  mongoSanitize({
    replaceWith: "",
  })
);

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
  message: "We've received too many request from this IP. Please try later",
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);
// router index
app.use("/", router);
// handle invalid route
app.use(handleInvalidRoute);

// api doc
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/", (req: Request, res: Response) => {
  res.send("Nodejs-Typescript-template");
});

// send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, "Not found"));
});

export default app;
