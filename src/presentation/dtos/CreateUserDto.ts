export type CreateUserDto = {
  name: string;
  email: string;
};

export function validateCreateUserDto(body: unknown): CreateUserDto {
  if (
    typeof body === "object" &&
    body !== null &&
    "name" in body &&
    "email" in body &&
    typeof (body as any).name === "string" &&
    typeof (body as any).email === "string"
  ) {
    return { name: (body as any).name, email: (body as any).email };
  }
  throw new Error("Invalid body: expected { name: string; email: string }");
}