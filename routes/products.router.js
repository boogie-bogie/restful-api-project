/* 요구사항
1. 상품 작성 API
- 상품명, 작성 내용, 작성자명, 비밀번호를 **request**에서 전달 받기
- 상품은 두 가지 상태, **판매 중(`FOR_SALE`)및 판매 완료(`SOLD_OUT`)** 를 가질 수 있습니다.
- 상품 등록 시 기본 상태는 **판매 중(`FOR_SALE`)** 입니다.
*/

import express from "express";
import mongoose from "mongoose";
import Products from "../schemas/products.schema.js";
import joi from "joi";

const router = express.Router();
const { ObjectId } = mongoose.Types;

/* Joi 유효성 검사 */
// joi 스키마 정의
const createdProductsschema = joi.object({
  title: joi.string().min(6).max(30).required(),
  content: joi.string().min(1).required(),
  author: joi.string().min(3).max(10).required(),
  password: joi.string().min(6).max(30).required(),
});

router
  .route("/products")
  /* 상품명, 작성자명, 상품 상태, 작성날짜 조회 */
  .get(async (req, res, next) => {
    try {
      const { title, author, isSales, date } = req.body;
      const data = await Products.find({}).sort("-date").exec();
      return res.status(200).json({ data: data });
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  /* 상품 작성 API */
  .post(async (req, res, next) => {
    try {
      const validation = await createdProductsschema.validateAsync(req.body);
      const { title, content, author, password, isSales } = validation;

      const product = new Products({
        title,
        content,
        author,
        password,
        isSales,
      });

      await product.save();
      return res
        .status(201)
        .json({ Message: "판매 상품이 정상적으로 등록되었습니다." });
    } catch (err) {
      console.error(err);
      return res.status(400).send(err.details[0].message);
    }
  });

router
  .route("/products/:productId")
  /* 상품 상세 조회 API */
  .get(async (req, res, next) => {
    try {
      const { productId } = req.params;
      const result = await Products.findOne({ _id: productId }).exec();
      return res.status(200).send(result);
    } catch (err) {
      console.error(err);
      return res.status(404).send({ message: "상품 조회에 실패하였습니다." });
    }
  })
  /* 상품 정보 수정 API */
  .patch(async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { title, content, password, isSales } = req.body;

      /* 존재하지 않는 상품일 경우 */
      const currentProduct = await Products.findOne({ _id: productId }).exec();
      if (!currentProduct) {
        return res
          .status(404)
          .json({ errorMessage: "존재하지 않는 상품입니다." });
      }

      /* 판매 상태 변경 */
      let message = { isSales: "", content: "" };
      if (isSales) {
        const targetProduct = await Products.findOne({ isSales }).exec();
        if (targetProduct) {
          targetProduct.isSales = currentProduct.isSales;
          await targetProduct.save();
        }
        currentProduct.isSales = isSales;
        await currentProduct.save();
        message.isSales = "판매 상태가 변경되었습니다.";
      }

      /* 게시글 변경 - 비밀번호 일치 여부 확인 */
      if (password === currentProduct.password) {
        const targetContent = await Products.findOne({ content }).exec();
        if (targetContent) {
          targetContent.content = currentProduct.content;
          await targetContent.save();
        }
        currentProduct.content = content;
        await currentProduct.save();
        message.content = "비밀번호 확인 완료 : 작성 내용이 변경되었습니다.";
      }
      /* 비밀번호가 맞지 않으면? */
      if (!password === currentProduct.password) {
        return res.status(404).send({
          message: "비밀번호 불일치 : 상품을 수정할 권한이 존재하지 않습니다.",
        });
      }

      return res.status(200).json({ message });
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: err.errors.isSales.message });
    }
  })
  /* 상품 삭제 API */
  .delete(async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { password } = req.body;

      /* 존재하지 않는 상품일 경우 */
      const targetItem = await Products.findById({ _id: productId }).exec();
      if (!targetItem) {
        res.status(404).json({ errorMessage: "존재하지 않는 상품입니다." });
      }

      // /* 게시글 삭제 - 비밀번호 일치 여부 확인 */
      if (password === targetItem.password) {
        await Products.deleteOne({ _id: productId });
        return res
          .status(200)
          .json({ Message: "판매 상품이 정상적으로 삭제되었습니다." });
      }

      /* 비밀번호가 맞지 않으면? */
      if (!password === targetItem.password) {
        return res.status(404).send({
          message: "비밀번호 불일치 : 상품을 삭제할 수 없습니다.",
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({});
    }
  });

export default router;
