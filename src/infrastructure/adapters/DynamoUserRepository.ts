import { DynamoDBClient, PutItemCommand, GetItemCommand, ScanCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../application/ports/UserRepository";

export class DynamoUserRepository implements UserRepository {
  private readonly client: DynamoDBClient;
  private readonly tableName: string;

  constructor(client?: DynamoDBClient, tableName?: string) {
    const region = process.env.AWS_REGION || "us-east-1";
    const endpoint = process.env.DYNAMO_ENDPOINT; // e.g., http://localhost:8000
    this.client = client ?? new DynamoDBClient(endpoint ? { region, endpoint } : { region });
    this.tableName = tableName ?? process.env.USERS_TABLE ?? "UsersTable";
  }

  async save(user: User): Promise<void> {
    const item = {
      id: { S: user.id },
      name: { S: user.name },
      email: { S: user.email }
    } as const;
    await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: item
      })
    );
  }

  async findById(id: string): Promise<User | null> {
    const res = await this.client.send(
      new GetItemCommand({
        TableName: this.tableName,
        Key: { id: { S: id } }
      })
    );
    const i = res.Item;
    if (!i) return null;
    return new User(i.id!.S!, i.name!.S!, i.email!.S!);
  }

  async findByEmail(email: string): Promise<User | null> {
    const e = email.trim().toLowerCase();
    // If there were a GSI on email, we'd Query on it; for demo, use Scan with FilterExpression
    const res = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "email = :e",
        ExpressionAttributeValues: { ":e": { S: e } }
      })
    );
    const i = res.Items?.[0];
    if (!i) return null;
    return new User(i.id!.S!, i.name!.S!, i.email!.S!);
  }

  async list(limit: number = 3): Promise<User[]> {
    const res = await this.client.send(
      new ScanCommand({ TableName: this.tableName, Limit: limit })
    );
    const items = res.Items ?? [];
    return items.map((i) => new User(i.id!.S!, i.name!.S!, i.email!.S!));
  }
}