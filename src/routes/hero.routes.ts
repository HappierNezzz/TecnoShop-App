import { Router } from 'express';
import { getHeroes, createHero, updateHero, deleteHero } from '../controllers/hero.controller';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favorite.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Rutas de héroes públicas
router.get('/', getHeroes);

// Rutas de héroes protegidas (creación, edición, eliminación)
router.post('/', authenticateToken as any, createHero);
router.put('/:id', authenticateToken as any, updateHero);
router.delete('/:id', authenticateToken as any, deleteHero);

// Rutas de favoritos (protegidas)
router.get('/favorites', authenticateToken as any, getFavorites);
router.post('/favorites', authenticateToken as any, addFavorite);
router.delete('/favorites/:id', authenticateToken as any, removeFavorite);

export default router;