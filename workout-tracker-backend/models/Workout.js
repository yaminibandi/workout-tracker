const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    activityType: {
        type: String,
        required: true,
        enum: ["Cardio", "Strength", "Flexibility", "Dance", "Walking", "Yoga", "Cycling", "Other"]
    },
    durationMinutes: {
        type: Number,
        required: true,
        min: 1
    },
    date: {
        type: Date,
        default: Date.now
    },
    intensity: {
        type: String,
        required: true,
        enum: ["Low", "Medium", "High"]
    },
    notes: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model("Workout", workoutSchema);