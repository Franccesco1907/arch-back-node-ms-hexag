import type { InvocationContext, HttpRequest } from "@azure/functions";
import { buildCreateUserUseCase } from "../../../infrastructure/container";
import { validateCreateUserDto } from "../../dtos/CreateUserDto";

export default async function (context: InvocationContext, req: HttpRequest): Promise<void> {
  process.env.PROVIDER = process.env.PROVIDER ?? "azure";

  try {
    const dto = validateCreateUserDto(req.body);
    const useCase = buildCreateUserUseCase();
    const result = await useCase.execute(dto);

    (context as any).res = {
      status: 201,
      headers: { "Content-Type": "application/json" },
      body: { id: result.id }
    };
  } catch (err: any) {
    const message = err?.message ?? "Internal Server Error";
    const status = /invalid/i.test(message) ? 400 : 500;
    (context as any).res = {
      status,
      headers: { "Content-Type": "application/json" },
      body: { error: message }
    };
  }
}