const express = require("express");
const hbs = require("ejs");
const path = require("path");
const app = express();
const fs = require("fs");
const multer = require("multer");
const staticPath = path.join(__dirname, "../public");
const templetsPath = path.join(__dirname, "../templets/partials");
const viewsPath = path.join(__dirname, "../templets/views");
const port = process.env.PORT || 3000;
require("./db/connection");
const Product = require("./models/schema");
const bcrypt = require('bcrypt');
const { MongoClient, GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
var conn = mongoose.connection;
var gfsbucket;
var gfsbucketsave;

conn.once("open", () => {
  gfsbucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "post",
  });
});
conn.once("open", () => {
  gfsbucketsave = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "save",
  });
});

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploade/image");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const Save = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploade/cimage");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload1 = multer({ storage: storage1 });
const upload2 = multer({ storage: Save });
const saved = multer({ storage: Save });

const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticPath));
app.set("view engine", "ejx");
app.set("views", viewsPath);
hbs.registerPartials(templetsPath);

app.use('/public', express.static(staticPath));

// Predefined images
mongoose.connect("mongodb://localhost:27017/jewellery", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected...");
  const predefinedData = new Product({
    ring: [
      { img: "ring_img/img1.webp" },
      { img: "ring_img/imag2.jpg" },
      { img: "ring_img/img3.webp" },
      { img: "ring_img/imag_4.jpeg" },
      { img: "ring_img/imag5.jpeg" },
      { img: "ring_img/imag6.jpeg" },
      { img: "ring_img/imag7.jpeg" },
      { img: "ring_img/imag8.png" },
      { img: "ring_img/imag9.jpg" },
      { img: "ring_img/imag10.jpg" },
      { img: "ring_img/imag11.jpeg" },
      
    ],
    gift: [
      { img: "gifting_img/giftsformom.webp" },
      { img: "gifting_img/surprisesforher.webp" },
      { img: "gifting_img/giftfordad.webp" },
      { img: "collection_img/img4.webp" },
      { img: "collection_img/img5.webp" },
      { img: "collection_img/img6.webp" },
      { img: "collection_img/img7.webp" },
      { img: "collection_img/second1.webp" },
      { img: "collection_img/second1.webp" },
      { img: "collection_img/second2.webp" },
      { img: "collection_img/second3.webp" },
      { img: "collection_img/seven1.webp" },
      { img: "collection_img/seven2.webp" },
      { img: "collection_img/seven3.webp" },
      { img: "collection_img/seven4.webp" },
      { img: "collection_img/six1.webp" },
      { img: "collection_img/six2.jpg" },
      { img: "collection_img/four2.webp" }
    ],
    bengle: [
      { img: "collection_img/img1.webp" },
      { img: "collection_img/img2.webp" },
      { img: "collection_img/img3.webp" },
      { img: "collection_img/img4.webp" },
      { img: "collection_img/img5.webp" },
      { img: "collection_img/img6.webp" },
      { img: "collection_img/img7.webp" },
      { img: "collection_img/second1.webp" },
      { img: "collection_img/second1.webp" },
      { img: "collection_img/second2.webp" },
      { img: "collection_img/second3.webp" },
      { img: "collection_img/seven1.webp" },
      { img: "collection_img/seven2.webp" },
      { img: "collection_img/seven3.webp" },
      { img: "collection_img/seven4.webp" },
      { img: "collection_img/six1.webp" },
      { img: "collection_img/six2.jpg" },
      { img: "collection_img/four2.webp" }
    ],
    erring: [
      { img: "collection_img/img1.webp" },
      { img: "collection_img/img2.webp" },
      { img: "collection_img/img3.webp" },
      { img: "collection_img/img4.webp" },
      { img: "collection_img/img5.webp" },
      { img: "collection_img/img6.webp" },
      { img: "collection_img/img7.webp" },
      { img: "collection_img/second1.webp" },
      { img: "collection_img/second1.webp" },
      { img: "collection_img/second2.webp" },
      { img: "collection_img/second3.webp" },
      { img: "collection_img/seven1.webp" },
      { img: "collection_img/seven2.webp" },
      { img: "collection_img/seven3.webp" },
      { img: "collection_img/seven4.webp" },
      { img: "collection_img/six1.webp" },
      { img: "collection_img/six2.jpg" },
      { img: "collection_img/four2.webp" }
    ],
  });
  return predefinedData.save();
}).then((doc) => {
  console.log("Predefined data saved:", doc);
}).catch((err) => {
  console.error(err);
});

// Search bar functionality
app.post("/index", async (req, res) => {
  const search = req.body.search;
  console.log(req.body.search);
  try {
    let results;
    if (search === 'rings' || search === 'ring') {
      results = await Product.find({}, 'ring');
      // Flatten the results array and remove duplicates
      results = results.map(product => product.ring).flat();
      results = results.filter((value, index, self) => 
        index === self.findIndex((t) => (
          t.img === value.img
        ))
      );
    } else if (search === 'gifts' || search === 'gift') {
      results = await Product.find({}, 'gift');
      // Flatten the results array and remove duplicates
      results = results.map(product => product.gift).flat();
      results = results.filter((value, index, self) => 
        index === self.findIndex((t) => (
          t.img === value.img
        ))
      );
    } else if (search === 'bengles' || search === 'bengle') {
      results = await Product.find({}, 'bengle');
      // Flatten the results array and remove duplicates
      results = results.map(product => product.gift).flat();
      results = results.filter((value, index, self) => 
        index === self.findIndex((t) => (
          t.img === value.img
        ))
      );
    } else if (search === 'errings' || search === 'erring') {
      results = await Product.find({}, 'erring');
      // Flatten the results array and remove duplicates
      results = results.map(product => product.gift).flat();
      results = results.filter((value, index, self) => 
        index === self.findIndex((t) => (
          t.img === value.img
        ))
      );
    } else {
      return res.status(400).send("Not Found");
    }
    res.render("searchResults", { results: results });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/daimand", (req, res) => {
  res.render("daimand");
});

app.get("/collection", (req, res) => {
  res.render("collection");
});

app.get("/errings", (req, res) => {
  res.render("errings");
});

app.get("/rings", (req, res) => {
  res.render("rings");
});

app.get("/wedding", (req, res) => {
  res.render("wedding");
});

app.get("/gifting", (req, res) => {
  res.render("gifting");
});

app.get("/searchResults", (req, res) => {
  res.render("searchResults");
});

app.get("/gold", (req, res) => {
  res.render("gold");
});

app.get("/candidate", (req, res, next) => {
  res.render("candidate");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
