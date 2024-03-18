import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { NavBar } from "./components/NavBar";
import { List } from "./components/GalleryList";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import { Gallery } from './pages/Gallery';
import { Friends } from "./pages/Friends";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireAuth from "./components/ProtectedRoute";
import { Form } from "./components/Form";
import Article from "./components/Article";
import Articles from "./components/Articles";
import AddArticle from "./components/AddArticle";
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <Routes>
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route element={<NavBar />}>
        <Route element={<RequireAuth />}>
          <Route path="/form" element={<Form />} />
          <Route path="/article/:id" element={<Article />} />
          <Route
            path="/"
            element={
              <div className="row mt-5">
                <div className="col-md-8">
                  <HomePage />
                </div>
                <div className="col-md-8">
                  <Articles />
                </div>
                <div className="col-md-4 ">
                  <AddArticle />
                </div>
              </div>
            }
          />
          <Route path="/galleryList" element={<List />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery" element={<List />} />
          <Route path="/friends" element={<Friends />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
