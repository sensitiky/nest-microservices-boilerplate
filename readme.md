# NestJS Microservices Boilerplate

A scalable and modular NestJS microservices architecture using hexagonal architecture principles.

## Architecture Overview

This project follows a microservices architecture with a hexagonal design pattern (also known as ports and adapters). The architecture is structured as follows:

### Hexagonal Architecture (per microservice)

- **Domain Layer**: Contains business logic, entities, and interfaces (ports)

  - Entities: Core business objects
  - Repositories: Interfaces for data access
  - Services: Interfaces for business operations

- **Application Layer**: Implements use cases using domain entities

  - Services: Implements business logic using domain interfaces

- **Infrastructure Layer**: Provides implementations for interfaces defined in the domain layer
  - Controllers: Handles incoming requests
  - Repositories: Implements data access
  - Entities: ORM-specific entity definitions

### Microservices

- **Gateway**: API Gateway that routes requests to appropriate microservices
- **Auth**: Handles authentication and authorization
- **User**: Manages user-related operations
- **Product**: Manages product-related operations

### Shared Libraries

- **Common**: Shared DTOs, entities, and utilities
- **Config**: Configuration modules, database connections, interceptors, etc.

## Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0
- [Node.js](https://nodejs.org/) >= 20.0.0
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (for containerization)

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/sensitiky/nest-microservices-boilerplate
cd nest-microservices-boilerplate

# Install dependencies
bun install
```

### Development

```bash
# Build all packages and applications
bun run build:all

# Start the gateway
cd apps/gateway
bun run start

# Start the auth microservice
cd apps/auth
bun run start

# Start the user microservice
cd apps/user
bun run start

# Start the product microservice
cd apps/product
bun run start
```

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Project Structure

```
nest-microservices/
├── apps/                      # Applications
│   ├── gateway/               # API Gateway
│   ├── auth/                  # Auth Microservice
│   ├── user/                  # User Microservice
│   └── product/               # Product Microservice
│       ├── src/
│       │   ├── domain/        # Domain Layer
│       │   │   ├── entities/  # Domain Entities
│       │   │   ├── repositories/ # Repository Interfaces
│       │   │   └── services/  # Service Interfaces
│       │   ├── application/   # Application Layer
│       │   │   └── services/  # Service Implementations
│       │   ├── infrastructure/ # Infrastructure Layer
│       │   │   ├── controllers/ # Controllers
│       │   │   ├── entities/  # ORM Entities
│       │   │   └── repositories/ # Repository Implementations
│       │   └── product.module.ts # Module Definition
│       ├── main.ts            # Microservice Entry Point
│       ├── package.json       # Microservice Package
│       └── tsconfig.json      # TypeScript Configuration
├── libs/                      # Shared Libraries
│   ├── common/                # Common Library
│   │   ├── dto/               # Data Transfer Objects
│   │   └── entities/          # Shared Entities
│   └── config/                # Configuration Library
│       ├── database/          # Database Configuration
│       ├── guards/            # Auth Guards
│       └── interceptors/      # Interceptors
├── docker-scripts/            # Docker Helper Scripts
├── dockerfile                 # Dockerfile
├── docker-compose.yml         # Docker Compose Configuration
├── package.json               # Root Package
├── tsconfig.json              # Root TypeScript Configuration
└── nest-cli.json              # NestJS CLI Configuration
```

## Adding a New Microservice

1. Create a new directory in the `apps` folder
2. Follow the hexagonal architecture pattern:
   - Create domain, application, and infrastructure layers
   - Define entities, repositories, and services in the domain layer
   - Implement services in the application layer
   - Create controllers, repository implementations, and ORM entities in the infrastructure layer
3. Add the microservice to `nest-cli.json`
4. Add the microservice to `docker-compose.yml`
