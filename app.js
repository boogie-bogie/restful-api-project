import express from "express";
import connect from "./schemas/index.js";
import ProductsRouter from "./routes/products.router.js";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware.js";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 4500;

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
        url: process.env.HOST_URL,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJSDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

//Mongoose Model 실행 함수
connect();

// body-parser 미들웨어 등록
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 로그 미들웨어 등록
app.use((req, res, next) => {
  console.log("Request URL:", req.originalUrl, " - ", new Date());
  next();
});

// 라우터 정의/등록
const router = express.Router();

router.get("/", (req, res) => {
  return res.json({ message: "안녕하세요.😄" });
});

// /api 주소로 접근시, 해당 라우터에 클라이언트 요청 전달
app.use("/api", [router, ProductsRouter]);

//에러처리 미들웨어 등록
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(
    PORT,
    "번 포트로 서버가 열렸어요! http://localhost:4500/api-docs/",
  );
});
