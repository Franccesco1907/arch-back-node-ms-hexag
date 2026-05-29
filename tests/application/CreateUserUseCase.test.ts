import { describe, it, expect } from "vitest";
import { CreateUserUseCase } from "../../src/application/use_cases/CreateUser";
import { UserRepository } from "../../src/application/ports/UserRepository";
import { User } from "../../src/domain/entities/User";

class MockRepo implements UserRepository {
  saved?: User;
  async save(user: User): Promise<void> { this.saved = user; }
  async findById(_id: string): Promise<User | null> { return null; }
}

describe("Application: CreateUserUseCase", () => {
  it("genera id y guarda el usuario", async () => {
    const repo = new MockRepo();
    const uc = new CreateUserUseCase(repo);

    const result = await uc.execute({ name: "Charlie", email: "CHARLIE@Example.com" });
    expect(typeof result.id).toBe("string");
    expect(result.id.length).toBeGreaterThan(0);

    expect(repo.saved).toBeDefined();
    expect(repo.saved!.name).toBe("Charlie");
    expect(repo.saved!.email).toBe("charlie@example.com");
  });
});