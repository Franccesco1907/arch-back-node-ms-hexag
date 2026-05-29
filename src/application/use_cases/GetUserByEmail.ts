import { User } from "../../domain/entities/User";
import { UserRepository } from "../ports/UserRepository";

export class GetUserByEmailUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(email: string): Promise<User | null> {
    return this.repo.findByEmail(email);
  }
}