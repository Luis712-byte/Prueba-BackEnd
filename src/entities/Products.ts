import {
	Entity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	BaseEntity,
} from 'typeorm';

@Entity('productos')
export class Product extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		length: 100,
		nullable: false,
	})
	nombre: string;

	@Column({
		type: 'text',
		nullable: true,
	})
	descripcion: string;

	@Column({
		type: 'numeric',
		precision: 10,
		scale: 2,
		nullable: false,
	})
	precio: number;

	@Column({
		type: 'integer',
		nullable: false,
	})
	cantidad_stock: number;

	@CreateDateColumn({
		type: 'timestamp with time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	fecha_creacion: Date;
}
