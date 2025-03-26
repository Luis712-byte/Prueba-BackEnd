import express from 'express';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';



dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

const router = express.Router();

// Obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ order: { id: 'ASC' } });
        return res.json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
});

// Obtener un usuario por Contraseña
router.post('/users/by-token', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'El token es requerido' });
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET); 


        const user = await User.findOne({ where: { email: decoded.email } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.json({ rol: user.rol });

    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
});

// Obtener un usuario por ID
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    const user = await User.findOne({ where: { id: parseInt(id) } });

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json(user);
});

// Editar un usuario
router.put('/users/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, contraseña, email, rol } = req.body;

    try {
        const user = await User.findOne({ where: { id: parseInt(id) } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser && existingUser.id !== user.id) {
                return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
            }
        }

        // Actualizar los campos del usuario
        user.nombre = nombre || user.nombre;
        user.email = email || user.email;
        user.rol = rol || user.rol;

        // Si se proporciona una nueva contraseña, encriptarla y actualizarla
        if (contraseña) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contraseña, salt);
            user.contraseña = hashedPassword;
        }

        await user.save();

        // Generar un nuevo token JWT con la clave secreta estática
        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol },
            JWT_SECRET, // Clave secreta estática
            { expiresIn: '1h' } // El token expira en 1 hora
        );

        return res.json({ user, token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
});
// Crear un usuario
router.post('/users/create', async (req, res) => {
    const { nombre, contraseña, email, rol } = req.body;

    try {
        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        // Crear el usuario con la contraseña encriptada
        const user = User.create({
            nombre: nombre,
            email: email,
            contraseña: hashedPassword,
            rol: rol,
        });

        await user.save();

        // Generar un token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol },
            JWT_SECRET, // Cambia esto por una clave secreta segura
            { expiresIn: '1h' } // El token expira en 1 hora
        );

        return res.status(201).json({ user, token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear el usuario' });
    }
});

// Eliminar un usuario
router.delete(
    '/users/create/delete/:id',
    async (req, res) => {
        const { id } = req.params;

        const response = await User.delete(
            id
        );

        return res.json(response);
    }
);


export { router as UserControllers };
