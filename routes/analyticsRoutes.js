const express = require("express");
const Order = require("../models/Order");

const router = express.Router();


// SALES ANALYTICS
router.get("/sales", async (req, res) => {
    try {
        const analytics = await Order.aggregate([
            {
                $unwind: "$items"
            },

            {
                $group: {
                    _id: "$items.productId",

                    productName: {
                        $first: "$items.name"
                    },

                    totalQuantity: {
                        $sum: "$items.quantity"
                    },

                    totalRevenue: {
                        $sum: "$items.subtotal"
                    }
                }
            },

            {
                $sort: {
                    totalRevenue: -1
                }
            }
        ]);

        const summary = await Order.aggregate([
            {
                $group: {
                    _id: null,

                    totalOrders: {
                        $sum: 1
                    },

                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        res.json({
            summary: summary[0] || {
                totalOrders: 0,
                totalRevenue: 0
            },

            products: analytics
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to generate sales analytics"
        });
    }
});


module.exports = router;