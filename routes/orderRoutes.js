const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");

const router = express.Router();


// CREATE ORDER
router.post("/", async (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: "Order must contain at least one item"
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const item of items) {

            const { productId, quantity } = item;

            if (!productId || !quantity || quantity < 1) {
                return res.status(400).json({
                    error: "Each item must have productId and valid quantity"
                });
            }

            const product = await Product.findOneAndUpdate(
                {
                    _id: productId,
                    $expr: {
                        $gte: [
                            "$stock",
                            quantity
                        ]
                    }
                },
                {
                    $inc: {
                        stock: -quantity
                    }
                },
                {
                    new: true
                }
            );

            if (!product) {
                return res.status(400).json({
                    error: `Insufficient stock or product not found: ${productId}`
                });
            }

            const subtotal = product.price * quantity;

            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity,
                subtotal
            });

            totalAmount += subtotal;
        }

        const order = await Order.create({
            items: orderItems,
            totalAmount,
            status: "confirmed"
        });

        res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create order"
        });
    }
});


// GET ALL ORDERS
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 });

        res.json({
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch orders"
        });
    }
});


module.exports = router;