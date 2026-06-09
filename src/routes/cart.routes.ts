import { Router } from 'express';
import { getCart, addToCart, updateCartItemQuantity, removeFromCart, clearCart } from '../controllers/cart.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de carrito requieren token de autenticación
router.get('/', authenticateToken as any, getCart);
router.post('/', authenticateToken as any, addToCart);
router.delete('/clear', authenticateToken as any, clearCart);
router.put('/:id', authenticateToken as any, updateCartItemQuantity);
router.delete('/:id', authenticateToken as any, removeFromCart);

export default router;
