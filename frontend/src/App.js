import "./App.css";
import Signin from "./Components/Signin";
import Home from "./Components/Home";
import { Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
function App() {
  return (
    <Routes>
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/signin" element={<Signin />} />
      <Route exact path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
