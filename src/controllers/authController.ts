import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Endpoint de prueba
router.get('/login/test', (req, res) => {
    return res.json({ message: 'El controlador de autenticación está funcionando correctamente' });
});

router.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;

    console.log('Contraseña proporcionada:', contraseña); // Verifica si está llegando correctamente


    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(contraseña, user.contraseña);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({ token, user: { id: user.id, email: user.email, rol: user.rol } });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ message: `Error al iniciar sesión: ${error.message}` });
    }

});
export { router as AuthController };