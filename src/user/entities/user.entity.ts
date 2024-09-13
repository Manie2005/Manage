/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany } from 'typeorm'; // Import necessary TypeORM decorators
import { Base } from './base.entity'; // Import the base entity that this entity extends
import { Role } from '../../enum/role.enum'; // Import the custom enum for role values
import { Todolist } from 'src/todolist/entities/todolist.entity'; // Import the related Todolist entity

// This marks the class as a database entity/table
@Entity()
export class User extends Base {
  // Column for storing the user's name
  @Column()
  name: string;

  // Column for storing the user's email, with a unique constraint
  @Column({ unique: true })
  email: string;

  // Column for storing the user's hashed password
  @Column()
  password: string;

  // Enum column for storing the user's role, defaulting to 'user' role
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.user, // Default role is 'user'
  })
  role: Role;

  // One-to-many relationship with the Todolist entity
  // A user can have multiple to-do items, but each to-do item belongs to only one user
  @OneToMany(() => Todolist, (todo) => todo.user)
  todo: Todolist;
}
