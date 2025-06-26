import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import styles from "../styles/Profile.module.css";

const Profile = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [bookCount, setBookCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");
  const [file, setFile] = useState(null);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.post("/api/upload/avatar", formData);
      setAvatar(res.data.avatar);
      updateUser({ avatar: res.data.avatar }); // atualiza no contexto
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className={styles.profile}>
      <h2>Traveler's Profile</h2>

      {avatar && (
        <img
          src={avatar}
          alt="Avatar"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "1rem",
            border: "2px solid var(--color-primary)",
          }}
        />
      )}

      <div className={styles.card}>
        <p><strong>Username:</strong> {currentUser.username}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Books Collected:</strong> {bookCount}</p>
        <p><strong>Scrolls Written:</strong> {commentCount}</p>

        <div style={{ marginTop: "1.5rem" }}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handleUpload} style={{ marginTop: "0.5rem" }}>
            Upload Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
