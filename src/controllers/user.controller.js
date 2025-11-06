const User = require("../models/User");
const Cart = require("../models/Cart");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  // Encriptar la contraseña
  try {
    let foundUser = await User.findOne({ email });
    if (foundUser)
      return res.status(400).json({ message: "El usuario ya existe" });
    // encriptar la contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // fin encriptar la contraseña
    const newCart = await Cart.create({});
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      cart: newCart,
    });
    if (!newUser)
      return res.status(400).json({ message: "No se pudo crear el usuario" });
    return res.status(201).json({ message: "Usuario creado", datos: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al registrar el usuario", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let foundUser = await User.findOne({ email });
    if (!foundUser)
      return res.status(400).json({ message: "El usuario no existe" });
    const correctPassword = await bcryptjs.compare(
      password,
      foundUser.password
    );
    if (!correctPassword)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const payLoad = {
      user: {
        id: foundUser._id,
      },
    };

    // Generar el token
    jwt.sign(
      payLoad,
      process.env.SECRET,
      { expiresIn: "1h" },
      (error, token) => {
        if (error) throw error;
        const isProd = process.env.NODE_ENV === "production";
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: isProd, // En producción, usar solo HTTPS
            sameSite: isProd ? "None" : "lax", // En producción, permitir cross-site
            maxAge: 60 * 60 * 1000, // 1 minuto
          })
          .json({ message: "Login exitoso" }); // también se envía el token en el cuerpo de la respuesta
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al registrar el usuario", error: error.message });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    return res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener los usuarios", error: error.message });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const { username, email, password, country, address, zipcode } = req.body;

    const updateFields = { username, email, country, address, zipcode };

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updateUser)
      return res.status(404).json({ message: "No se encontró el usuario" });

    return res.status(200).json( updateUser );
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
  });
  return res.json({ message: "Logout exitoso" });
};
