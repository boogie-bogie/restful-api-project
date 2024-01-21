/* 요구사항
1. 상품 작성 API
- 상품명, 작성 내용, 작성자명, 비밀번호를 **request**에서 전달 받기
- 상품은 두 가지 상태, **판매 중(`FOR_SALE`)및 판매 완료(`SOLD_OUT`)** 를 가질 수 있습니다.
- 상품 등록 시 기본 상태는 **판매 중(`FOR_SALE`)** 입니다.
*/

import express from "express";
import Products from "../schemas/products.schema.js";
import joi from "joi";

const router = express.Router();

/* Joi 유효성 검사 */
// joi 스키마 정의
const createdProductsschema = joi.object({
  title: joi.string().required(),
  content: joi.string().required(),
  author: joi.string().required(),
  password: joi.string().required(),
});

/* 상품 등록 및 조회 API */
router
  .route("/products")
  .get(async (req, res, next) => {
    try {
      const { title, content, author, password, status, date } = req.body;
      const data = await Products.find({}).sort("-date").exec();
      return res.status(200).json({ data });
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const validation = await createdProductsschema.validateAsync(req.body);
      const { title, content, author, password } = validation;

      const product = new Products({
        title,
        content,
        author,
        password,
      });

      await product.save();
      return res.status(201).json({ Message: "판매 상품을 등록하였습니다." });
    } catch (err) {
      console.error(err);
      return res.status(400).send(err.details[0].message);
    }
  });

/* 상품 상세 조회 API */
router.get("/products/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await Products.findOne({ _id: productId }).exec();
    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(400).send({ message: "상품 조회에 실패하였습니다." });
  }
});
export default router;
