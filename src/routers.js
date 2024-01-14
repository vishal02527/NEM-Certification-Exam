const express = require("express");
let EndPoints = require("../EndPoints/EndPoints")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const GamerModel = require("../model/gamer");
const SellerModel = require("../model/seller");
const ProductModel = require("../model/product");

const app = express();
app.use(express.json());

/////CORS
const cors = require("cors");
const e = require("express");
const gamer = require("../model/gamer");
var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "*",
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect("mongodb+srv://vishal:AA3gY1ymj0IZiLBd@cluster0.mcm7hby.mongodb.net/NEM-database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", (_) => {
    console.log("Database connected:", "mongodb+srv://vishal:AA3gY1ymj0IZiLBd@cluster0.mcm7hby.mongodb.net/NEM-database");
});
db.on("error", (err) => {
    console.error("connection error:", err);
});

const gamerCollection = db.collection("gamers");
const sellerCollection = db.collection("sellers");
const productCollection = db.collection("products");



//Register 
app.post(EndPoints.USER, (req, res) => {

    const { username, email, password, firstName, lastName, contactNumber, userType } = req.body

    if (!email) {
        return res.status(400).json({ error: "Please provide email" });
    }
    else if (!username) {
        return res.status(400).json({ error: "Please provide username" });
    }
    else if (!firstName) {
        return res.status(400).json({ error: "Please provide firstName" });
    }
    else if (!lastName) {
        return res.status(400).json({ error: "Please provide lastName" });
    }
    else if (!contactNumber) {
        return res.status(400).json({ error: "Please provide contactNumber" });
    }
    else if (!password) {
        return res.status(400).json({ error: "Please provide password" });
    }
    else if (!userType) {
        return res.status(400).json({ error: "Please provide userType" });
    }
    else {

        userType == "Gamer"
            ? gamerCollection
                .insertOne(
                    new GamerModel({
                        _id: (new Date().getTime()).toString(),
                        username: username,
                        email: email,
                        password: password,
                        firstName: firstName,
                        lastName: lastName,
                        contactNumber: contactNumber,
                        userType: userType,
                        wishlist: [],
                        cart: []
                    })
                )
                .then((result) => {
                    gamerCollection.findOne({ _id: result.insertedId })
                        .then((response) => {
                            res.send(response)
                        })
                        .catch((err) => {
                            return err;
                        })

                })
                .catch((err) => {
                    res.send(err);
                })
            : email.split("@")[1] == "admin.com"
                ? sellerCollection
                    .insertOne(
                        new SellerModel({
                            _id: (new Date().getTime()).toString(),
                            username: username,
                            email: email,
                            password: password,
                            firstName: firstName,
                            lastName: lastName,
                            contactNumber: contactNumber,
                            userType: userType
                        })
                    )
                    .then((result) => {
                        sellerCollection.findOne({ _id: result.insertedId })
                            .then((response) => {
                                res.send(response)
                            })
                            .catch((err) => {
                                return err;
                            })
                    })
                    .catch((err) => {
                        res.send(err);
                    })
                : res.status(400).json({ error: "Sellers can only register with an email address with the admin domain" });
    }
})

//Login
app.post(EndPoints.LOGIN, (req, res) => {
    const { username, password } = req.body;

    gamerCollection.findOne({ username: username })
        .then((response) => {
            if (response == null) {
                sellerCollection.findOne({ username: username })
                    .then((result) => {
                        if (result == null) {
                            res.status(400).json({ error: "Invalid Login Credentials" });
                        }
                        else {
                            if (result.password == password) {
                                res.send({
                                    userId: result._id,
                                    message: "Login successful"
                                })
                            }
                            else {
                                res.status(400).json({ error: "Invalid Login Credentials" });
                            }
                        }
                    })
            }
            else {
                if (response.password == password) {
                    res.send({
                        userId: response._id,
                        message: "Login successful"
                    })
                }
                else {
                    res.status(400).json({ error: "Invalid Login Credentials" });
                }
            }
        })
})

//View user details
app.get(EndPoints.USER + ":username", (req, res) => {
    const username = req.params.username;
    gamerCollection.findOne({ username: username })
        .then((user) => {
            if (!user) {
                res.status(404).json({ error: "User not found" });
            } else {
                res.json(user);
            }
        })
        .catch((err) => {
            res.status(500).json({ error: "Internal server error", details: err.message });
        });
});


//Update user details
app.put(EndPoints.USER, (req, res) => {
    const { userID, username, email, password, firstName, lastName, contactNumber, userType } = req.body;

    // Assuming the "userID" uniquely identifies the user.
    // You may use the "_id" field if it's the identifier.

    gamerCollection.updateOne(
        { _id: userID },
        {
            $set: {
                username: username,
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                contactNumber: contactNumber,
                userType: userType,
            },
        }
    )
    .then(() => {
        res.json({ message: "User details updated successfully" });
    })
    .catch((err) => {
        res.status(500).json({ error: "Internal server error", details: err.message });
    });
});


//Create product
app.post(EndPoints.PRODUCT, (req, res) => {
    const { title, thumbnailURL, sellerUsername, unitsAvailable, productType, productImages, rentalPricePerWeek, rentalPricePerMonth } = req.body;

    const newProduct = new ProductModel({
        title: title,
        thumbnailURL: thumbnailURL,
        sellerUsername: sellerUsername,
        unitsAvailable: unitsAvailable,
        productType: productType,
        productImages: productImages,
        rentalPricePerWeek: rentalPricePerWeek,
        rentalPricePerMonth: rentalPricePerMonth,
    });

    newProduct.save()
        .then((product) => {
            res.json(product);
        })
        .catch((err) => {
            res.status(500).json({ error: "Failed to create product" });
        });
});
app.get(EndPoints.PRODUCT, (req, res) => {
    ProductModel.find()
        .then((products) => {
            res.json(products);
        })
        .catch((err) => {
            res.status(500).json({ error: "Internal server error", details: err.message });
        });
});
app.get(EndPoints.PRODUCT + ":id", (req, res) => {
    const productID = req.params.id;
    ProductModel.findById(productID)
        .then((product) => {
            if (!product) {
                res.status(404).json({ error: "Product not found" });
            } else {
                res.json(product);
            }
        })
        .catch((err) => {
            res.status(500).json({ error: "Internal server error", details: err.message });
        });
});


//Homepage API
app.get(EndPoints.PRODUCT, async (req, res) => {
    try {
        const products = await ProductModel.find({}, '-_id productID title thumbnailURL sellerUsername unitsAvailable productType rentalPricePerWeek rentalPricePerMonth');
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

//Product details
app.get(EndPoints.PRODUCT + ":id", (req, res) => {
    const productID = req.params.id;

    ProductModel.findById(productID)
        .then((product) => {
            if (!product) {
                res.status(404).json({ error: "Product not found" });
            } else {
                res.json(product);
            }
        })
        .catch((err) => {
            res.status(500).json({ error: "Internal server error", details: err.message });
        });
});
//Update product
app.put(EndPoints.PRODUCT, (req, res) => {
    const { productID, title, thumbnailURL, sellerUsername, unitsAvailable, productType, productImages, rentalPricePerWeek, rentalPricePerMonth } = req.body;

    ProductModel.findByIdAndUpdate(
        productID,
        {
            $set: {
                title: title,
                thumbnailURL: thumbnailURL,
                sellerUsername: sellerUsername,
                unitsAvailable: unitsAvailable,
                productType: productType,
                productImages: productImages,
                rentalPricePerWeek: rentalPricePerWeek,
                rentalPricePerMonth: rentalPricePerMonth,
            },
        },
        { new: true }
    )
    .then((updatedProduct) => {
        if (!updatedProduct) {
            res.status(404).json({ error: "Product not found" });
        } else {
            res.json(updatedProduct);
        }
    })
    .catch((err) => {
        res.status(500).json({ error: "Internal server error", details: err.message });
    });
});


//save/remove from wishlist
app.put(EndPoints.WISHLIST, (req, res) => {
    const { userID, productID } = req.body;

    // Assuming "wishlist" is an array field in the user model that stores product IDs.
    // You can customize this based on your actual data model.

    // Add the productID to the user's wishlist
    gamerCollection.updateOne(
        { _id: userID },
        { $addToSet: { wishlist: productID } }
    )
    .then(() => {
        res.json({ message: "Product added to wishlist" });
    })
    .catch((err) => {
        res.status(500).json({ error: "Internal server error", details: err.message });
    });
});


app.put(EndPoints.CART, (req, res) => {
    const { userID, productID, count, bookingStartDate, bookingEndDate } = req.body;

    // Assuming "cart" is an array field in the user model that stores cart items.
    // Each cart item may include productID, count, bookingStartDate, and bookingEndDate.
    // You can customize this based on your actual data model.

    // Add or update the cart item
    const cartItem = { productID, count, bookingStartDate, bookingEndDate };
    gamerCollection.updateOne(
        { _id: userID, "cart.productID": productID },
        { $set: { "cart.$": cartItem } },
        { upsert: true }
    )
    .then(() => {
        res.json({ message: "Cart updated successfully" });
    })
    .catch((err) => {
        res.status(500).json({ error: "Internal server error", details: err.message });
    });
});


//place order
app.put(EndPoints.ORDER, (req, res) => {
    const { userID } = req.body;

    // Assuming "cart" is an array field in the user model that stores cart items.
    // Each cart item includes productID, count, bookingStartDate, and bookingEndDate.
    // You can customize this based on your actual data model.

    // Clear the user's cart after placing the order
    gamerCollection.updateOne(
        { _id: userID },
        { $set: { cart: [] } }
    )
    .then(() => {
        res.json({ message: "Order placed successfully" });
    })
    .catch((err) => {
        res.status(500).json({ error: "Internal server error", details: err.message });
    });
});


exports.app = app;
exports.gamerCollection = gamerCollection;
exports.sellerCollection = sellerCollection;
exports.productCollection = productCollection;