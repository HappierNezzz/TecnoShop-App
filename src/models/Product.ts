import { Model } from 'objection';

export class Product extends Model {
    id!: number;
    nombre!: string;
    descripcion!: string;
    precio!: number;
    imagen_url!: string;
    stock!: number;
    categoria!: string;

    static get tableName() { return 'products'; }
}
