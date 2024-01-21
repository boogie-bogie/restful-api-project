import express from "express";
import connect from "./schemas/index.js";

const app = express();
const PORT = 3000;

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
app.use("/api", [router]);

//에러처리 미들웨어 등록
// app.use(errorHandlerMiddlewar);

app.listen(PORT, () => {
  console.log(PORT, "번 포트로 서버가 열렸어요!");
});
