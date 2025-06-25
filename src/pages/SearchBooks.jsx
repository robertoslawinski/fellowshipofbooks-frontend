import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/SearchBooks.module.css";

const SearchBooks = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const data = await res.json();
      setResults(data.items || []);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  const saveToFavorites = async (book) => {
    const bookData = {
      googleId: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || [],
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
    };

    try {
      await api.post("/api/books/add", bookData);
      alert("Book saved to favorites!");
    } catch (error) {
      console.error("Error saving book:", error);
      alert("You must be logged in to save books.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Search for Books</h2>
      <form onSubmit={handleSearch} className={styles.form}>
        <input
          type="text"
          placeholder="Search by title or author"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className={styles.results}>
        {results.map((book) => (
          <div key={book.id} className={styles.card}>
            <h3>{book.volumeInfo.title}</h3>
            <p><strong>Authors:</strong> {book.volumeInfo.authors?.join(", ")}</p>
            {book.volumeInfo.imageLinks?.thumbnail && (
              <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
            )}
            {currentUser && (
              <button onClick={() => saveToFavorites(book)}>Add to Favorites</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBooks;
