import type { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildHttpApp } from "../http/app";

const app = buildHttpApp();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (event.httpMethod === "GET" && event.path === "/health") {
      const res = await app.inject({ method: "GET", url: "/health" });
      return {
        statusCode: res.statusCode,
        headers: Object.fromEntries(Object.entries(res.headers).map(([k, v]) => [k, String(v)])),
        body: res.body
      };
    }

    if (event.httpMethod === "POST" && event.path === "/users") {
      const body = event.body ? JSON.parse(event.body) : {};
      const res = await app.inject({
        method: "POST",
        url: "/users",
        payload: body,
        headers: { "Content-Type": "application/json" }
      });
      return {
        statusCode: res.statusCode,
        headers: Object.fromEntries(Object.entries(res.headers).map(([k, v]) => [k, String(v)])),
        body: res.body
      };
    }

    return { statusCode: 404, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Not Found" }) };
  } catch (err: any) {
    const message = err?.message ?? "Internal Server Error";
    return {
      statusCode: /invalid/i.test(message) ? 400 : 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: message })
    };
  }
};