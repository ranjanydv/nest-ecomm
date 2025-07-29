# NestJS E-commerce with Hexagonal Architecture

This project is an e-commerce application built with NestJS, demonstrating the principles of **Hexagonal Architecture** (also known as the Ports and Adapters pattern). It separates the core business logic from external concerns like frameworks and databases, leading to a more maintainable, scalable, and testable codebase.

## Core Concepts

The project is structured to isolate the core business logic from the outside world (UI, frameworks, databases).

-   **Core (Domain & Application):** This is the heart of the application, containing the business logic (domain entities, use cases). It is completely independent of any external technologies.
-   **Frameworks (Adapters):** This layer contains the implementation details and connects the core to the outside world.
    -   **Primary Adapters:** These drive the application. In this project, they are the REST API controllers (`/src/frameworks/primary/controllers`).
    -   **Secondary Adapters:** These are driven by the application. They are the implementations of the output ports, such as the TypeORM repositories that interact with the database (`/src/frameworks/secondary`).

## Tech Stack

-   **Framework:** [NestJS](https://nestjs.com/)
-   **ORM:** [TypeORM](https://typeorm.io/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/)

## Getting Started

### Prerequisites

-   Node.js
-   pnpm (or npm/yarn)
-   A running instance of PostgreSQL.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd nest-hex
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file.
    Update the `.env` file with your PostgreSQL database credentials and other environment-specific settings.

4.  **Run Database Migrations (Optional):**
    Apply the database migrations to set up the required tables. Synchronization is set to true by default, which will update the database on server startup
    ```bash
    pnpm run migration:run
    ```

5.  **Seed the Database (Optional):**
    To populate the database with initial data (e.g., user roles, privileges), run the seeder.
    ```bash
    pnpm run seed
    ```

### Running the Application

-   **Development Mode:**
    Starts the application with hot-reloading.
    ```bash
    pnpm run start:dev
    ```

-   **Production Mode:**
    Builds and starts the application for production.
    ```bash
    pnpm run start:prod
    ```

## Available Scripts

-   `pnpm run start`: Starts the application.
-   `pnpm run start:dev`: Starts the application in watch mode for development.
-   `pnpm run build`: Builds the application for production.
-   `pnpm run lint`: Lints and formats the codebase.
-   `pnpm run test`: Runs unit tests.
-   `pnpm run migration:generate <migration-name>`: Creates a new migration file.
-   `pnpm run migration:run`: Applies all pending database migrations.
-   `pnpm run migration:revert`: Reverts the last applied migration.
-   `pnpm run seed`: Seeds the database with initial data.

## Project Structure

The directory structure is organized to reflect the hexagonal architecture principles:

```
src
├── core
│   ├── application (contains application-specific logic and use cases)
│   ├── domain (contains core business entities, value objects, and rules)
│   └── ports (defines the interfaces for inbound and outbound communication)
├── frameworks
│   ├── primary (adapters that drive the application, e.g., controllers, DTOs)
│   └── secondary (adapters driven by the application, e.g., database repositories)
├── infrastructure (contains configuration, database setup, migrations)
└── modules (NestJS modules that wire the dependencies together)
```