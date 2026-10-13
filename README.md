# Arch Back Node MS Hexag

TypeScript/Fastify user service with domain, application ports, persistence adapters and HTTP/AWS/Azure entry points.

## Local use

Node.js 24+ (see `.nvmrc`).

```sh
npm ci
npm run build
npm start
```

The default HTTP port is 3001. Set `PORT=5010` to use the example port. Environment values must be exported by the shell; `.env.example` is a reference, not an automatically loaded file.

`PROVIDER=local` (default) shares one in-memory repository; data disappears on restart. `PROVIDER=aws` selects DynamoDB using `AWS_REGION`, `USERS_TABLE` and optional `DYNAMO_ENDPOINT`. `docker compose up --build` runs the app on 5010 with local DynamoDB on 8000.

HTTP routes: `GET /health`, `POST /users` with `name`/`email`, `GET /users/:id`, and `GET /users` with optional `email` or `limit`.

## Verification and adapters

Run `npm test`, `npm run build` and `npm run type-check`. Tests are under `tests/domain`, `tests/application`, `tests/infrastructure` and `tests/presentation`; the older category scripts target directories not present in this checkout.

After building, `npx serverless offline --httpPort 3001` exposes the configured HTTP API on port 3001. The default in `serverless.yml` is 5010; its provider is AWS and needs a reachable DynamoDB configuration. Only `POST /users` and `GET /health` are mapped there.

`src/presentation/azure/createUser/index.ts` is an Azure handler skeleton; Azure host/function configuration is not included. There are no Kubernetes manifests. Cloud deployment is configured in `serverless.yml` and requires separate credentials and review.
