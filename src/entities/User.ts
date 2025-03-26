import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity
} from 'typeorm';

@Entity('usuarios')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		length: 100,
		nullable: false,
	})
	nombre: string;

	@Column({
		length: 100,
		unique: true,
		nullable: false,
	})
	email: string;

	@Column({
		length: 255,
		nullable: false,
	})
	contraseña: string;

	@Column({
		length: 20,
		nullable: false,
	})
	rol: string;

	@CreateDateColumn({
		type: 'timestamp with time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	fecha_creacion: Date;

	@UpdateDateColumn({
		type: 'timestamp with time zone',
	})
	updated_at: Date;
}
