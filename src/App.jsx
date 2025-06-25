import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SearchBooks from "./pages/SearchBooks";
import MyBooks from "./pages/MyBooks";
import BookDetails from "./pages/BookDetails";
import Profile from "./pages/Profile";
import "./styles/global.css";
import styles from "./styles/App.module.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className={styles.appWrapper}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<SearchBooks />} />
            <Route path="/my-books" element={<MyBooks />} />
            <Route path="/books/:bookId" element={<BookDetails />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
