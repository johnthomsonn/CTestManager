import logo from './logo.svg';
import './App.css';
import Main from './components/main/Main';

function App(props) {
  return (
    <div className="App">
      <Main {...props} />
    </div>
  );
}

export default App;
