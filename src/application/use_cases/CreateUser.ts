import { randomUUID } from "crypto";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../ports/UserRepository";

export class CreateUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(input: { name: string; email: string }): Promise<{ id: string }> {
    const id = randomUUID();
    const user = User.create({ id, name: input.name, email: input.email });
    await this.repo.save(user);
    return { id };
  }
}