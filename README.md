# Inventory & Order Management API

A backend API built with Node.js, Express.js, MongoDB and Mongoose.

## Features

- Product management
- Product filtering
- Price filtering
- Sorting
- Pagination
- MongoDB compound indexes
- Inventory management
- Atomic stock updates
- Order management
- Stock deduction during orders
- MongoDB aggregation pipeline
- Sales analytics
- Race-condition protection

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript
- Postman

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create product |
| GET | `/products` | Get products |
| PATCH | `/products/:id/stock` | Update stock |
| POST | `/orders` | Create order |
| GET | `/orders` | Get all orders |
| GET | `/analytics/sales` | Sales analytics |

## Run Locally

Install dependencies:

```bash
npm install