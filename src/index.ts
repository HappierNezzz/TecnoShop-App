import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Model } from 'objection';
import knex from './database';
import heroRoutes from './routes/hero.routes';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

// Cargar las variables del archivo .env
dotenv.config();

// Conectar los modelos a la base de datos
Model.knex(knex);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Esto sirve la página web y las imágenes

// Conectar las rutas
app.use('/api/heroes', heroRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Encender el servidor
app.listen(3000, () => {
    console.log('🚀 ¡Servidor encendido y escuchando en http://localhost:3000!');
});