import { Model } from 'objection';

export class CatSuperheroe extends Model {
    id!: number;
    nombre!: string;
    poder!: string;
    fortaleza!: string;
    resistencia!: string;
    debilidad!: string;
    imagen_url!: string;

    static get tableName() { return 'catsuperheroe'; }
}