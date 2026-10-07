const express = require("express");
const Product = require("../models/Product");

const router = express.Router();


// CREATE PRODUCT
router.post("/", async (req, res) => {
    try {
        const { name, category, price, stock } = req.body;

        const product = await Product.create({
            name,
            category,
            price,
            stock
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create product"
        });
    }
});


// GET ALL PRODUCTS
router.get("/", async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        // -------------------------
        // FILTER
        // -------------------------

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }


        // -------------------------
        // SORT
        // -------------------------

        let sortOption = {};

        if (sort === "price") {
            sortOption.price = 1;
        }

        if (sort === "-price") {
            sortOption.price = -1;
        }

        if (sort === "name") {
            sortOption.name = 1;
        }

        if (sort === "-name") {
            sortOption.name = -1;
        }


        // -------------------------
        // PAGINATION
        // -------------------------

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.min(
            Math.max(Number(limit), 1),
            100
        );

        const skip = (pageNumber - 1) * limitNumber;


        // -------------------------
        // DATABASE QUERY
        // -------------------------

        const products = await Product
            .find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

        const totalProducts = await Product.countDocuments(filter);

        const totalPages = Math.ceil(
            totalProducts / limitNumber
        );


        // -------------------------
        // RESPONSE
        // -------------------------

        res.json({
            page: pageNumber,
            limit: limitNumber,
            totalProducts,
            totalPages,
            products
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch products"
        });
    }
});
// UPDATE INVENTORY
// UPDATE INVENTORY ATOMICALLY
router.patch("/:id/stock", async (req, res) => {
    try {
        const { quantity } = req.body;

        if (typeof quantity !== "number") {
            return res.status(400).json({
                error: "quantity must be a number"
            });
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                $expr: {
                    $gte: [
                        { $add: ["$stock", quantity] },
                        0
                    ]
                }
            },
            {
                $inc: {
                    stock: quantity
                }
            },
            {
                new: true
            }
        );

        if (!product) {
            return res.status(400).json({
                error: "Product not found or insufficient stock"
            });
        }

        res.json({
            message: "Stock updated successfully",
            product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to update stock"
        });
    }
});


module.exports = router;