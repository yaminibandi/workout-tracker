import { useState } from "react";
import styles from "../workout.module.css";
export default function WorkoutForm({ onWorkoutSubmit, token }) {
  const [workoutData, setWorkoutData] = useState({
    activityType: "Cardio",
    durationMinutes: 1,
    intensity: "Low",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workoutData),
      });

      if (response.ok) {
        alert("Workout logged successfully");
        setWorkoutData({
          activityType: "Cardio",
          durationMinutes: 1,
          intensity: "Low",
          notes: "",
        });

        onWorkoutSubmit();
      } else {
        const err = await response.json();
        alert(err.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.card}>
      <h2>Log a Workout</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Activity Type:</label>
          <select
            value={workoutData.activityType}
            onChange={(e) =>
              setWorkoutData({ ...workoutData, activityType: e.target.value })
            }
          >
            <option value="Cardio">Cardio</option>
            <option value="Strength">Strength</option>
            <option value="Flexibility">Flexibility</option>
            <option value="Dance">Dance</option>
            <option value="Walking">Walking</option>
            <option value="Yoga">Yoga</option>
            <option value="Cycling">Cycling</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Duration (minutes): </label>
          <input
            type="number"
            value={workoutData.durationMinutes}
            min="1"
            required
            onChange={(e) =>
              setWorkoutData({
                ...workoutData,
                durationMinutes: e.target.value,
              })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label>Intensity: </label>
          <select
            value={workoutData.intensity}
            onChange={(e) =>
              setWorkoutData({ ...workoutData, intensity: e.target.value })
            }
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Notes: </label>
          <textarea
            value={workoutData.notes}
            onChange={(e) =>
              setWorkoutData({ ...workoutData, notes: e.target.value })
            }
          ></textarea>
        </div>

        <button type="submit" className={styles.submitButton}>
          Log Workout
        </button>
      </form>
    </div>
  );
}

// Improve styling
// Workout history should get updated after logging new workout
// Show all details if all workouts
// Add filters on activity type
// Pagination
// Make it specific to user
