const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const PORT = 8000;
const MongoURI = "mongodb+srv://nikhilkottoli2005:gitbit@gitbit.pqfk6.mongodb.net/?retryWrites=true&w=majority&appName=GitBit";

const userRoutes = require("./routes/user");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

mongoose.connect(MongoURI).then(() => {
  console.log("Connected to MongoDB");
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World"));
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
