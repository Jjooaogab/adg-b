import { Router } from 'express';
import pedidoController from '../controllers/pedidoController';

const router = Router();

router.post('/', pedidoController.createPedido);
router.get('/', pedidoController.getPedidos);
router.get('/:id', pedidoController.getPedidoById);
router.put('/:id', pedidoController.updatePedido);
router.delete('/:id', pedidoController.deletePedido);

export default router;
