import { describe, it, expect } from "vitest";
import { InMemoryUserRepository } from "../../src/infrastructure/adapters/InMemoryUserRepository";
import { User } from "../../src/domain/entities/User";

describe("Infrastructure: InMemoryUserRepository", () => {
  it("guarda y recupera usuario por id", async () => {
    const repo = new InMemoryUserRepository();
    const u = User.create({ id: "abc-123", name: "Dave", email: "dave@example.com" });

    await repo.save(u);
    const fetched = await repo.findById("abc-123");

    expect(fetched).not.toBeNull();
    expect(fetched!.id).toBe("abc-123");
    expect(fetched!.email).toBe("dave@example.com");
  });
});