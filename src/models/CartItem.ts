import { Model } from 'objection';
import { Product } from './Product';

export class CartItem extends Model {
  id!: number;
  user_id!: number;
  product_id!: number;
  cantidad!: number;

  // Relation properties
  product?: Product;

  static get tableName() {
    return 'cart_items';
  }

  static get relationMappings() {
    return {
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'cart_items.product_id',
          to: 'products.id'
        }
      }
    };
  }
}
