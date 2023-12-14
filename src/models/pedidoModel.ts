import mongoose, { Schema, Document } from 'mongoose';
import { Produto } from './produtoModel';

export interface Pedido extends Document {
  numeroMesa: number;
  produtos: { produto: Produto; quantidade: number }[];
  status: string;
  total: number;
}

const PedidoSchema: Schema = new Schema({
  numeroMesa: { type: Number, required: true },
  produtos: [
    {
      produto: { type: String },
      quantidade: { type: Number, required: true },
    },
  ],
  status: { type: String, enum: ['ABERTO', 'FECHADO', 'CONTA'], default: 'ABERTO' },
  total: { type: Number, required: true },
});

export default mongoose.model<Pedido>('Pedido', PedidoSchema);
