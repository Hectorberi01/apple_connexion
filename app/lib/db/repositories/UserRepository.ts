import { DataSource, Repository } from "typeorm";
import { User } from "../entities/User";
import { CreateAccountPayload } from "@/app/types/appleAuth";

export class UserRepository {
  private repo: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(User);
  }

  /**
   * Crée l'utilisateur s'il n'existe pas, sinon le retourne tel quel.
   * Le nom/prénom n'est mis à jour que si null en base (première connexion Apple).
   */
  async upsertAppleUser(payload: CreateAccountPayload): Promise<User> {
    const existing = await this.repo.findOne({
      where: { appleUserId: payload.appleUserId },
    });

    if (existing) {
      let dirty = false;

      // Mettre à jour le nom si Apple l'a fourni et qu'on ne l'a pas encore
      if (!existing.firstName && payload.firstName) {
        existing.firstName = payload.firstName;
        dirty = true;
      }
      if (!existing.lastName && payload.lastName) {
        existing.lastName = payload.lastName;
        dirty = true;
      }
      // Mettre à jour l'email si on l'a maintenant
      if (!existing.email && payload.email) {
        existing.email = payload.email;
        dirty = true;
      }

      return dirty ? this.repo.save(existing) : existing;
    }

    const user = this.repo.create({
      appleUserId: payload.appleUserId,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      isPrivateEmail: payload.isPrivateEmail ?? false,
    });

    return this.repo.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByAppleId(appleUserId: string): Promise<User | null> {
    return this.repo.findOne({ where: { appleUserId } });
  }
}