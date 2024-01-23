import express from "express";
import Products from "../schemas/products.schema.js";
import joi from "joi";

const router = express.Router();

const productsSchema = joi.object({
  title: joi.string().min(3).max(30).required(),
  content: joi.string().min(1).required(),
  author: joi.string().min(3).max(10).required(),
  password: joi.string().min(6).max(30).required(),
  isSales: joi.string(),
});

const productSearch = async (query) => {
  const { title, author, isSales, date } = query;
  const productList = {};

  if (title) productList.title = title;
  if (author) productList.author = author;
  if (isSales) productList.isSales = isSales;

  return await Products.find(productList).sort("-date").exec();
};

const productCreation = async (productData) => {
  const validation = await productsSchema.validateAsync(productData);
  const { title, content, author, password, isSales } = validation;
  const product = new Products({
    title,
    content,
    author,
    password,
    isSales,
  });
  await product.save();
  return product;
};

router
  .route("/products")
  .get(async (req, res, next) => {
    try {
      const data = await productSearch(req.query);
      return res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const product = await productCreation(req.body);
      return res
        .status(201)
        .json({ Message: "판매 상품이 등록되었습니다.", product });
    } catch (err) {
      next(err);
    }
  });

const getProductById = async (productId) => {
  try {
    return await Products.findOne({ _id: productId }).exec();
  } catch (err) {
    console.error(err);
    throw new Error("상품 조회에 실패하였습니다.");
  }
};

router
  .route("/products/:productId")
  .get(async (req, res, next) => {
    try {
      const { productId } = req.params;
      const result = await Products.findOne({ _id: productId }).exec();
      return res.status(200).send(result);
    } catch (err) {
      console.error(err);
      return res
        .status(404)
        .json({ errorMessage: "상품 조회에 실패하였습니다." });
    }
  })
  .patch(async (req, res, next) => {
    try {
      const { productId } = req.params;
      const validation = await productsSchema.validateAsync(req.body);
      const { title, content, author, password, isSales } = validation;

      const currentProduct = await Products.findOne({ _id: productId }).exec();
      if (!currentProduct) {
        return res
          .status(404)
          .json({ errorMessage: "상품 조회에 실패하였습니다." });
      }

      let message = { isSales: "", content: "" };
      if (isSales !== undefined) {
        const targetStatus = await Products.findOne({ isSales }).exec();
        if (targetStatus) {
          targetStatus.isSales = currentProduct.isSales;
          await targetStatus.save();
        }
        currentProduct.isSales = isSales;
        await currentProduct.save();
        message.isSales = "판매 상태가 변경되었습니다.";
      }

      if (password === currentProduct.password) {
        const targetContent = await Products.findOne({ content }).exec();
        if (targetContent) {
          targetContent.content = currentProduct.content;
          await targetContent.save();
        }
        currentProduct.content = content;
        await currentProduct.save();
        message.content =
          "비밀번호 확인 완료 : 작성한 글 내용이 변경되었습니다.";
      }

      if (password !== currentProduct.password) {
        return res.status(401).send({
          message: "비밀번호 오류 : 상품을 수정할 수 없습니다.",
        });
      }

      return res.status(200).json({ message });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ errorMessage: err.message });
    }
  })

  .delete(async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { password } = req.body;
      const targetItem = await getProductById(productId);

      if (password !== targetItem?.password) {
        throw new Error("비밀번호 오륲 : 상품을 삭제할 수 없습니다.");
      }
      await Products.deleteOne({ _id: productId });
      return res.status(200).json({
        Message: "비밀번호 확인 완료 : 판매 상품이 삭제되었습니다.",
      });
    } catch (err) {
      console.error(err);
      return res.status(401).json({ errorMessage: err.message });
    }
  });

export default router;
