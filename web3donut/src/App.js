import './App.css';
import Donut from './components/donut';
function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Donut
        searchBar = {true}
      />
      </header>
    </div>
  );
}

export default App;
