export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string
  ) {}

  static create(params: { id: string; name: string; email: string }): User {
    if (!params.name || !params.email) {
      throw new Error("Name and email are required");
    }
    return new User(params.id, params.name.trim(), params.email.trim().toLowerCase());
  }
}