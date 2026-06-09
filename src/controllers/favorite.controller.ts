import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Favorite } from '../models/Favorite';
import { CatSuperheroe } from '../models/CatSuperheroe';

// Obtener favoritos del usuario actual
export const getFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    // Buscar los favoritos del usuario cargando la relación con el héroe
    const favorites = await Favorite.query()
      .where('user_id', userId)
      .withGraphFetched('heroe');

    // Mapear para devolver los objetos de los héroes directamente
    const heroes = favorites
      .filter(f => f.heroe !== null && f.heroe !== undefined)
      .map(f => f.heroe);

    res.json(heroes);
  } catch (error: any) {
    console.error('Error al obtener favoritos:', error);
    res.status(500).json({ message: 'Error al obtener favoritos' });
  }
};

// Agregar un héroe a favoritos
export const addFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const heroeId = req.body.heroeId || req.body.heroId;

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    if (!heroeId) {
      res.status(400).json({ message: 'El ID del superhéroe es obligatorio' });
      return;
    }

    // Verificar si el héroe existe
    const heroe = await CatSuperheroe.query().findById(heroeId);
    if (!heroe) {
      res.status(404).json({ message: 'El superhéroe no existe' });
      return;
    }

    // Verificar si ya está en favoritos (usando superheroe_id)
    const existing = await Favorite.query().findOne({ user_id: userId, superheroe_id: heroeId });
    if (existing) {
      res.status(400).json({ message: 'El superhéroe ya está en tus favoritos' });
      return;
    }

    await Favorite.query().insert({
      user_id: userId,
      superheroe_id: heroeId
    });

    res.status(201).json({ message: 'Añadido a favoritos con éxito' });
  } catch (error: any) {
    console.error('Error al agregar favorito:', error);
    res.status(500).json({ message: 'Error al agregar favorito' });
  }
};

// Eliminar de favoritos
export const removeFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const heroeId = parseInt(req.params.id);

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    if (isNaN(heroeId)) {
      res.status(400).json({ message: 'El ID del superhéroe no es válido' });
      return;
    }

    // Buscar y eliminar el favorito (usando superheroe_id)
    const deletedCount = await Favorite.query()
      .delete()
      .where({ user_id: userId, superheroe_id: heroeId });

    if (deletedCount === 0) {
      res.status(404).json({ message: 'El superhéroe no estaba en tus favoritos' });
      return;
    }

    res.json({ message: 'Eliminado de favoritos con éxito' });
  } catch (error: any) {
    console.error('Error al eliminar favorito:', error);
    res.status(500).json({ message: 'Error al eliminar favorito' });
  }
};
