const mongoose = require("mongoose");

const celularSchema = mongoose.Schema(
  {
    idProd: { type: String, required: true },
    priceID: { type: String, required: true },
    currency: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
    qty: { type: Number, default: 0 },  
  },
  { timestamps: true }
);

const Celular = mongoose.model("Celular", celularSchema);
module.exports = Celular;
