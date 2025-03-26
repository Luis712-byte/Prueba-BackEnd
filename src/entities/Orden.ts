import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	BaseEntity,
} from 'typeorm';
import { Product } from './Products';
import { User } from './User';

export enum OrderStatus {
	PENDING = 'pendiente',
	COMPLETED = 'completada',
	CANCELLED = 'cancelada',
}

@Entity('ordenes')
export class Order extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, { onDelete: 'SET NULL' })
	@JoinColumn({ name: 'usuario_id' })
	user: User;

	@ManyToOne(() => Product, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'producto_id' })
	product: Product;

	@Column({
		type: 'integer',
		nullable: false,
	})
	cantidad: number;

	@Column({
		type: 'numeric',
		precision: 10,
		scale: 2,
		nullable: false,
	})
	total: number;

	@Column({
		type: 'enum',
		enum: OrderStatus,
		nullable: false,
	})
	estado: OrderStatus;

	@CreateDateColumn({
		type: 'timestamp with time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	fecha_creacion: Date;
}
