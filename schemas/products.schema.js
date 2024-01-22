import mongoose from "mongoose";

// 상품(goods)에 대한 정보를 나타내는 스키마 정의
const productsSchema = new mongoose.Schema({
  title: {
    type: String, // 상품의 이름
    required: true, // 필수 항목
  },
  content: {
    type: String, // 판매 게시글 내용
    required: true, // 필수 항목
  },
  author: {
    type: String, // 판매자
    required: true, // 필수 항목
    unique: true, // 작성자 중복 방지
  },
  password: {
    type: String, // 게시글 비밀번호
    required: true, // 필수 항목
  },
  isSales: {
    type: String, // 판매 상태
    default: "FOR_SALE", // default
    enum: {
      values: ["FOR_SALE", "SOLD_OUT"], // 판매 상태는 2개만 존재
      message: "{VALUE} is not supported",
    },
  },
  date: {
    type: Date, // 판매 상품 게시일
    default: Date.now,
  },
});

export default mongoose.model("Products", productsSchema);
