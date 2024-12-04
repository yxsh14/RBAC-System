# Role-Based Access Control System

This is a Node.js-based backend application implementing a Role-Based Access Control (RBAC) system. The system manages three roles: `user`, `moderator`, and `admin`, each with distinct privileges and functionalities.

## Features

### Authentication
- **Register**: Users can register themselves in the system.
- **Login**: Authenticate with valid credentials.
- **Logout**: Logout from the system (JWT authentication required).

### Roles and Permissions
1. **Admin**:
   - Create blogs.
   - Edit blogs.
   - Delete blogs.
   - View all user requests to become moderators.
   - Approve or reject moderator requests from users.
   - View the list of all moderators.

2. **Moderator**:
   - Edit blogs created by the associated admin.

3. **User**:
   - Send a request to the admin to become a moderator.
   - View all blogs.

## API Routes

### Authentication Routes
| Method | Endpoint        | Description                        |
|--------|-----------------|------------------------------------|
| POST   | `/api/auth/register` | Register a new user.              |
| POST   | `/api/auth/login`    | Login with email and password.    |
| POST   | `/api/auth/logout`   | Logout from the system.           |

### Admin Routes
| Method | Endpoint                | Description                                    |
|--------|-------------------------|------------------------------------------------|
| POST   | `/api/admin/create`     | Create a new blog.                             |
| DELETE | `/api/admin/delete/:id` | Delete a blog by ID.                           |
| PATCH  | `/api/admin/:requestId` | Manage user requests (approve/reject).         |
| GET    | `/api/admin/moderators` | Get a list of all moderators.                  |
| GET    | `/api/admin/requests`   | Get all requests to become a moderator.        |
| GET    | `/api/admin/blogs`      | Get all blogs created by the admin.            |

### User Routes
| Method | Endpoint                  | Description                                    |
|--------|---------------------------|------------------------------------------------|
| PATCH  | `/api/edit/:blogId`       | Edit a blog (Admin/Moderator only).            |
| POST   | `/api/user/access`        | Send a request to become a moderator.          |
| GET    | `/api/user/blogs`         | View all blogs (Admin/Moderator/User).         |

## Project Setup

### Prerequisites
- Node.js
- MongoDB
- A `.env` file for environment variables.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>

2. Install dependencies:
    ```bash
    npm install 

3. Configure environment variables:
Create a .env file in the root directory based on .sample.env.


4. Start the application:
    ```bash
    npm start

### Technologies Used: 

- Node.js: Backend runtime environment.
- Express.js: Web framework for building APIs.
- MongoDB: NoSQL database for storing user, role, and blog data.
- JWT: For secure authentication and role-based access.
### How It Works
- Users can register, log in, logout.
- Logged-in users can request to become moderators.
- Admins can view and manage these requests, promoting - users to moderators if approved.
- Moderators can edit blogs created by the admin they're associated with.
- Admins have full control over blogs and user requests.