import { buildHttpApp } from "./app";
import { DynamoDBClient, ListTablesCommand, CreateTableCommand } from "@aws-sdk/client-dynamodb";

async function ensureUsersTableIfNeeded() {
  const provider = (process.env.PROVIDER ?? "local").toLowerCase();
  const autoCreate = String(process.env.AUTO_CREATE_TABLE ?? "false").toLowerCase() === "true";
  if (provider !== "aws" || !autoCreate) return;

  const region = process.env.AWS_REGION || "us-east-1";
  const endpoint = process.env.DYNAMO_ENDPOINT; // e.g., http://localhost:8000
  const tableName = process.env.USERS_TABLE || "UsersTable";
  const client = new DynamoDBClient(endpoint ? { region, endpoint } : { region });

  const tables = await client.send(new ListTablesCommand({}));
  const exists = (tables.TableNames ?? []).includes(tableName);
  if (exists) return;

  await client.send(
    new CreateTableCommand({
      TableName: tableName,
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      BillingMode: "PAY_PER_REQUEST"
    })
  );
}

async function main() {
  process.env.PROVIDER = process.env.PROVIDER ?? "local";
  await ensureUsersTableIfNeeded();
  const app = buildHttpApp();
  const port = Number(process.env.PORT ?? 3001);
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`HTTP server running at http://localhost:${port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});