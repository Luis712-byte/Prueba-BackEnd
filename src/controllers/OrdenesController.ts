import express from 'express';
import { Request } from 'express';
import { Order, OrderStatus } from '../entities/Orden';
import { User } from '../entities/User';
import { Product } from '../entities/Products';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include the user property
interface AuthenticatedRequest extends Request {
    user?: User; // Add the user property to the interface
}

// Removed duplicate declaration of authenticate

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Middleware para autenticar al usuario
const authenticate: express.RequestHandler = async (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        if (typeof decoded !== 'object' || !('id' in decoded)) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }
        const user = await User.findOne({ where: { id: decoded.id } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        req.user = user; // Adjuntar el usuario autenticado a la solicitud
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

// Crear una orden (solo Cliente)
router.post('/orders', authenticate, async (req: AuthenticatedRequest, res: express.Response) => {
    const { items, total, estado }: { items: string; total: number; estado: OrderStatus } = req.body;

    try {
        // Verificar que el usuario sea cliente
        if (req.user?.rol !== 'Usuario') {
            return res.status(403).json({ message: 'Solo los clientes pueden crear órdenes' });
        }

        // Buscar el producto por nombre
        const product = await Product.findOne({ where: { nombre: items } });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const order = new Order();
        order.user = req.user; 
        order.product = product; 
        order.cantidad = total; 
        order.total = product.precio * total; 
        order.estado = estado; 

        await order.save();

        const response = {
            id: order.id,
            cantidad: order.cantidad,
            total: order.total,
            estado: order.estado,
            fecha_creacion: order.fecha_creacion,
            producto: {
                id: product.id,
                nombre: product.nombre,
                descripcion: product.descripcion,
                precio: product.precio,
            },
            cliente: {
                id: req.user.id,
                nombre: req.user.nombre,
                email: req.user.email,
            },
        };

        return res.status(201).json(response);
    } catch (error) {
        console.error('Error al crear la orden:', error);
        return res.status(500).json({ message: 'Error al crear la orden' });
    }
});
// Listar órdenes del usuario autenticado (Admin ve todas)
router.get('/orders', authenticate, async (req: AuthenticatedRequest, res: express.Response) => {
    try {
        let orders;

        if (req.user?.rol === 'admin') {
            // Si es admin, listar todas las órdenes
            orders = await Order.find({ relations: ['user', 'product'] });
        } else {
            // Si es cliente, listar solo sus órdenes
            orders = await Order.find({ where: { user: req.user }, relations: ['user', 'product'] });
        }

        return res.json(orders);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las órdenes' });
    }
});

// Ver detalles de una orden
router.get('/orders/:id', authenticate, async (req: AuthenticatedRequest, res: express.Response) => {
    const { id } = req.params as { id: string };

    try {
        const order = await Order.findOne({ where: { id: parseInt(id) }, relations: ['user', 'product'] });

        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        // Si es cliente, verificar que la orden le pertenezca
        if (!req.user || (req.user.rol !== 'admin' && order.user.id !== req.user.id)) {
            return res.status(403).json({ message: 'No tienes permiso para ver esta orden' });
        }

        return res.json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los detalles de la orden' });
    }
});

export { router as OrdenesController };