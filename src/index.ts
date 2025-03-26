import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './serves';
import { UserControllers } from './controllers/UserController';
import { ProductsController } from './controllers/ProductsController';
import { OrdenesController } from './controllers/OrdenesController';
import { AuthController } from './controllers/authController';

const app = express();
app.use(cors());
app.use(express.json());

const main = async () => {
	app.use(express.json());
	app.use(UserControllers);
	app.use(ProductsController);
	app.use(OrdenesController);
	app.use(AuthController);

	connectToDatabase();

	app.listen(3000, () => {
		console.log('Connected to Postgres');
		console.log('Now running on port 3000');
	});

};

main();
