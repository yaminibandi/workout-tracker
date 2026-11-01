const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const newWorkout = new Workout({
      ...req.body,
      user: req.userId,
    });
    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const { activityType, intensity } = req.query;

    const filter = { user: req.userId };

    if (activityType && activityType !== "all") {
      filter.activityType = activityType;
    }
    if (intensity && intensity !== "all") {
      filter.intensity = intensity;
    }

    // Calculate the skip value based on the page and limit
    const skip = (page - 1) * limit;

    // Fetch workouts with pagination
    const workouts = await Workout.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalWorkouts = await Workout.countDocuments(filter);
    const totalPages = Math.ceil(totalWorkouts / limit);
    res.status(200).json({
      workouts: workouts,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

// /?page=2&limit=5
