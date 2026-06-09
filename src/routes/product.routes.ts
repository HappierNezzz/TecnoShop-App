import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Rutas de productos públicas
router.get('/', getProducts);

// Rutas de productos protegidas (creación, edición, eliminación)
router.post('/', authenticateToken as any, createProduct);
router.put('/:id', authenticateToken as any, updateProduct);
router.delete('/:id', authenticateToken as any, deleteProduct);

export default router;
