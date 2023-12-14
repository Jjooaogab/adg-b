import { Request, Response } from 'express';
import ProdutoModel, { Produto } from '../models/produtoModel';

class ProdutoController {
  async createProduto(req: Request, res: Response): Promise<void> {
    try {
      const { nome, preco } = req.body;
      const produto: Produto = await ProdutoModel.create({ nome, preco });
      res.status(201).json(produto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao criar produto.' });
    }
  }

  async getProdutos(req: Request, res: Response): Promise<void> {
    try {
      const produtos = await ProdutoModel.find();
      res.status(200).json(produtos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao obter produtos.' });
    }
  }

  async getProdutoById(req: Request, res: Response): Promise<void> {
    try {
      const produtoId = req.params.id;
      const produto = await ProdutoModel.findById(produtoId);

      if (!produto) {
       res.status(404).json({ message: 'Produto não encontrado.' });
       return
      }

      res.status(200).json(produto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao obter produto.' });
    }
  }

  async updateProduto(req: Request, res: Response): Promise<void> {
    try {
      const produtoId = req.params.id;
      const { nome, preco } = req.body;
      const produto = await ProdutoModel.findById(produtoId);

      if (!produto) {
        res.status(404).json({ message: 'Produto não encontrado.' });
        return 
      }

      if (nome) {
        produto.nome = nome;
      }

      if (preco) {
        produto.preco = preco;
      }

      await produto.save();

      res.status(200).json(produto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar produto.' });
    }
  }

  async deleteProduto(req: Request, res: Response): Promise<void> {
    try {
      const produtoId = req.params.id;
      const produto = await ProdutoModel.findById(produtoId);

      if (!produto) {
        res.status(404).json({ message: 'Produto não encontrado.' });
        return 
      }

      await produto.deleteOne();

      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao excluir produto.' });
    }
  }
}

export default new ProdutoController();
