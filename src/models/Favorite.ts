import { Model } from 'objection';
import { CatSuperheroe } from './CatSuperheroe';

export class Favorite extends Model {
  user_id!: number;
  superheroe_id!: number;

  static get tableName() {
    return 'favorites';
  }

  static get idColumn() {
    return ['user_id', 'superheroe_id'];
  }

  static get relationMappings() {
    return {
      heroe: {
        relation: Model.BelongsToOneRelation,
        modelClass: CatSuperheroe,
        join: {
          from: 'favorites.superheroe_id',
          to: 'catsuperheroe.id'
        }
      }
    };
  }
}
