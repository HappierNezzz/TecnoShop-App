import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password, role } = req.body;
    
    if (!nombre || !email || !password) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' });
      return;
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.query().findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'El correo electrónico ya está registrado' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.query().insert({
      nombre,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error: any) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
