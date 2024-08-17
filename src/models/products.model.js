import mongoose from 'mongoose'; // Importo el módulo de mongoose

const productCollection = 'products'; // Nombre de la colección

// Defino el esquema de la colección (es decir, la estructura de los documentos 
// que se guardarán en la colección)
const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  stock: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Creo el modelo de la colección (es decir, la representación en código de la colección)
// y lo exporto para poder utilizarlo en otros archivos
export const Product = mongoose.model(productCollection, productSchema);





