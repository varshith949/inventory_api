const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const productRoutes = require("../routes/productRoutes");
const orderRoutes = require("../routes/orderRoutes");
const analyticsRoutes = require("../routes/analyticsRoutes");
const app = express();


// Connect MongoDB
connectDB();


// Middleware
app.use(express.json());


// Home
app.get("/", (req, res) => {
    res.json({
        message: "Inventory & Order Management API is running!"
    });
});


// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "healthy"
    });
});


// Product routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/analytics", analyticsRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});