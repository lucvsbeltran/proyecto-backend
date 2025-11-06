const Celular = require("../models/Product");
const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.createCelular = async (req, res) => {
  const {
    name,
    price,
    description,
    img,
    qty = 0,
    currency,
  } = req.body;

  if (!name || !price || !description || !img || !currency) {
   
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  console.log("✅ Todos los campos requeridos presentes");

  if (!img.startsWith("http://") && !img.startsWith("https://")) {
    
    return res.status(400).json({ message: "URL de imagen inválida" });
  }

  console.log("✅ URL de imagen válida");

  try {
    const product = await stripe.products.create({
      name,
      description,
      images: [img],
      metadata: { qty: Number(qty)},
    });

    const stripePrice = await stripe.prices.create({
      unit_amount: price,
      currency: "clp",
      product: product.id,
    });

    const newCelular = await Celular.create({
      idProd: product.id,
      priceID: stripePrice.id,
      name,
      price,
      description,
      img,
      qty: Number(qty),
      currency,
    });

    return res.status(201).json({ datos: newCelular });
  } catch (error) {
    console.error("❌ Error al crear el celular:", error);
    return res
      .status(500)
      .json({ message: "Error al crear celular", error: error.message });
  }
};

exports.getAllCelular = async (req, res) => {
  try {
    const celulares = await Celular.find();
    return res.status(200).json({ celulares });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los celulares",
      error: error.message,
    });
  }
};

exports.getOneCelular = async (req, res) => {
  try {
    const productId = req.params.id;
    const celular = await Celular.findById(productId);

    if (!celular) return res.status(404).json({ message: "celular no encontrado" });

    return res.status(200).json({ producto: celular});
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el celular",
      error: error.message,
    });
  }
};

exports.updateCelularById = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const updateCelulares = await Celular.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
      },
      {runValidators: true}
    );
    if (!updateCelulares)
      return res.status(404).json({ message: "No se encontro el celular" });
    return res.status(200).json({ datos: updateCelulares});
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los celulares",
      error: error.message,
    });
  }
};

exports.deletedCelularById = async (req, res) => {
  try {
    const deletedCelulares = await Celular.findByIdAndDelete(req.params.id);
    if (!deletedCelulares)
      return res.status(404).json({ message: "No se encontro el celular" });
    return res.status(200).json({ message: "Se elimino el Celular" });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los celulares",
      error: error.message,
    });
  }
};
