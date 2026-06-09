import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { CartItem } from '../models/CartItem';
import { Product } from '../models/Product';

// Obtener carrito del usuario actual
export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    // Buscar los elementos del carrito cargando la relación con el producto
    const items = await CartItem.query()
      .where('user_id', userId)
      .withGraphFetched('product');

    res.json(items);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

// Agregar un producto al carrito
export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId, cantidad = 1 } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    if (!productId) {
      res.status(400).json({ message: 'El ID del producto es obligatorio' });
      return;
    }

    // Verificar si el producto existe
    const product = await Product.query().findById(productId);
    if (!product) {
      res.status(404).json({ message: 'El producto no existe' });
      return;
    }

    // Verificar si ya está en el carrito
    const existing = await CartItem.query().findOne({ user_id: userId, product_id: productId });
    if (existing) {
      // Si ya está, se incrementa la cantidad
      await CartItem.query()
        .patch({ cantidad: existing.cantidad + cantidad })
        .where({ user_id: userId, product_id: productId });
      res.json({ message: 'Cantidad de producto actualizada en el carrito' });
    } else {
      // Si no, se inserta
      await CartItem.query().insert({
        user_id: userId,
        product_id: productId,
        cantidad: cantidad
      });
      res.status(201).json({ message: 'Producto agregado al carrito con éxito' });
    }
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ message: 'Error al agregar al carrito' });
  }
};

// Actualizar la cantidad de un artículo en el carrito
export const updateCartItemQuantity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const productId = parseInt(req.params.id as string);
    const { cantidad } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    if (isNaN(productId) || cantidad === undefined) {
      res.status(400).json({ message: 'Parámetros inválidos' });
      return;
    }

    if (cantidad <= 0) {
      // Si la cantidad es 0 o menor, se elimina el producto del carrito
      await CartItem.query()
        .delete()
        .where({ user_id: userId, product_id: productId });
      res.json({ message: 'Producto eliminado del carrito por cantidad cero o menor' });
    } else {
      await CartItem.query()
        .patch({ cantidad })
        .where({ user_id: userId, product_id: productId });
      res.json({ message: 'Cantidad de producto actualizada con éxito' });
    }
  } catch (error) {
    console.error('Error al actualizar cantidad del carrito:', error);
    res.status(500).json({ message: 'Error al actualizar la cantidad del carrito' });
  }
};

// Eliminar un producto del carrito
export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const productId = parseInt(req.params.id as string);

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    if (isNaN(productId)) {
      res.status(400).json({ message: 'El ID del producto no es válido' });
      return;
    }

    const deletedCount = await CartItem.query()
      .delete()
      .where({ user_id: userId, product_id: productId });

    if (deletedCount === 0) {
      res.status(404).json({ message: 'El producto no estaba en el carrito' });
      return;
    }

    res.json({ message: 'Producto eliminado del carrito con éxito' });
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(500).json({ message: 'Error al eliminar del carrito' });
  }
};

// Vaciar el carrito de compras
export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    await CartItem.query()
      .delete()
      .where({ user_id: userId });

    res.json({ message: 'Carrito vaciado con éxito' });
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    res.status(500).json({ message: 'Error al vaciar el carrito' });
  }
};
