import { createConnection } from 'typeorm';
import { Order } from './entities/Orden';
import { User } from './entities/User';
import { Product } from './entities/Products';

export async function connectToDatabase() {
    try {
        await createConnection({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "2J6uM%2Fp-1%7Cd+",
            database: "Prueba-Tecnica",
            synchronize: false,
            logging: true,
            entities: [Order, User, Product],
        });
    } catch (error) {
        console.error(error);
        throw new Error('Unable to connect to db');
    }
}

connectToDatabase();