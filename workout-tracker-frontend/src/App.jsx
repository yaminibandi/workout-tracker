import { useEffect, useState } from "react";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutList from "./components/WorkoutList";
import styles from "./workout.module.css";
import AuthForm from "./components/AuthForm";

function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [workouts, setWorkouts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activityFilter, setActivityFilter] = useState("all");
  const [intensityFilter, setIntensityFilter] = useState("all");

  const handleLoginSuccess = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setWorkouts([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  const fetchWorkouts = async (page = 1) => {
    try {
      setIsLoading(true);
      let url = `http://localhost:5000/api/workouts?page=${page}&limit=5`;
      if (activityFilter && activityFilter !== "all") {
        url += `&activityType=${activityFilter}`;
      }
      if (intensityFilter && intensityFilter !== "all") {
        url += `&intensity=${intensityFilter}`;
      }
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            handleLogout();
            return;
          }
          if (!res.ok) {
            throw new Error("HTTP error! Status: ${res.status}");
          }
          return res.json();
        })
        .then((data) => {
          setWorkouts(data.workouts);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
        });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWorkouts(currentPage);
    }
  }, [currentPage, activityFilter, intensityFilter, token]);

  const handleActivityChange = (e) => {
    setActivityFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleIntensityChange = (e) => {
    setIntensityFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.appTitle}> Workout Tracker</h1>
      {!token ? (
        <AuthForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <div>
            <span>Hello, {user?.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <WorkoutForm onWorkoutSubmit={fetchWorkouts} token={token} />
          <div className={styles.filterContainer}>
            <div className={styles.filterGroup}>
              <label htmlFor="activityFilter">Activity:</label>
              <select
                id="activityFilter"
                value={activityFilter}
                onChange={handleActivityChange}
                className={styles.filterSelect}
              >
                <option value="all">All Activities</option>
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
            <div className={styles.filterGroup}>
              <label htmlFor="intensityFilter">Intensity:</label>
              <select
                id="intensityFilter"
                value={intensityFilter}
                onChange={handleIntensityChange}
                className={styles.filterSelect}
              >
                <option value="all">All Intensities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <WorkoutList
            workouts={workouts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}

export default App;
