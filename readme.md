# NestJS Microservices Boilerplate

A production-ready NestJS microservices reference implementation following strict hexagonal architecture and Domain-Driven Design principles. Every layer boundary is enforced — the domain has zero framework dependencies, infrastructure never leaks into the application, and use cases are plain classes wired by `useFactory`.

## Stack

| Concern | Technology |
|---|---|
| Runtime | [Bun](https://bun.sh/) >= 1.2.0 |
| Framework | NestJS 11 + Fastify |
| Transport | TCP microservices |
| Database | PostgreSQL + TypeORM |
| Auth | JWT (RS256-ready) |
| Tests | `bun test` |
| CI/CD | GitHub Actions + GHCR + semantic-release |

---

## Architecture

### Hexagonal Architecture (Ports & Adapters)

Each microservice is structured in four strict layers. Dependency arrows point inward only — domain knows nothing about NestJS, TypeORM, or any other framework.

```
Domain ← Application ← Infrastructure ← NestJS Module
```

**Domain** — pure TypeScript, zero external dependencies:
- **Aggregate Roots** — private constructor, static `create()` and `reconstitute()`, domain event collection via `pullDomainEvents()`
- **Value Objects** — immutable, self-validating (`Email`, `HashedPassword`, `Money`, `StockCount`)
- **Domain Events** — `UserCreated`, `ProductCreated`
- **Domain Exceptions** — typed errors (`UserNotFound`, `InvalidEmail`, etc.) mapped to HTTP codes at the boundary
- **Output Ports** — repository and service interfaces (`IUserRepository`, `ITokenGenerator`, `IUserServiceClient`)

**Application** — one file per use case, plain classes, no `@Injectable()`:
- Each use case receives its ports through constructor injection
- Commands are typed plain objects; responses are domain snapshots
- Wired into NestJS via `useFactory` in the module — the only DI framework touch-point

**Infrastructure** — adapters that satisfy domain ports:
- **ORM Entities** — TypeORM decorated classes, registered per-service via `TypeOrmModule.forFeature`
- **Mappers** — the only files that see both layers (`toDomain` / `toPersistence`)
- **Repositories** — `XTypeOrmRepository implements IXRepository`
- **TCP Clients** — `TcpUserServiceClient implements IUserServiceClient`
- **JWT Adapter** — `JwtTokenGenerator implements ITokenGenerator`
- **Controllers** — NestJS `@MessagePattern` handlers, no business logic

**Shared Kernel** (`libs/common`) — TypeScript interfaces only:
- Snapshots: read-only projections of aggregates shared across services
- DTOs: validated request/response shapes for the HTTP gateway
- Enums: shared constants

### Microservices

| Service | Port | Responsibility |
|---|---|---|
| Gateway | `PORT` (default 3000) | HTTP entry point, Swagger, auth guard, request routing |
| Auth | `AUTH_TCP_PORT` (default 4001) | Login, register, refresh, logout, token validation |
| User | `USER_TCP_PORT` (default 4003) | User CRUD, email lookup, password hashing |
| Product | `PRODUCT_TCP_PORT` (default 4004) | Product CRUD |

---

## Project Structure

```
.
├── apps/
│   ├── gateway/                          # HTTP API (Fastify + Swagger)
│   │   └── src/
│   │       ├── domain/dtos/              # Request/response shapes
│   │       ├── application/services/     # Orchestrates TCP calls
│   │       └── infrastructure/controllers/
│   ├── auth/
│   │   └── src/
│   │       ├── domain/
│   │       │   ├── aggregates/           # AuthSession aggregate
│   │       │   ├── value-objects/        # HashedPassword VO
│   │       │   ├── ports/out/            # IAuthSessionRepository, ITokenGenerator, IUserServiceClient
│   │       │   └── exceptions/
│   │       ├── application/use-cases/    # Login, Register, Logout, RefreshToken, ValidateToken
│   │       └── infrastructure/
│   │           ├── clients/              # TcpUserServiceClient
│   │           ├── jwt/                  # JwtTokenGenerator
│   │           └── persistence/          # ORM entity, mapper, repository
│   ├── user/
│   │   └── src/
│   │       ├── domain/
│   │       │   ├── aggregates/           # User aggregate
│   │       │   ├── value-objects/        # Email, HashedPassword VOs
│   │       │   ├── ports/out/            # IUserRepository
│   │       │   ├── events/               # UserCreated
│   │       │   └── exceptions/
│   │       ├── application/use-cases/    # CreateUser, GetUserById, GetMe, UpdateUser, DeleteUser, ...
│   │       └── infrastructure/persistence/
│   └── product/
│       └── src/
│           ├── domain/
│           │   ├── aggregates/           # Product aggregate
│           │   ├── value-objects/        # Money, StockCount VOs
│           │   ├── ports/out/            # IProductRepository
│           │   ├── events/               # ProductCreated
│           │   └── exceptions/
│           ├── application/use-cases/    # CreateProduct, GetAllProducts, GetProductById, UpdateProduct, DeleteProduct
│           └── infrastructure/persistence/
├── libs/
│   ├── common/                           # Shared kernel (snapshots, DTOs, enums)
│   └── config/                           # DatabaseModule, AuthGuard, ErrorInterceptor
├── test/setup.ts                         # reflect-metadata preload for bun test
├── bunfig.toml                           # bun test configuration
├── .env.example                          # Environment variable reference
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.2.0
- [Docker](https://www.docker.com/) and Docker Compose (for PostgreSQL)

### Installation

```bash
git clone https://github.com/sensitiky/nest-microservices-boilerplate
cd nest-microservices-boilerplate
bun install
```

### Environment

```bash
cp .env.example .env
# Edit .env with your values
```

Key variables:

```env
PORT=3000
AUTH_TCP_PORT=4001
USER_TCP_PORT=4003
PRODUCT_TCP_PORT=4004
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=microservices
JWT_SECRET=your-secret-here
```

### Development

Start PostgreSQL:

```bash
docker-compose up postgres -d
```

Start each service in a separate terminal:

```bash
bun run start:auth
bun run start:user
bun run start:product
bun run start:gateway
```

The gateway exposes a Swagger UI at `http://localhost:3000/api`.

### Build

```bash
bun run build:all
```

### Docker

```bash
docker-compose up -d
docker-compose logs -f
docker-compose down
```

---

## Testing

Tests use `bun test` with `bun:test` imports. No Jest, no ts-jest.

```bash
# Run all tests
bun test

# Watch mode
bun test --watch

# Coverage
bun test --coverage
```

Test coverage per domain:

| Area | Tests |
|---|---|
| User aggregates & VOs | 23 |
| Product aggregates & VOs | 17 |
| Auth use cases & aggregates | 9 |

---

## CI/CD

GitHub Actions pipeline on every push and PR to `master`:

```
lint → build → test (+ codecov) → docker build & push (GHCR) → semantic-release
```

- Docker images are published to `ghcr.io/<owner>/<repo>` for `linux/amd64` and `linux/arm64`
- Releases are automated via [semantic-release](https://semantic-release.gitbook.io/) based on conventional commits
- The `docker-build` and `release` jobs run only on pushes to `master`

Required secrets: `CODECOV_TOKEN` (optional), `GITHUB_TOKEN` (automatic).

---

## Adding a New Microservice

1. Create `apps/<name>/` following the same four-layer structure
2. Define domain aggregates, value objects, ports, and exceptions — no framework imports
3. Write one use-case class per operation; inject ports via constructor
4. Add ORM entity, mapper, and repository adapter in infrastructure
5. Wire everything in `<name>.module.ts` using `useFactory` for each use case
6. Register in `nest-cli.json`, `docker-compose.yml`, and add TCP client registration in any consuming service
7. Export a snapshot interface from `libs/common/snapshots/`

## Key Design Decisions

**No `@Injectable()` in domain or application** — use cases are plain classes; NestJS never appears above the infrastructure layer.

**Mapper as the only cross-layer bridge** — domain aggregates and ORM entities are completely separate; mappers are the sole place that knows both.

**Symbol-keyed ports** — `Symbol('IUserRepository')` is used as the DI token to avoid string collisions and keep port names stable across refactors.

**`autoLoadEntities: true`** — each service registers its own ORM entities via `TypeOrmModule.forFeature`; the shared kernel contains no TypeORM entities.

**`jwtService.verifyAsync` not `decode`** — the auth guard verifies the token signature before trusting its payload.
