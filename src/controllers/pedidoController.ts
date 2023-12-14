import { Request, Response } from 'express';
import PedidoModel, { Pedido } from '../models/pedidoModel';
import ProdutoModel, { Produto } from '../models/produtoModel';

class PedidoController {
  async createPedido(req: Request, res: Response): Promise<void> {
    try {
      const { numeroMesa, produtos } = req.body;

      const mesaAberta = await PedidoModel.findOne({ numeroMesa, status: 'ABERTO' });
  
      if (mesaAberta) {
        for (const produtoPedido of produtos) {
          const produtoExistente = mesaAberta.produtos.find((p) => p.produto && p.produto.toString() === produtoPedido.produto);
  
          if (produtoExistente) {
            produtoExistente.quantidade += produtoPedido.quantidade;
          } else {
            mesaAberta.produtos.push({
              produto: produtoPedido.produto,
              quantidade: produtoPedido.quantidade,
            });
          }
        }
  
        await mesaAberta.save();
  
        res.status(200).json(mesaAberta);
        return;
      }

      const produtosDB = await ProdutoModel.find({ _id: { $in: produtos.map((p: any) => p.produto) } });

      if (produtosDB.length !== produtos.length) {
        res.status(400).json({ message: 'Um ou mais produtos não existem.' });
        return;
      }

      const total = produtos.reduce((acc: number, prod: any) => {
        const produto = produtosDB.find((p) => p._id.equals(prod.produto));

        if (!produto) {
          res.status(400).json({ message: `Produto com ID ${prod.produto} não encontrado.` });
          return acc;
        }

        return acc + produto.preco * prod.quantidade;
      }, 0);

      const pedidoProdutos = await Promise.all(
        produtos.map(async (p: any) => {
          const produtoDB = produtosDB.find((prod) => prod._id.equals(p.produto));

          if (!produtoDB) {
            res.status(400).json({ message: `Produto com ID ${p.produto} não encontrado.` });
            return null;
          }

          return { produto: produtoDB, quantidade: p.quantidade };
        })
      );

      if (pedidoProdutos.some((p) => !p)) {
        return;
      }

      const pedido: Pedido = await PedidoModel.create({
        numeroMesa,
        produtos: pedidoProdutos,
        status: 'ABERTO',
        total,
      });

      const idTable = pedido._id;

      res.status(201).json({ mesaId: idTable, all: pedido });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  }
  

  async getPedidos(req: Request, res: Response): Promise<void> {
    try {
      const pedidos = await PedidoModel.find();
      res.status(200).json(pedidos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao obter pedidos.' });
    }
  }

  async getPedidoById(req: Request, res: Response): Promise<void> {
    try {
      const pedidoId = req.params.id;
      const pedido = await PedidoModel.findById(pedidoId);

      if (!pedido) {
        res.status(404).json({ message: 'Pedido não encontrado.' });
        return;
      }

      res.status(200).json(pedido);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao obter pedido.' });
    }
  }

  async updatePedido(req: Request, res: Response): Promise<void> {
    try {
      const pedidoId = req.params.id;
      const { produtos, status } = req.body;
      const pedido = await PedidoModel.findById(pedidoId);
  
      if (!pedido) {
        res.status(404).json({ message: 'Pedido não encontrado.' });
        return; // Retorna após enviar a resposta
      }
  
      if (status && !['ABERTO', 'FECHADO', 'CONTA'].includes(status)) {
        res.status(400).json({ message: 'Status inválido.' });
        return; // Retorna após enviar a resposta
      }
  
      if (produtos) {
        const produtosDB = await ProdutoModel.find({ _id: { $in: produtos.map((p: any) => p.produto) } });
  
        if (produtosDB.length !== produtos.length) {
          res.status(400).json({ message: 'Um ou mais produtos não existem.' });
          return; // Retorna após enviar a resposta
        }
  
        pedido.produtos = produtos.map((p: any) => ({ produto: p.produto, quantidade: p.quantidade }));
      }
  
      if (status) {
        pedido.status = status;
      }
  
      await pedido.save();
  
      res.status(200).json(pedido);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar pedido.' });
    }
  }
  

  async deletePedido(req: Request, res: Response): Promise<void> {
    try {
      const pedidoId = req.params.id;
      const pedido = await PedidoModel.findById(pedidoId);

      if (!pedido) {
        res.status(404).json({ message: 'Pedido não encontrado.' });
        return;
      }

      if (pedido.status === 'ABERTO') {
        await PedidoModel.deleteOne({ _id: pedido._id });
      } else {
        // Mover para uma coleção de pedidos fechados ou arquivados
        // await PedidoFechadoModel.create(pedido.toObject());
        await PedidoModel.deleteOne({ _id: pedido._id });
      }

      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao excluir pedido.' });
    }
  }

  async getNumeroMesaById(req: Request, res: Response): Promise<void> {
    try {
      const mesaId = req.params.id; // ID da mesa que você deseja consultar
      const mesa = await PedidoModel.findOne({ _id: mesaId });
  
      if (!mesa) {
        res.status(404).json({ message: 'Mesa não encontrada.' });
        return;
      }
  
      res.status(200).json({ numeroMesa: mesa.numeroMesa });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao obter número da mesa.' });
    }
  }
}

export default new PedidoController();
