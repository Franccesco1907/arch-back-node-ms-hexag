import { User } from "../../domain/entities/User";
import { UserRepository } from "../ports/UserRepository";

export class ListUsersUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(limit: number = 3): Promise<User[]> {
    return this.repo.list(limit);
  }
}