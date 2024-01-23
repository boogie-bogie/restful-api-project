import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isSales: {
    type: String,
    default: "FOR_SALE",
    enum: {
      values: ["FOR_SALE", "SOLD_OUT"],
      message:
        "{VALUE} 상태는 등록할 수 없습니다. 판매 중(FOR_SALE)과 판매 완료(SOLD_OUT) 상태만 설정 가능합니다.",
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Products", productsSchema);
