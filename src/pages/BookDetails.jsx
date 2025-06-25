import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/BookDetails.module.css";

const BookDetails = () => {
  const { bookId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);

  useEffect(() => {
    async function fetchBookAndComments() {
      try {
        const resBooks = await api.get("/api/books/favorites");
        const found = resBooks.data.find((b) => b._id === bookId);
        setBook(found);

        const resComments = await api.get(`/api/comments/${bookId}`);
        setComments(resComments.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchBookAndComments();
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/api/comments/${bookId}`, { text: newComment });
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/api/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (commentId) => {
    try {
      const res = await api.put(`/api/comments/${commentId}`, { text: editingComment.text });
      setComments(comments.map((c) => (c._id === commentId ? res.data : c)));
      setEditingComment(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Book Details</h2>

      {book ? (
        <div className={styles.book}>
          <h3>{book.title}</h3>
          <p><strong>Authors:</strong> {book.authors?.join(", ")}</p>
          {book.thumbnail && <img src={book.thumbnail} alt={book.title} />}
        </div>
      ) : (
        <p>Loading book info...</p>
      )}

      <div className={styles.comments}>
        <h3>Comments</h3>

        {currentUser && (
          <form onSubmit={handleSubmit} className={styles.commentForm}>
            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="3"
            />
            <button type="submit">Submit</button>
          </form>
        )}

        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className={styles.commentBox}>
              <p><strong>{comment.user.username}</strong>:</p>
              {editingComment?.id === comment._id ? (
                <>
                  <textarea
                    value={editingComment.text}
                    onChange={(e) =>
                      setEditingComment({ ...editingComment, text: e.target.value })
                    }
                  />
                  <button onClick={() => handleEdit(comment._id)}>Save</button>
                </>
              ) : (
                <p>{comment.text}</p>
              )}
              {currentUser?._id === comment.user._id && !editingComment && (
                <div className={styles.commentActions}>
                  <button onClick={() => setEditingComment({ id: comment._id, text: comment.text })}>Edit</button>
                  <button onClick={() => handleDelete(comment._id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookDetails;
