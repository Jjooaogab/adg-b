import mongoose, { Schema, Document } from 'mongoose';

export interface Produto extends Document {
  nome: string;
  preco: number;
}

const ProdutoSchema: Schema = new Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
});

export default mongoose.model<Produto>('Produto', ProdutoSchema);
