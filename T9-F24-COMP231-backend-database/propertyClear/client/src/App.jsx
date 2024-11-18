import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import Agent from './components/AgentDash';
import Investor from './components/InvestorDash';

function App() {
  const isAuthenticated = true;
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Main />}></Route>
          {isAuthenticated && (
            <>
              <Route path="/realEstate" element={<Agent />} />
              <Route path="/investor" element={<Investor />} />
            </>
          )}
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
