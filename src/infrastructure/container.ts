import { DynamoUserRepository } from "./adapters/DynamoUserRepository";
import { InMemoryUserRepository } from "./adapters/InMemoryUserRepository";
import { CreateUserUseCase } from "../application/use_cases/CreateUser";
import { GetUserByIdUseCase } from "../application/use_cases/GetUserById";
import { GetUserByEmailUseCase } from "../application/use_cases/GetUserByEmail";
import { ListUsersUseCase } from "../application/use_cases/ListUsers";
import type { UserRepository } from "../application/ports/UserRepository";

let repoInstance: UserRepository | null = null;

export function buildRepo() {
  if (repoInstance) return repoInstance;
  const provider = (process.env.PROVIDER ?? "local").toLowerCase();
  repoInstance = provider === "aws" ? new DynamoUserRepository() : new InMemoryUserRepository();
  return repoInstance;
}

export function buildCreateUserUseCase(): CreateUserUseCase {
  return new CreateUserUseCase(buildRepo());
}

export function buildGetUserByIdUseCase(): GetUserByIdUseCase {
  return new GetUserByIdUseCase(buildRepo());
}

export function buildGetUserByEmailUseCase(): GetUserByEmailUseCase {
  return new GetUserByEmailUseCase(buildRepo());
}

export function buildListUsersUseCase(): ListUsersUseCase {
  return new ListUsersUseCase(buildRepo());
}