import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { Link } from "react-router-dom";
import styles from "../styles/MyBooks.module.css";

const MyBooks = () => {
  const { currentUser } = useContext(AuthContext);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await api.get("/api/books/favorites");
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    }

    if (currentUser) {
      fetchFavorites();
    }
  }, [currentUser]);

  const removeBook = async (googleId) => {
    try {
      await api.delete(`/api/books/remove/${googleId}`);
      setBooks((prev) => prev.filter((book) => book.googleId !== googleId));
    } catch (err) {
      console.error("Error removing book:", err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Your Library of Middle-earth</h2>
      {books.length === 0 ? (
        <p>You have no books saved yet.</p>
      ) : (
        <div className={styles.grid}>
          {books.map((book) => (
            <div key={book._id} className={styles.card}>
              <h3>{book.title}</h3>
              <p><strong>Authors:</strong> {book.authors?.join(", ")}</p>
              {book.thumbnail && <img src={book.thumbnail} alt={book.title} />}
              <div className={styles.actions}>
                <Link to={`/books/${book._id}`} className={styles.link}>See Details</Link>
                <button onClick={() => removeBook(book.googleId)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
