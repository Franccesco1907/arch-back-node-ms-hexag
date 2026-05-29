import { describe, it, expect } from "vitest";
import { User } from "../../src/domain/entities/User";

describe("Domain: User", () => {
  it("normaliza name y email (trim y lowercase)", () => {
    const u = User.create({ id: "1", name: "  Alice  ", email: "Alice@Example.COM" });
    expect(u.name).toBe("Alice");
    expect(u.email).toBe("alice@example.com");
  });

  it("lanza error si falta name", () => {
    expect(() => User.create({ id: "1", name: "", email: "x@y.com" })).toThrowError();
  });

  it("lanza error si falta email", () => {
    expect(() => User.create({ id: "1", name: "Bob", email: "" })).toThrowError();
  });
});