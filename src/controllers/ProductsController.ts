import express from 'express';
import { Product } from '../entities/Products';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware para verificar si el usuario es Admin
interface AdminRequest extends Request {
    body: {
        rol: string;
        nombre?: string;
        descripcion?: string;
        precio?: number;
        cantidad_stock?: number;
    };
}

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

const isAdmin = (req: Request, res: Response, next: NextFunction): Response | void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { rol: string };

        if (decoded.rol !== 'Admin') {
            return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' });
        }

        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

// Crear un producto (solo Admin)
router.post('/products', isAdmin, async (req, res) => {
    const { nombre, descripcion, precio, cantidad_stock } = req.body;

    try {
        if (!nombre || !precio || cantidad_stock === undefined) {
            return res.status(400).json({ message: 'Faltan datos requeridos: nombre, precio o cantidad_stock' });
        }

        const product = Product.create({
            nombre,
            descripcion,
            precio,
            cantidad_stock,
        });

        await product.save();
        return res.status(201).json(product);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        return res.status(500).json({ message: 'Error al crear el producto' });
    }
});

// Listar todos los productos
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({ order: { id: 'ASC' } });
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }
});

// Obtener un producto específico
router.get('/products/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findOne({ where: { id: parseInt(id) } });

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener el producto' });
    }
});

// Actualizar un producto (solo Admin)
router.put('/products/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, cantidad_stock } = req.body;

    try {
        const product = await Product.findOne({ where: { id: parseInt(id) } });

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        product.nombre = nombre || product.nombre;
        product.descripcion = descripcion || product.descripcion;
        product.precio = precio || product.precio;
        product.cantidad_stock = cantidad_stock || product.cantidad_stock;

        await product.save();

        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

// Eliminar un producto (solo Admin)
router.delete('/products/:id', isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Product.delete({ id: parseInt(id) });

        if (result.affected === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        return res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});

export { router as ProductsController };