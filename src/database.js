import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://aabeguier:5279167134@clustercoder.kzn29.mongodb.net/ProyectoCoder?retryWrites=true&w=majority&appName=ClusterCoder",
    {}
  )
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));
