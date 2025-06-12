Payroll System Documentation

Table of Contents

1.  Introduction
2.  Software Architecture
    - Overview
    - Key Components
    - Directory Structure
    - Request Lifecycle
    - Authentication & Authorization
    - Error Handling
    - Logging
3.  How-to Guides
    - Setup and Installation
    - Running the Application
    - Running Tests
    - User Authentication
    - Managing Payroll (Admin)
    - Employee Attendance
    - Submitting Overtime (Employee)
    - Submitting Reimbursements (Employee)
    - Generating Payslips
4.  API Reference
    - Common Headers
    - Common Error Responses
    - Check Routes
    - Auth Routes
    - Payroll Routes
    - Attendance Routes
    - Overtime Routes
    - Reimbursement Routes
    - Payslip Routes
    - Users Routes

---

1. Introduction

The Payroll System is a Node.js and Express-based application designed to manage employee payroll, attendance, overtime, reimbursements, and payslip generation. It provides a RESTful API for various operations, secured with JWT authentication and role-based access control.

---

2. Software Architecture

Overview

The application follows a layered architecture, separating concerns into routes, controllers, services, and data access layers. It uses Express.js as the web framework and PostgreSQL as the database.

Key Components

- Server (index.js): The main entry point of the application. It initializes Express, sets up global middlewares (like Helmet for security, JSON body parser), registers all the application routes, and starts the HTTP server.
- Configuration (config.js, .env): Manages application settings such as port, database credentials, JWT secret, etc. It's recommended to use a .env file for sensitive information.
- Routes (src/routes/): Define the API endpoints. Each route file maps HTTP methods and URL paths to specific controller functions. They also chain relevant middlewares (validation, authentication, role checks).
- Controllers (src/controllers/): Handle incoming HTTP requests. They extract data from requests, call service layer functions to perform business logic, and then utilize a shared res.locals.response object to prepare the data that will be sent back by the recordResponse middleware.
- Services (src/services/): Contain the core business logic of the application. They interact with the database (via models or a direct DB layer), perform calculations, and prepare data for the controllers.
- Middlewares (src/middlewares/):
  - Authentication (authMiddleware.js): Verifies JWT tokens (tokenVerification).
  - Role-Based Access Control (roleMiddleware.js - assumed): Checks if the authenticated user has the required role (e.g., isAdmin, isEmployee) to access an endpoint.
  - Validation (validations/, validatorMiddleware.js): Validates incoming request data (body, query, params) using Joi schemas.
  - Request/Response Handling:
    - recordHit: Likely records an incoming request hit.
    - recordRequest: Logs details of the incoming request.
    - recordResponse: Formats and sends the final HTTP response based on res.locals.response populated by controllers.
  - Global Middlewares: helmet for security headers, express.json() and express.urlencoded() for parsing request bodies.
- Database (database/pgsql.js - assumed): Provides functions to interact with the PostgreSQL database (e.g., querySingle, queryMany, execute).
- Utilities (src/utils/):
  - logger.js: Implements application-wide logging using Pino.
  - jwt.js (assumed): Handles JWT token generation (generateToken) and verification (verifyToken).
  - datetime.js: Provides date/time formatting utilities.
  - Other helper functions.

Directory Structure

```
payroll-system/
├── tests/ # Automated tests (unit, integration)
├── database/ # Database connection and query helpers (e.g., pgsql.js)
├── src/
│ ├── controllers/ # Request handlers, interact with services
│ ├── middlewares/ # Custom Express middlewares (auth, validation, logging, roles)
│ │ └── validations/ # Joi validation schemas
│ ├── models/ # (Optional) Database models/schemas if using an ORM or more structured data access
│ ├── routes/ # API route definitions
│ ├── services/ # Business logic layer
│ └── utils/ # Utility functions (logger, JWT, datetime helpers)
├── .env.example # Example environment file
├── config.js # Application configuration loader
├── eslint.config.js # ESLint configuration
├── index.js # Main application entry point
├── package.json # Project dependencies and scripts
└── yarn.lock / package-lock.json # Dependency lock file
```

Request Lifecycle

A typical API request flows through the system as follows:

1.  HTTP Request: Client sends a request to an API endpoint.
2.  Global Middlewares: Request passes through global middlewares like helmet, express.json.
3.  Route Matching: Express matches the request path and method to a defined route in index.js.
4.  Route-Specific Middlewares:
    - recordHit, recordRequest: Log the request.
    - tokenVerification (for protected routes): Authenticates the user using JWT.
    - Role Middleware (e.g., isAdmin, isEmployee): Authorizes the user based on role.
    - Validation Middleware (e.g., validateLogin): Validates request data.
5.  Controller: If all preceding middlewares pass, the corresponding controller function is executed.
    - The controller interacts with one or more Services to perform business logic.
    - It populates res.locals.response with status, success, message, and data.
    - It calls next() to pass control to the recordResponse middleware.
6.  Service Layer: Services handle business operations, potentially interacting with the Database layer.
7.  recordResponse Middleware: This middleware takes the content of res.locals.response and sends the actual HTTP response to the client.
8.  Catch-all Route: If no route matches, the final app.use('/', ...) handler sends a "You shall not pass" message.

Authentication & Authorization

- Authentication: Implemented using JSON Web Tokens (JWT).
  - The /auth/login endpoint, upon successful credential validation, generates a JWT.
  - This token must be included in the Authorization header as a Bearer token for subsequent requests to protected routes (Authorization: Bearer <YOUR_JWT>).
  - The tokenVerification middleware validates this token.
- Authorization: Role-based access control is implemented using middlewares like isAdmin and isEmployee. These middlewares check the role claim within the decoded JWT payload to determine if the user has permission to access a specific resource or perform an action.

Error Handling

- Validation Errors: Joi validation middlewares (e.g., validateLogin) typically send a 400 Bad Request response with error details if validation fails.
- Authentication Errors: tokenVerification middleware sends 401 Unauthorized for missing, malformed, or invalid/expired tokens, and 400 Bad Request for tokens that cause verification errors.
- Authorization Errors: Role middlewares (e.g., isAdmin) would typically send a 403 Forbidden if a user lacks the necessary permissions.
- Controller Logic: Controllers and services handle business logic errors and set appropriate status codes and messages in res.locals.response.
- Global Catch-all: A final middleware app.use('/', ...) in index.js handles requests that don't match any defined routes, sending a generic message with a 200 status (consider changing to 404).
- Server Errors: try...catch blocks in controllers aim to catch unexpected errors, log them, and set a 500 Internal Server Error response.

Logging

- The application uses pino for structured, asynchronous logging, configured in src/utils/logger.js.
- Middlewares like recordRequest and recordResponse are likely used for logging request and response details.
- Errors and important events are logged throughout the application (controllers, services).

---

3. How-to Guides

Setup and Installation

1.  Prerequisites:
    - Node.js (refer to engines in package.json if specified, otherwise latest LTS)
    - Yarn (version 1.22.x as per packageManager field) or NPM
    - PostgreSQL server running and accessible.
2.  Clone Repository:
    git clone <your-repository-url>
    cd payroll-system
3.  Install Dependencies:
    yarn install
    # or
    npm install
4.  Environment Configuration:
    - Create a .env file in the root directory by copying .env.example (if one exists).
    - Update the .env file with your specific configurations:
      - PORT: Port for the application (e.g., 3001)
      - DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT: PostgreSQL connection details.
      - JWT_SECRET: A strong, secret key for signing JWTs.
      - Other necessary environment variables.
    - These variables are loaded by config.js.

Running the Application

- Development (with auto-reload using Nodemon):
  yarn nodemon
  # or
  npm run nodemon
- Production:
  yarn start
  # or
  npm start
  The application will typically be available at http://localhost:PORT (e.g., http://localhost:3001).

Running Tests

- Run all tests:
  yarn test
  # or
  npm test
- Run tests in watch mode:
  yarn test:watch
  # or
  npm run test:watch

User Authentication

- Logging In:
  - Make a POST request to /auth/login.
  - Provide username and password in the request body.
  - On success, the API returns a JWT token. Store this token securely.
  - Include this token in the Authorization header as Bearer <token> for all subsequent requests to protected endpoints.

Managing Payroll (Admin)

- Add Payroll Period:
  - Requires Admin role and a valid JWT.
  - Make a POST request to /payroll/add-period.
  - Provide start_date and end_date in the request body.
- Run Payroll:
  - Requires Admin role and a valid JWT.
  - Make a POST request to /payroll/run-payroll.
  - Provide period_id (the ID of the payroll period to process) in the request body.

Employee Attendance

- Clock-In:
  - Requires Employee role and a valid JWT.
  - Make a POST request to /attendance/check-in.
  - Optionally provide attendance_datetime (YYYY-MM-DD HH:mm:ss) in the request body if clocking in for a specific time; otherwise, the server might use the current time.
- Clock-Out:
  - Requires Employee role and a valid JWT.
  - Make a POST request to /attendance/check-out.
  - Optionally provide attendance_datetime in the request body.

Submitting Overtime (Employee)

- Requires Employee role and a valid JWT.
- Make a POST request to /overtime/submit.
- Provide start_datetime and end_datetime (YYYY-MM-DD HH:mm:ss) for the overtime period in the request body.

Submitting Reimbursements (Employee)

- Requires Employee role and a valid JWT.
- Make a POST request to /reimbursement/submit.
- Provide amount and description for the reimbursement in the request body.

Generating Payslips

- Generate/View Own Payslip (Employee):
  - Requires Employee role and a valid JWT.
  - Make a GET request to /payslip/generate.
  - Provide period_date (e.g., YYYY-MM-DD, representing any day within the desired payslip period) as a query parameter.
  - The response will be a PDF file.
- Generate Payslip Summary (Admin):
  - Requires Admin role and a valid JWT.
  - Make a GET request to /payslip/generate-summary.
  - Provide period_date (e.g., YYYY-MM-DD) as a query parameter.
  - The response will be a PDF file containing a summary.

---

4. API Reference

Common Headers

- Content-Type: application/json (for most POST/PUT requests and JSON responses)
- Authorization: Bearer <YOUR_JWT_TOKEN> (for protected routes)

Common Error Responses

Error responses generally follow this JSON structure:

{
"success": false,
"message": "Descriptive error message"
}

Common status codes:

- 400 Bad Request: Invalid input, validation error.
- 401 Unauthorized: Missing, invalid, or expired token.
- 403 Forbidden: User does not have permission for the action/resource.
- 404 Not Found: Resource not found.
- 500 Internal Server Error: Unexpected server-side error.

---

Check Routes

Base Path: /check

GET /check/health

- Description: Checks the health of the application.
- Authentication: None.
- Response (200 OK):
  - Content-Type: text/plain
  - Body: OK

GET /check/db-connection

- Description: Checks the database connection status.
- Authentication: None.
- Response (200 OK - Connection Successful):
  - Content-Type: text/plain
  - Body: Database connection successful
- Response (500 Internal Server Error - Connection Failed):
  - Content-Type: text/plain
  - Body: Database connection failed or Database connection failed: <error_message>

---

Auth Routes

Base Path: /auth

POST /auth/login

- Description: Authenticates a user and returns a JWT.
- Authentication: None.
- Request Body:
  {
  "username": "string (min:3, max:30, required)",
  "password": "string (min:8, max:30, required)"
  }
- Response (200 OK - Login Successful):
  {
  "success": true,
  "message": "Login successful",
  "data": {
  "token": "string (JWT)"
  // Potentially other user details
  }
  }
- Response (400 Bad Request - Validation Error):
  {
  "success": false,
  "message": "Validation error details (e.g., \"password\" is required)"
  }
- Response (401 Unauthorized - Invalid Credentials):
  {
  "success": false,
  "message": "Invalid username or password"
  }

---

Payroll Routes

Base Path: /payroll
Authentication: Required (Bearer Token)
Role: Admin

POST /payroll/add-period

- Description: Adds a new payroll period.
- Request Body:
  {
  "start_date": "string (YYYY-MM-DD, required)",
  "end_date": "string (YYYY-MM-DD, required)"
  }
- Response (e.g., 201 Created or 200 OK):
  {
  "success": true,
  "message": "Payroll period added successfully"
  // "data": { ... } // Optional: details of the created period
  }

POST /payroll/run-payroll

- Description: Processes payroll for a specified period.
- Request Body:
  {
  "period_id": "integer/string (ID of the payroll period, required)"
  }
- Response (e.g., 200 OK):
  {
  "success": true,
  "message": "Payroll processed successfully for period <period_id>"
  // "data": { ... } // Optional: summary of the payroll run
  }

---

Attendance Routes

Base Path: /attendance
Authentication: Required (Bearer Token)
Role: Employee

POST /attendance/check-in

- Description: Records an employee's check-in time.
- Request Body:
  {
  "attendance_datetime": "string (YYYY-MM-DD HH:mm:ss, optional)"
  // "notes": "string (optional)" // Based on test file, but not in controller
  }
- Response (e.g., 201 Created or 200 OK):
  {
  "success": true,
  "message": "Checked in successfully"
  // "data": { ... } // Optional: details of the attendance record
  }

POST /attendance/check-out

- Description: Records an employee's check-out time.
- Request Body:
  {
  "attendance_datetime": "string (YYYY-MM-DD HH:mm:ss, optional)"
  }
- Response (e.g., 200 OK):
  {
  "success": true,
  "message": "Checked out successfully"
  // "data": { ... } // Optional: details of the attendance record
  }

---

Overtime Routes

Base Path: /overtime
Authentication: Required (Bearer Token)
Role: Employee

POST /overtime/submit

- Description: Submits an overtime request for an employee.
- Request Body:
  {
  "start_datetime": "string (YYYY-MM-DD HH:mm:ss, required)",
  "end_datetime": "string (YYYY-MM-DD HH:mm:ss, required)"
  // "reason": "string (optional)" // Based on test file, but not in controller
  }
- Response (e.g., 201 Created or 200 OK):
  {
  "success": true,
  "message": "Overtime request submitted successfully"
  // "data": { ... } // Optional: details of the submitted overtime
  }

---

Reimbursement Routes

Base Path: /reimbursement
Authentication: Required (Bearer Token)
Role: Employee

POST /reimbursement/submit

- Description: Submits a reimbursement request for an employee.
- Request Body:
  {
  "amount": "number (required)",
  "description": "string (required)"
  // "date": "string (YYYY-MM-DD, optional)" // Based on test file, but not in controller
  // "type": "string (optional)" // Based on test file, but not in controller
  }
- Response (e.g., 201 Created or 200 OK):
  {
  "success": true,
  "message": "Reimbursement request submitted successfully"
  // "data": { ... } // Optional: details of the submitted reimbursement
  }

---

Payslip Routes

Base Path: /payslip
Authentication: Required (Bearer Token)

GET /payslip/generate

- Description: Generates and returns an employee's payslip as a PDF.
- Role: Employee
- Query Parameters:
  - period_date: string (YYYY-MM-DD, required). Any date within the desired payslip period.
- Response (200 OK - Success):
  - Content-Type: application/pdf
  - Content-Disposition: attachment; filename="Payslip_YYYY-MM-DD_HHmmss.pdf"
  - Body: Binary PDF data.
- Response (e.g., 404 Not Found - Payslip data not found):
  {
  "success": false,
  "message": "Payslip data not found for the period."
  }

GET /payslip/generate-summary

- Description: Generates and returns a payslip summary (likely for all employees for a period) as a PDF.
- Role: Admin
- Query Parameters:
  - period_date: string (YYYY-MM-DD, required). Any date within the desired summary period.
- Response (200 OK - Success):
  - Content-Type: application/pdf
  - Content-Disposition: attachment; filename="Payslip_YYYY-MM-DD_HHmmss.pdf" (Filename might be different for summary)
  - Body: Binary PDF data.
- Response (e.g., 404 Not Found - Data not found):
  {
  "success": false,
  "message": "Payslip summary data not found for the period."
  }

---

Users Routes

Base Path: /users
Authentication: Required (Bearer Token)

GET /users/employee

- Description: Retrieves employee details by username.
  (Note: This route's implementation in src/routes/users.js directly handles logic and response, differing from the controller/service pattern of other routes.)
- Query Parameters:
  - username: string (required). The username of the employee to retrieve.
- Response (200 OK - Employee Found):
  {
  // Employee object structure from getEmployeeByUsername
  "id": "...",
  "username": "...",
  "email": "...",
  // ... other employee fields
  }
- Response (404 Not Found - Employee Not Found):
  {
  "error": "Employee not found"
  }
- Response (500 Internal Server Error):
  {
  "error": "Internal Server Error"
  }

---
