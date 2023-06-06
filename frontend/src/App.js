import "./App.css";
import Signin from "./Components/Signin";
import Home from "./Components/Home";
import { Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import { useState } from "react";
function App() {
  const [load, setLoad] = useState(false);
  return (
    <Routes>
      <Route
        exact
        path="/signup"
        element={<Signup load={load} setLoad={setLoad} />}
      />
      <Route exact path="/signin" element={<Signin />} />
      <Route exact path="/" element={<Home load={load} setLoad={setLoad} />} />
    </Routes>
  );
}

export default App;
