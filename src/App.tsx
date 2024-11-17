import  {Navbar}  from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { AuthProvider}  from "./context/AuthContext";
import { BlogsProvider } from "./context/BlogsContext";
import PrivateRoute from "./components/PrivateRoute";
import { UserProfile } from "./pages/UserProfile";
import { CompleteDescBlogs } from "./components/CompleteDescBlogs";

const App = () => {
  return (
    <AuthProvider>
      <BlogsProvider>
      <div>
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Wrap Home route with PrivateRoute */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />

            <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}/>
            <Route path="/complete-blogs-details" element={<PrivateRoute><CompleteDescBlogs/></PrivateRoute>}/>
            <Route path="/profile/:username" element={<PrivateRoute><UserProfile/></PrivateRoute>}/>
            {/* Default redirect if route not found */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
      </BlogsProvider>
    </AuthProvider>
  );
};

export default App;
