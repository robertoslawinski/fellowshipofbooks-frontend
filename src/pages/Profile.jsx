import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import styles from "../styles/Profile.module.css";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [bookCount, setBookCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const resBooks = await api.get("/api/books/favorites");
        setBookCount(resBooks.data.length);

        const resComments = await api.get(`/api/comments/user/${currentUser._id}`);
        setCommentCount(resComments.data.length);
      } catch (err) {
        console.error("Error loading profile info:", err);
      }
    }

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className={styles.profile}>
      <h2>Traveler's Profile</h2>

      <div className={styles.card}>
        <p><strong>Username:</strong> {currentUser.username}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Books Collected:</strong> {bookCount}</p>
        <p><strong>Scrolls Written:</strong> {commentCount}</p>
      </div>
    </div>
  );
};

export default Profile;
