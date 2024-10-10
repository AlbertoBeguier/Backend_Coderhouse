import { Server } from "socket.io";
import { Product } from "../models/products.model.js";
import mongoose from "mongoose";

export function configureSocket(httpServer) {
  const io = new Server(httpServer);

  io.on("connection", async (socket) => {
    console.log("Un cliente se ha conectado");

    const products = await Product.find();
    socket.emit("listado_de_productos", products);

    socket.on("agregarProducto", async (product) => {
      try {
        const lastProduct = await Product.findOne().sort({ id: -1 });
        const newId = lastProduct ? lastProduct.id + 1 : 1;

        const newProduct = new Product({
          id: newId,
          ...product,
        });

        await newProduct.save();
        const updatedProducts = await Product.find();
        io.emit("listado_de_productos", updatedProducts);
      } catch (err) {
        console.error("Error al agregar producto:", err);
      }
    });

    socket.on("eliminarProducto", async (id) => {
      try {
        const productId = new mongoose.Types.ObjectId(id);
        await Product.findByIdAndDelete(productId);
        const updatedProducts = await Product.find();
        io.emit("listado_de_productos", updatedProducts);
      } catch (err) {
        console.error("Error al eliminar producto:", err);
      }
    });

    socket.on("mensaje", (data) => {
      console.log("Mensaje del cliente:", data);
    });

    io.emit("mensaje1", "Hola cliente desde el backend");
  });

  return io;
}
