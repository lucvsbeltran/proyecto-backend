require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");



const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const cartRouter = require("./routes/cart.routes");

const port = process.env.PORT || 5000;

const app = express();

connectDB()
  .then(() => {
    console.log("✅ Conexión a MongoDB Atlas exitosa");

    // Iniciar servidor solo si la conexión fue exitosa
    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar a MongoDB:", error.message);
  });

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());



app.use("/api/v1/users", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/carts", cartRouter);

app.listen(port, () => {
  try {
    console.log(`Servidor corriendo en el puerto ${port}`);
  } catch (error) {
    console.log("Error al iniciar el servidor", error);
  }
});
