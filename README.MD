# igp task

## Project Overview


1. **PostgreSQL Container**:
   - Responsible for data storage and retrieval. 

2. **Migrations Service**:
   - Handles the initial table creation and inserts the default admin. After that, the container is shut down.

3. **Kafka and Zookeeper Service**:
   - Handles message queuing and service coordination for communication across microservices.

4. **Auth Service**:
   - Manages user authentication and acts as the interface between clients, other microservices, and the database. It supports two types of roles:
     - **user**: Users can log in, register, and refresh their tokens.
     - **admin**: Admins can update user roles to admin.
   - Swagger docs are available at [http://localhost:3000/api-docs/v1/](http://localhost:3000/api-docs/v1/).

5. **Promotion Service**:
   - Manages the promotion system, updates the user’s balance, and produces messages on Kafka when new promotions are inserted:
     - **user**: Users can check their info and promotions, and claim them to apply to their balance.
     - **admin**: Admins can create new promotions and assign them to users.
   - Swagger docs are available at [http://localhost:4000/api-docs/v1/](http://localhost:4000/api-docs/v1/).

6. **Notification Service**:
   - Consumes messages from Kafka and sends notifications to the player using Socket.IO. Users can connect to the socket server at [http://localhost:5000?authorization=access-token](http://localhost:5000?authorization=access-token) and listen for the "message" event, where they receive a notification when a promotion is applied.

## Orchestration

The project is orchestrated using Docker Compose, enabling seamless management of containers. The `docker-compose.yml` file defines the configuration and relationships between containers, simplifying deployment and ensuring consistent behavior across environments.

## Project Setup

To start the project, Docker and Docker Compose are required. The `.env` file is committed for convenience, though it would normally not be committed for security reasons.

To start the project, run the following command:


## Flow

1. The user should first log in or register.
2. Once logged in, the user receives an access token.
3. The user connects to the socket server using the access token and listens for notifications.
4. The user can then interact with the promotion service using the access token.

## Project Structure

The project follows an object-oriented and layered approach.

### igp

**`service-name/src/App.ts`**: Application entry point.

**`service-name/src/apiLayer`**
- `./middleware`: Authentication and error middlewares.
- `./validator`: Contains validation methods for client requests, handled in controllers.
- `./controller`: Contains handlers for HTTP requests, used by routers.
- `./router`: Includes Admin and API routers.

**`service-name/src/businessLayer`**
- `./service`: Retrieves data from the repository and applies business logic, used by controllers.
- `./model`: Contains data-only classes that are worked with.
- `./utils`, `./enum`, `./interface`: Houses utility functions, constants, and enums.

**`service-name/src/dataAccessLayer`**
- Database connection, entities, migrations, and repositories.

**`service-name/src/docs`**
- `/swagger.json`: Swagger configuration.
