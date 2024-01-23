import express from "express";
import connect from "./schemas/index.js";
import ProductsRouter from "./routes/products.router.js";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware.js";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

// Swagger api-docs
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RESTful API Project",
      version: "1.0.0",
      description: "개인 과제",
    },
    servers: [
      {
        url: "http://bogiegie.shop:3000/api-docs",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJSDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("Request URL:", req.originalUrl, " - ", new Date());
  next();
});

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({ message: "안녕하세요.😄" });
});

app.use("/api", [router, ProductsRouter]);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(
    PORT,
    "번 포트로 서버가 열렸어요! API 명세서: http://bogiegie.shop:3000/api-docs",
  );
});
