import Fastify from "fastify";
import { buildCreateUserUseCase, buildGetUserByIdUseCase, buildGetUserByEmailUseCase, buildListUsersUseCase } from "../../infrastructure/container";
import { validateCreateUserDto } from "../dtos/CreateUserDto";

export function buildHttpApp() {
  const app = Fastify({ logger: process.env.NODE_ENV !== "test" });

  // Health check para pruebas rápidas
  app.get("/health", async (_request, reply) => {
    return reply.code(200).send({ status: "ok" });
  });

  app.post("/users", async (request, reply) => {
    try {
      const dto = validateCreateUserDto(request.body);
      const useCase = buildCreateUserUseCase();
      const result = await useCase.execute(dto);
      return reply.code(201).send({ id: result.id });
    } catch (err: any) {
      const message = err?.message ?? "Internal Server Error";
      const code = /invalid/i.test(message) ? 400 : 500;
      return reply.code(code).send({ error: message });
    }
  });

  // Obtener por id
  app.get("/users/:id", async (request, reply) => {
    const { id } = request.params as any;
    const useCase = buildGetUserByIdUseCase();
    const user = await useCase.execute(id);
    if (!user) return reply.code(404).send({ error: "Not Found" });
    return reply.code(200).send(user);
  });

  // Buscar por email
  app.get("/users", async (request, reply) => {
    const { email, limit } = (request.query as any) ?? {};
    if (email) {
      const useCase = buildGetUserByEmailUseCase();
      const user = await useCase.execute(String(email));
      if (!user) return reply.code(404).send({ error: "Not Found" });
      return reply.code(200).send(user);
    }
    const n = limit ? Number(limit) : 3;
    const listUseCase = buildListUsersUseCase();
    const users = await listUseCase.execute(n);
    return reply.code(200).send(users);
  });

  return app;
}
