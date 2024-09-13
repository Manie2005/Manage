/* eslint-disable prettier/prettier */
import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'; // Import TypeORM decorators

// Base entity that other entities can extend
@Entity()
export class Base {
  // Primary key column with UUID type for unique identification
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Automatically set the date when the entity is created
  @CreateDateColumn()
  createdDate: Date;
}
