import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/Homepage";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
