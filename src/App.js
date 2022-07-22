import {HashRouter, BrowserRouter, Routes,Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Main from './components/main/Main';
import About from "./components/about/About";

function App(props) {
  return (<>
    
      <BrowserRouter basename="/">

        <Routes>

          <Route path="/" exact element={<Main {...props} />} />
          <Route path="/about" exact element={<About {...props} />}/>

        </Routes>
      
      </BrowserRouter>
    
  </>);
}

export default App;
