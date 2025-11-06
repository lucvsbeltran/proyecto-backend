const express = require("express");
const productRouter = express.Router();

const {
  createCelular,
  getAllCelular,
  getOneCelular,
  updateCelularById,
  deletedCelularById,
} = require("../controllers/product.controller");

productRouter.post("/create", createCelular);
productRouter.get("/readall", getAllCelular);
productRouter.get("/readone/:id", getOneCelular);
productRouter.put("/update/:id", updateCelularById);
productRouter.delete("/delete/:id", deletedCelularById);

module.exports = productRouter;
