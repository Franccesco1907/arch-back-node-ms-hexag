# Arch Back Node MS Hexagonal (arch-back-node-ms-hexag)

Este proyecto implementa un arquetipo backend en Node.js siguiendo arquitectura Hexagonal/Clean, organizado en capas: dominio, aplicación, infraestructura y presentación. Incluye servidor HTTP local con Fastify, handler para AWS Lambda (Serverless), y pruebas con Vitest.

## Estructura

- src/
  - domain/: Entidades del dominio (p. ej., User)
  - application/: Casos de uso (p. ej., CreateUserUseCase)
  - infrastructure/: Implementaciones (p. ej., repositorios DynamoDB, contenedor de dependencias)
  - presentation/
    - http/: servidor Fastify local
    - aws/: handler de AWS Lambda
    - azure/: función HTTP Azure (esqueleto)
- tests/: pruebas unitarias e integración por capa
- serverless.yml: definición de funciones/API para AWS
- package.json: scripts de build, test, start y deploy
- tsconfig.json: configuración de TypeScript

## Requisitos

- Node.js 18+ (recomendado 18.x o 20.x)
- npm 9+

## Instalación

1) Instalar dependencias:

```
npm install
```

2) Compilar TypeScript:

```
npm run build
```

## Ejecución local (Fastify)

El servidor HTTP puede arrancar en cualquier puerto vía variable de entorno. Por alineación con el arquetipo Python, se usa 5010.

- PowerShell (Windows):
  - $env:PORT=5010; $env:PROVIDER='local'; npm start

Si no estableces PORT, el servidor usa 3000 por defecto.

Endpoints:
- GET http://localhost:5010/health → { "status": "ok" }
- POST http://localhost:5010/users → Body: { "name": "Juan", "email": "juan@example.com" }
- GET http://localhost:5010/users/:id → devuelve el usuario por id (404 si no existe)
- GET http://localhost:5010/users?email=juan@example.com → devuelve el usuario por email (404 si no existe)
- GET http://localhost:5010/users?limit=3 → lista usuarios (por defecto lista 3)

Ejemplos rápidos (PowerShell/curl):
- curl http://localhost:5010/health
- curl -s -H "Content-Type: application/json" -d "{\"name\":\"Juan\",\"email\":\"juan@example.com\"}" http://localhost:5010/users
- curl http://localhost:5010/users?email=juan@example.com
- curl http://localhost:5010/users?limit=3

Código relevante:
- Servidor: src/presentation/http/server.ts
- App: src/presentation/http/app.ts

## Pruebas (Vitest)

Ejecutar todas las pruebas:

```
npm test
```

Ejecutar en modo watch:

```
npm run test:watch
```

Suites incluidas:
- tests/domain/User.test.ts
- tests/application/CreateUserUseCase.test.ts
- tests/infrastructure/InMemoryUserRepository.test.ts
- tests/presentation/http/App.test.ts (cubre /health, /users (POST), /users/:id, /users?email y /users (lista con limit))

## Serverless Offline (AWS API Gateway/Lambda local)

Para probar el handler de AWS de forma local:

```
npx serverless offline --httpPort 3001
```

- HTTP para lambda expuesto en: http://localhost:3002/
- Endpoints:
  - GET http://localhost:3002/health
  - POST http://localhost:3002/users

Archivos:
- Handler: dist/presentation/aws/handler.js (build previo requerido)
- Configuración: serverless.yml

## Despliegue en AWS

Asegúrate de tener credenciales configuradas (AWS CLI o variables de entorno). Luego:

- Deploy:
```
npm run deploy:aws
```

- Remove:
```
npm run remove:aws
```

El stack crea la tabla DynamoDB `UsersTable` (BillingMode: PAYPERREQUEST) y expone los endpoints /users (POST) y /health (GET) vía HTTP API.

## Adaptación a Kubernetes (guía mínima)

1) Construye una imagen Docker del servidor HTTP local:

Ejemplo de Dockerfile sugerido (no incluido por defecto en este repo):

```
# syntax=docker/dockerfile:1
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/presentation/http/server.js"]
```

2) Construir y probar localmente:

```
docker build -t arch-back-node-hexag:latest .
docker run --rm -p 3000:3000 arch-back-node-hexag:latest
```

3) Manifiesto de Deployment/Service (ejemplo mínimo):

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: arch-back-node-hexag
spec:
  replicas: 1
  selector:
    matchLabels:
      app: arch-back-node-hexag
  template:
    metadata:
      labels:
        app: arch-back-node-hexag
    spec:
      containers:
        - name: app
          image: arch-back-node-hexag:latest
          ports:
            - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: arch-back-node-hexag-svc
spec:
  type: ClusterIP
  selector:
    app: arch-back-node-hexag
  ports:
    - port: 3000
      targetPort: 3000
```

4) Aplicar en el cluster:

```
kubectl apply -f k8s.yaml
```

## Nota sobre Azure Functions

El repositorio incluye un esqueleto para Azure Functions HTTP (carpeta `azure/`) con `function.json` y `host.json`. Para usarlo necesitas compilar (`npm run build`) y configurar un runtime de Azure Functions. Este camino es opcional y no interfiere con la ejecución local ni con Serverless/AWS.

## Troubleshooting

- Si `App.test.ts` falla, verifica que `src/presentation/http/app.ts` no tenga imports duplicados ni llaves de cierre extra, y que el app se construya sin efectos secundarios antes del registro de las rutas.
- Si Serverless Offline arranca en http://localhost:3002, usa esa URL para las pruebas locales por Lambda.
- Recuerda compilar antes de `serverless offline` para que el handler referencie `dist/` correctamente.

## Troubleshooting

- Si las rutas de lectura devuelven 404 en modo in-memory, asegúrate de crear primero el usuario con POST /users y que el contenedor comparta una única instancia de repositorio (esto ya está configurado en `src/infrastructure/container.ts`).