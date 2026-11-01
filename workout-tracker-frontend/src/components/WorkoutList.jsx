import styles from "../workout.module.css";
export default function WorkoutList({
  workouts,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}) {
  const getBadgeClass = (intensity) => {
    switch (intensity) {
      case "Low":
        return styles.badgeLow;
      case "Medium":
        return styles.badgeMedium;
      case "High":
        return styles.badgeHigh;
      default:
        return styles.badgeLow;
    }
  };
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : workouts.length === 0 ? (
        <p>No workouts logged yet</p>
      ) : (
        <>
          <ul className={styles.workoutList}>
            {console.log(workouts, "workouts")}{" "}
            {workouts.map((workout) => (
              <li key={workout._id} className={styles.card}>
                <div className={styles.workoutHeader}>
                  <strong>{workout.activityType}</strong>
                  <span className={getBadgeClass(workout.intensity)}>
                    {workout.intensity}
                  </span>
                </div>
                Duration: {workout.durationMinutes} minutes <br />
                <small>{new Date(workout.date).toLocaleDateString()}</small>
                {workout.notes && <small>Notes:{workout.notes}</small>}
              </li>
            ))}
          </ul>

          {totalPages > 0 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={styles.paginationButton}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
