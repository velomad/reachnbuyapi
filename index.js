const express = require("express")
const cors = require("cors");
const app = express();
const path = require("path")
const bodyParser = require("body-parser");
const {MongoClient}= require("mongodb");
const port = process.env.PORT || 5000;

const db = require("./config/keys").mongoURI

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// Middlewares
app.use(cors());

app.use("/api/v1/myntra/topwear", require("./routes/myntra/topwear"))
app.use("/api/v1/myntra/", require("./routes/categories/category"))

MongoClient.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log("MongoDB successfully connected")
    }).catch(err => {
        console.log(err)
    })

app.listen(port, () => {
    console.log(`Server Running at ${port}`)
})