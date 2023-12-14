import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import ProdutoRoutes from './routes/produtoRoutes';
import pedidoRoutes from './routes/pedidoRoutes';
import * as dv from 'dotenv'

const app = express();
const PORT = 8080;

dv.config();
const uri = process.env.URI

app.use(cors())
app.use(express.json());

async function connectToMongoDB() {
  try {
    await mongoose.connect(uri);

    console.log('Conexão com o MongoDB estabelecida!');
  } catch (error) {
    console.error('Erro ao conectar com o MongoDB:', error);
  }
}

connectToMongoDB();

app.use('/produtos', ProdutoRoutes);
app.use('/pedidos', pedidoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});