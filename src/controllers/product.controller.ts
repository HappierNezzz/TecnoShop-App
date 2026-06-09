import { Request, Response } from 'express';
import { Product } from '../models/Product';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.query().orderBy('id', 'asc');
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const newProduct = await Product.query().insert(req.body);
        res.json(newProduct);
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        await Product.query().findById(req.params.id).patch(req.body);
        res.json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        await Product.query().deleteById(req.params.id);
        res.json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
};
