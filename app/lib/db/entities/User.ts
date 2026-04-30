import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index({ unique: true })
  @Column({ name: "apple_user_id", type: "varchar", length: 255 })
  appleUserId!: string;

  @Column({ type: "varchar", length: 320, nullable: true })
  email!: string | null;

  @Column({ name: "is_private_email", type: "boolean", default: false })
  isPrivateEmail!: boolean;

  @Column({ name: "first_name", type: "varchar", length: 100, nullable: true })
  firstName!: string | null;

  @Column({ name: "last_name", type: "varchar", length: 100, nullable: true })
  lastName!: string | null;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  // Champ calculé — pas persisté
  get fullName(): string {
    const parts = [this.firstName, this.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : "Utilisateur Apple";
  }
}