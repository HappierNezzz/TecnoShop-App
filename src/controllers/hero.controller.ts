import { Request, Response } from 'express';
import { CatSuperheroe } from '../models/CatSuperheroe';

export const getHeroes = async (req: Request, res: Response) => {
    const heroes = await CatSuperheroe.query().orderBy('id', 'asc');
    res.json(heroes);
};

export const createHero = async (req: Request, res: Response) => {
    const newHero = await CatSuperheroe.query().insert(req.body);
    res.json(newHero);
};

export const updateHero = async (req: Request, res: Response) => {
    await CatSuperheroe.query().findById(req.params.id).patch(req.body);
    res.json({ message: 'Actualizado' });
};

export const deleteHero = async (req: Request, res: Response) => {
    await CatSuperheroe.query().deleteById(req.params.id);
    res.json({ message: 'Eliminado' });
};