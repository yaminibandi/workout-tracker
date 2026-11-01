require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const workoutRoutes = require("./routes/workoutRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());
// Access-Control-Allow-Origin: * security header

mongoose.connect(process.env.MONGO_URI, {
    dbName: "workoutTrackerDB"
}).then(() => {
    console.log("Connected to MongoDB")
}).catch((e) => {
    console.log(e)
});

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
