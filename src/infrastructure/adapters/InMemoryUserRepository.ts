import { User } from "../../domain/entities/User";
import { UserRepository } from "../../application/ports/UserRepository";

export class InMemoryUserRepository implements UserRepository {
  private readonly store = new Map<string, User>();

  async save(user: User): Promise<void> {
    this.store.set(user.id, user);
  }

  async findById(id: string): Promise<User | null> {
    return this.store.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const e = email.trim().toLowerCase();
    for (const u of this.store.values()) {
      if (u.email === e) return u;
    }
    return null;
  }

  async list(limit: number = 3): Promise<User[]> {
    return Array.from(this.store.values()).slice(0, limit);
  }
}