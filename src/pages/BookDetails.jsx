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
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    async function fetchBookAndComments() {
      try {
        const resBooks = await api.get("/api/books/favorites");
        const found = resBooks.data.find((b) => b._id === bookId);
        setBook(found);

        const resComments = await api.get(`/api/comments/thread/${bookId}`);
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
      const updated = await api.get(`/api/comments/thread/${bookId}`);
      setComments(updated.data);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await api.post(`/api/comments/${bookId}`, {
        text: replyText,
        parentComment: parentId,
      });
      const res = await api.get(`/api/comments/thread/${bookId}`);
      setComments(res.data);
      setReplyText("");
      setReplyTo(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/api/comments/${commentId}`);
      const res = await api.get(`/api/comments/thread/${bookId}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (commentId) => {
    try {
      const res = await api.put(`/api/comments/${commentId}`, { text: editingComment.text });
      const updated = await api.get(`/api/comments/thread/${bookId}`);
      setComments(updated.data);
      setEditingComment(null);
    } catch (err) {
      console.error(err);
    }
  };

  const renderComment = (comment, level = 0) => (
    <div
      key={comment._id}
      className={styles.commentBox}
      style={{ marginLeft: `${level * 20}px` }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
        {comment.user.avatar && (
          <img
            src={comment.user.avatar}
            alt={comment.user.username}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #ccc"
            }}
          />
        )}
        <strong>{comment.user.username}</strong>
      </div>

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

      <div className={styles.commentActions}>
        {currentUser && (
          <button onClick={() => setReplyTo(comment._id)}>Reply</button>
        )}

        {currentUser?._id === comment.user._id && !editingComment && (
          <>
            <button onClick={() => setEditingComment({ id: comment._id, text: comment.text })}>Edit</button>
            <button onClick={() => handleDelete(comment._id)}>Delete</button>
          </>
        )}
      </div>

      {replyTo === comment._id && (
        <form
          onSubmit={(e) => handleReplySubmit(e, comment._id)}
          className={styles.commentForm}
        >
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows="2"
          />
          <button type="submit">Send</button>
        </form>
      )}

      {comment.replies && comment.replies.map((reply) => renderComment(reply, level + 1))}
    </div>
  );

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
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  );
};

export default BookDetails;
