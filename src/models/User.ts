import { Model } from 'objection';

export class User extends Model {
  id!: number;
  nombre!: string;
  email!: string;
  password!: string;
  role!: string;
  created_at!: string;

  static get tableName() {
    return 'users';
  }
}
