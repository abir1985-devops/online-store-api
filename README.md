# Online Store API

A production-ready REST API for an online store, built with **Node.js**, **Express**, **MongoDB**, and **Docker**.  
This project demonstrates backend development skills together with practical DevOps practices such as containerization and CI.

---

## 🌐 Live Demo

> 🚧 **Live demo ...........**  
> The API will be deployed to an online Linux server using Docker Compose.  
> This section will be updated with a public URL.

Planned endpoints:
- Swagger UI: `/api/docs`
- Health check: `/health`

---

## 🚀 Features

- JWT authentication
- Role-based access control (user / admin)
- Products, Orders, and Users APIs
- Pagination and filtering
- Centralized error handling
- Swagger / OpenAPI documentation
- Automated tests with Jest
- CI with GitHub Actions
- Docker & Docker Compose (API + MongoDB)
- Health check endpoint for deployments

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **Testing:** Jest, Supertest
- **API Docs:** Swagger (OpenAPI)
- **DevOps:** Docker, Docker Compose, GitHub Actions

---

## 📦 Project Structure

```
.
├── app.js
├── server.js
├── config/
├── controllers/
├── routes/
├── models/
├── utils/
├── tests/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
└── README.md
```

---

## ▶️ Run Locally with Docker (Recommended)

### Prerequisites
- Docker
- Docker Compose

### Steps

```bash
git clone https://github.com/abir1985-devops/online-store-api.git
cd online-store-api

cp .env.example .env
docker compose up --build
```

---

## 🌍 Access the API

Once running, the API is available at:

- **Base URL:** http://localhost:3000  
- **Swagger UI:** http://localhost:3000/api/docs  
- **Health Check:** http://localhost:3000/health  

---

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`.

Example:

```env
PORT=3000
DATABASE=mongodb://mongo:27017/online-store
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

> MongoDB runs inside Docker and is configured via `docker-compose.yml`.  
> No local MongoDB installation is required.

---

## 🧪 Run Tests

```bash
npm install
npm test
```

Tests are also executed automatically in **GitHub Actions** on every push.

---

## 📖 API Documentation

Swagger UI:
```
/api/docs
```

Swagger JSON:
```
/api/docs.json
```

---

## 🩺 Health Check

```http
GET /health
```

Response:
```json
{
  "status": "ok"
}
```

This endpoint is used for container health checks and production deployments.

---

## 🧠 Why This Project

This project was built to demonstrate:

- Clean REST API design
- Secure authentication using JWT
- Error handling and validation
- Automated testing
- Containerization with Docker
- Running backend services in a production-like environment

---

## 🚀 Deployment

The application is designed to be deployed on any Linux server that supports Docker.

Typical deployment flow:
1. Provision a Linux VPS
2. Install Docker & Docker Compose
3. Clone this repository
4. Run `docker compose up -d`

A live deployment ............

---

## 📌 Notes

- Environment variables are not committed to the repository.
- The application can run anywhere Docker is available.
- The same Docker Compose setup is used for local development and production.
