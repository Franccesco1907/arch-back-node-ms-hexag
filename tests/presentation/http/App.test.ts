import { describe, it, expect, beforeAll } from "vitest";
import { buildHttpApp } from "../../../src/presentation/http/app";

describe("Presentation: HTTP App", () => {
  let app: ReturnType<typeof buildHttpApp>;

  beforeAll(() => {
    app = buildHttpApp();
  });

  it("GET /health responde 200 con status ok", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ status: "ok" });
  });

  it("POST /users válido responde 201 con id", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/users",
      payload: { name: "Juan", email: "juan@example.com" },
      headers: { "Content-Type": "application/json" }
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(typeof body.id).toBe("string");
  });

  it("POST /users inválido responde 400", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/users",
      payload: { name: "SinEmail" },
      headers: { "Content-Type": "application/json" }
    });
    expect(res.statusCode).toBe(400);
  });

  it("GET /users?email devuelve el usuario por email", async () => {
    // Crear usuario
    const create = await app.inject({
      method: "POST",
      url: "/users",
      payload: { name: "Ana", email: "ana@example.com" },
      headers: { "Content-Type": "application/json" }
    });
    expect(create.statusCode).toBe(201);

    const res = await app.inject({ method: "GET", url: "/users?email=ana@example.com" });
    expect(res.statusCode).toBe(200);
    const user = JSON.parse(res.body);
    expect(user.email).toBe("ana@example.com");
  });

  it("GET /users lista 3 usuarios como máximo por defecto y respeta limit", async () => {
    const payloads = [
      { name: "U1", email: "u1@example.com" },
      { name: "U2", email: "u2@example.com" },
      { name: "U3", email: "u3@example.com" },
      { name: "U4", email: "u4@example.com" }
    ];
    for (const p of payloads) {
      const r = await app.inject({ method: "POST", url: "/users", payload: p, headers: { "Content-Type": "application/json" } });
      expect(r.statusCode).toBe(201);
    }

    const resDefault = await app.inject({ method: "GET", url: "/users" });
    expect(resDefault.statusCode).toBe(200);
    const listDefault = JSON.parse(resDefault.body);
    expect(Array.isArray(listDefault)).toBe(true);
    expect(listDefault.length).toBeLessThanOrEqual(3);

    const resLimit2 = await app.inject({ method: "GET", url: "/users?limit=2" });
    expect(resLimit2.statusCode).toBe(200);
    const list2 = JSON.parse(resLimit2.body);
    expect(list2.length).toBeLessThanOrEqual(2);
  });

  it("GET /users/:id devuelve 404 si no existe y 200 si existe", async () => {
    const notFound = await app.inject({ method: "GET", url: "/users/does-not-exist" });
    expect(notFound.statusCode).toBe(404);

    // Crear y luego leer por id
    const create = await app.inject({
      method: "POST",
      url: "/users",
      payload: { name: "Leo", email: "leo@example.com" },
      headers: { "Content-Type": "application/json" }
    });
    const id = JSON.parse(create.body).id;

    const res = await app.inject({ method: "GET", url: `/users/${id}` });
    expect(res.statusCode).toBe(200);
    const user = JSON.parse(res.body);
    expect(user.id).toBe(id);
  });
});