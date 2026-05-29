import { User } from "../../domain/entities/User";
import { UserRepository } from "../ports/UserRepository";

export class GetUserByIdUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(id: string): Promise<User | null> {
    return this.repo.findById(id);
  }
}