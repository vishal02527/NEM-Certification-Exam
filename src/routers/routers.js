const express = require("express");
let EndPoints = require("../EndPoints/EndPoints")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const GamerModel = require("../model/gamer");
const SellerModel = require("../model/seller");
const ProductModel = require("../model/product");

const app = express();
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));

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

mongoose.connect("mongodb://localhost:27017/game-rental", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", (_) => {
    console.log("Database connected:", "mongodb://localhost:27017/game-rental");
});
db.on("error", (err) => {
    console.error("connection error:", err);
});

const gamerCollection = db.collection("gamers");
const sellerCollection = db.collection("sellers");
const productCollection = db.collection("products");

//Default Data

gamerCollection.countDocuments(function (err, count) {
    if (count === 0) {
        gamerCollection.insertMany([{
            _id: "12345",
            email: "cgreig0@friendfeed.com",
            username: "cgreig",
            firstName: "Constantina",
            lastName: "Greig",
            contactNumber: "9423797555",
            password: "sample1",
            userType: "Gamer",
            wishlist: [],
            cart: []
        }, {
            _id: "12346",
            email: "apaddle1@stumbleupon.com",
            username: "apaddle",
            firstName: "Adriano",
            lastName: "Paddle",
            contactNumber: "4665883654",
            password: "sample2",
            userType: "Gamer",
            wishlist: [],
            cart: []
        }, {
            _id: "12347",
            email: "glindeboom2@dedecms.com",
            username: "glindeboom",
            firstName: "Gus",
            lastName: "Lindeboom",
            contactNumber: "2535412427",
            password: "sample3",
            userType: "Gamer",
            wishlist: [],
            cart: []
        }])
    }
});

sellerCollection.countDocuments(function (err, count) {
    if (count === 0) {
        sellerCollection.insertMany([{
            _id: "12348",
            email: "rbenford0@edyoda.com",
            username: "rben",
            firstName: "Raimundo",
            lastName: "Benford",
            contactNumber: "6084454758",
            password: "sample4",
            userType: "Seller"
        }, {
            _id: "12349",
            email: "seisikovitsh1@edyoda.com",
            username: "seisi",
            firstName: "Scarlet",
            lastName: "Eisikovitsh",
            contactNumber: "9661971495",
            password: "sample5",
            userType: "Seller"
        }, {
            _id: "12340",
            email: "lpoulsom2@edyoda.com",
            username: "leon",
            firstName: "Leonhard",
            lastName: "Poulsom",
            contactNumber: "3178567125",
            password: "sample6",
            userType: "Seller"
        }])
    }
});

productCollection.countDocuments(function (err, count) {
    if (count === 0) {
        productCollection.insertMany([{
            _id: "12341",
            title: "Call of Duty",
            thumbnailURL: "https://gamerrentals.in/wp-content/uploads/2020/10/51PvGjV6D5L._SL1000_.jpg",
            sellerUsername: "seisi",
            unitsAvailable: 10,
            productType: "game",
            productImages: [],
            rentalPricePerWeek: 200,
            rentalPricePerMonth: 700
        }, {
            _id: "12342",
            title: "Microsoft Xbox",
            thumbnailURL: "https://gamerrentals.in/wp-content/uploads/2020/09/ddb84cea-92b0-4f66-8369-31865df14fe5.jpg",
            sellerUsername: "leon",
            unitsAvailable: 10,
            productType: "console",
            productImages: [],
            rentalPricePerWeek: 300,
            rentalPricePerMonth: 1000
        }, {
            _id: "12343",
            title: "PS4 Dualshock",
            thumbnailURL: "https://gamerrentals.in/wp-content/uploads/2020/09/31BUiVHy6L.jpg",
            sellerUsername: "rben",
            unitsAvailable: 10,
            productType: "controller",
            productImages: [],
            rentalPricePerWeek: 250,
            rentalPricePerMonth: 900
        }])
    }
});


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
        .then((response) => {
            if (response == null) {
                sellerCollection.findOne({ username: username })
                    .then((result) => {
                        if (result == null) {
                            res.status(400).json({ error: "No user found" });
                        }
                        else {
                            res.send(result)
                        }
                    })
            }
            else {
                res.send(response)
            }
        })
})

//Update user details
app.put(EndPoints.USER, (req, res) => {

    const { userID, username, email, password, firstName, lastName, contactNumber, userType } = req.body

    userType == "Gamer"
        ? gamerCollection
            .findOneAndUpdate(
                {
                    _id: userID, // search query
                },
                {
                    $set: {
                        username: username,
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        contactNumber: contactNumber,
                        password: password,
                        userType: userType
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            )
            .then((response) => {
                if (response.value == null)
                    res.status(400).json({ error: "No user found" });
                else {
                    gamerCollection.findOne({ _id: userID })
                        .then((result) => {
                            res.send(result)
                        })
                }
            })
            .catch((err) => {
                res.send(err)
            })
        : sellerCollection
            .findOneAndUpdate(
                {
                    _id: userID, // search query
                },
                {
                    $set: {
                        username: username,
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        contactNumber: contactNumber,
                        password: password,
                        userType: userType
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            )
            .then((response) => {
                if (response.value == null)
                    res.status(400).json({ error: "No user found" });
                else {
                    sellerCollection.findOne({ _id: userID })
                        .then((result) => {
                            res.send(result)
                        })
                }
            })
            .catch((err) => {
                res.send(err)
            })
})

//Create product
app.post(EndPoints.PRODUCT, (req, res) => {

    const { title, thumbnailURL, sellerUsername, unitsAvailable, productType, productImages, rentalPricePerWeek, rentalPricePerMonth } = req.body

    if (!title) {
        return res.status(400).json({ error: "Please provide title" });
    }
    else if (!thumbnailURL) {
        return res.status(400).json({ error: "Please provide thumbnailURL" });
    }
    else if (!sellerUsername) {
        return res.status(400).json({ error: "Please provide sellerUsername" });
    }
    else if (!unitsAvailable) {
        return res.status(400).json({ error: "Please provide unitsAvailable" });
    }
    else if (!productType) {
        return res.status(400).json({ error: "Please provide productType" });
    }
    else if (!productImages) {
        return res.status(400).json({ error: "Please provide productImages" });
    }
    else if (!rentalPricePerWeek) {
        return res.status(400).json({ error: "Please provide rentalPricePerWeek" });
    }
    else if (!rentalPricePerMonth) {
        return res.status(400).json({ error: "Please provide rentalPricePerMonth" });
    }
    else {
        productCollection
            .insertOne(
                new ProductModel({
                    _id: (new Date().getTime()).toString(),
                    title: title,
                    thumbnailURL: thumbnailURL,
                    sellerUsername: sellerUsername,
                    unitsAvailable: unitsAvailable,
                    productType: productType,
                    productImages: productImages,
                    rentalPricePerWeek: rentalPricePerWeek,
                    rentalPricePerMonth: rentalPricePerMonth
                })
            )
            .then((result) => {
                productCollection.findOne({ _id: result.insertedId })
                    .then((response) => {
                        res.send(response)
                    })
                    .catch((err) => {
                        res.send(err);
                    })

            })
            .catch((err) => {
                res.send(err);
            })
    }
})

//Homepage API
app.get(EndPoints.PRODUCT, (req, res) => {

    productCollection.find().toArray()
        .then((response) => {
            res.send(response)
        })
        .catch((err) => {
            res.send(err);
        })
})

//Product details
app.get(EndPoints.PRODUCT + ":id", (req, res) => {
    const productID = req.params.id;
    productCollection.findOne({ _id: productID })
        .then((response) => {
            res.send(response)
        })
        .catch((err) => {
            res.send(err);
        })

})

//Update product
app.put(EndPoints.PRODUCT, (req, res) => {
    const { productID, title, thumbnailURL, sellerUsername, unitsAvailable, productType, productImages, rentalPricePerWeek, rentalPricePerMonth } = req.body

    productCollection
        .findOneAndUpdate(
            {
                _id: productID, // search query
            },
            {
                $set: {
                    title: title,
                    thumbnailURL: thumbnailURL,
                    sellerUsername: sellerUsername,
                    unitsAvailable: unitsAvailable,
                    productType: productType,
                    productImages: productImages,
                    rentalPricePerWeek: rentalPricePerWeek,
                    rentalPricePerMonth: rentalPricePerMonth
                },
            },
            {
                new: true,
                runValidators: true,
            }
        )
        .then((response) => {
            if (response.value == null)
                res.status(400).json({ error: "Product not found" });
            else {
                productCollection.findOne({ _id: productID })
                    .then((result) => {
                        res.send(result)
                    })
            }
        })
        .catch((err) => {
            res.send(err)
        })
})

//save/remove from wishlist
app.put(EndPoints.WISHLIST, (req, res) => {

    const { userID, productID } = req.body;

    productCollection.findOne({ _id: productID })
        .then((response) => {
            gamerCollection.findOne({ _id: userID })
                .then((result) => {
                    let wishlist = result.wishlist;
                    let found = wishlist.some((product) => product["productID"] === productID)

                    if (found) {
                        let index = wishlist.findIndex((product) => product["productID"] === productID);
                        if (index !== -1) {
                            wishlist.splice(index, 1);
                        }
                    } else {
                        let product = {
                            productID: response._id,
                            title: response.title,
                            thumbnailURL: response.thumbnailURL,
                            sellerUsername: response.sellerUsername,
                            unitsAvailable: response.unitsAvailable,
                            productType: response.productType,
                            rentalStartingFromPrice: response.rentalPricePerWeek
                        }
                        wishlist.push(product);
                    }

                    gamerCollection.findOneAndUpdate(
                        {
                            _id: userID, // search query
                        },
                        {
                            $set: {
                                wishlist: wishlist
                            },
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    )
                        .then(() => {
                            gamerCollection.findOne({ _id: userID })
                                .then((result) => {
                                    res.send(result.wishlist);
                                })
                                .catch((err) => {
                                    res.send(err)
                                })
                        })
                        .catch((err) => {
                            res.send(err)
                        })
                })
                .catch((err) => {
                    res.send(err)
                })
        })
        .catch((err) => {
            res.send(err)
        })
})

//add/remove from cart
app.put(EndPoints.CART, (req, res) => {

    const { userID, productID, count, bookingStartDate, bookingEndDate } = req.body

    productCollection.findOne({ _id: productID })
        .then((response) => {
            gamerCollection.findOne({ _id: userID })
                .then((result) => {
                    let cart = result.cart;
                    let wishlist = result.wishlist;

                    let found = cart.some((product) => product["productID"] === productID)
                    if (found) {
                        let index = cart.findIndex((product) => product["productID"] === productID);
                        if (index !== -1) {
                            cart.splice(index, 1);
                            let product = {
                                productID: response._id,
                                title: response.title,
                                thumbnailURL: response.thumbnailURL,
                                sellerUsername: response.sellerUsername,
                                unitsAvailable: response.unitsAvailable,
                                productType: response.productType,
                                rentalStartingFromPrice: response.rentalPricePerWeek
                            }
                            wishlist.push(product);
                        }
                    } else {
                        if (count > response.unitsAvailable)
                            return res.status(400).json({ error: "Only " + response.unitsAvailable + " units available" });
                        else {
                            let product = {
                                productID: response._id,
                                title: response.title,
                                thumbnailURL: response.thumbnailURL,
                                sellerUsername: response.sellerUsername,
                                unitsAvailable: response.unitsAvailable,
                                productType: response.productType,
                                bookingStartDate: bookingStartDate,
                                bookingEndDate: bookingEndDate,
                                count: count,
                                rentedAtPrice: response.rentalPricePerWeek + "/week, " + response.rentalPricePerMonth + "/month"
                            }

                            cart.push(product);
                            let index = wishlist.findIndex((product) => product["productID"] === productID);
                            if (index !== -1) {
                                wishlist.splice(index, 1);
                            }
                        }
                    }

                    gamerCollection.findOneAndUpdate(
                        {
                            _id: userID, // search query
                        },
                        {
                            $set: {
                                cart: cart,
                                wishlist: wishlist
                            },
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    ).then((r) => {
                        gamerCollection.findOne({ _id: userID })
                            .then((result) => {
                                return res.send(result.cart);
                            })
                            .catch((err) => {
                                return res.send(err)
                            })
                    })
                        .catch((err) => {
                            res.send(err)
                        })
                })
                .catch((err) => {
                    res.send(err)
                })
        })
        .catch((err) => {
            res.send(err)
        })
})

//place order
app.put(EndPoints.ORDER, (req, res) => {

    const { userID } = req.body

    gamerCollection.findOneAndUpdate(
        {
            _id: userID, // search query
        },
        {
            $set: {
                cart: []
            },
        },
        {
            new: true,
            runValidators: true,
        })
        .then((response) => {
            let orders = response.value.cart;

            Promise.all(orders.map(product => {

                let unitsLeft = product.unitsAvailable - product.count;
                let productOrdered = productCollection.findOneAndUpdate(
                    {
                        _id: product.productID, // search query
                    },
                    {
                        $set: {
                            unitsAvailable: unitsLeft
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                ).then((result) => {
                    let order = {
                        ...product,
                        unitsAvailable: unitsLeft
                    }

                    return order;
                }).catch((err) => {
                    return err
                })

                return productOrdered
            }))
                .then((result) => {
                    res.send(result)
                })
                .catch((err) => {
                    res.send(err)
                })

        })
})

exports.app = app;
exports.gamerCollection = gamerCollection;
exports.sellerCollection = sellerCollection;
exports.productCollection = productCollection;