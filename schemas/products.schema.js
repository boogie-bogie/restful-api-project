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
  },
  password: {
    type: String, // 게시글 비밀번호
    required: true, // 필수 항목
  },
  status: {
    type: String, // 판매 상태
    required: false,
    default: "FOR_SALE",
  },
  date: {
    type: Date,
    default: Date.now,
  }, // 판매 상품 게시일
});

export default mongoose.model("Products", productsSchema);
