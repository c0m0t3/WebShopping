import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/Homepage";
import { DetailView } from "./pages/DetailView";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:id" element={<DetailView />} />
      </Routes>
    </Router>
  );
};

export default App;
