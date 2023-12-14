import { Router } from 'express';
import produtoController from '../controllers/produtoController';

const router = Router();

router.post('/', produtoController.createProduto);
router.get('/', produtoController.getProdutos);
router.get('/:id', produtoController.getProdutoById);
router.put('/:id', produtoController.updateProduto);
router.delete('/:id', produtoController.deleteProduto);

export default router;
