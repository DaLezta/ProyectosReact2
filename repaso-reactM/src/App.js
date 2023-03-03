import logo from './logo.svg';
import './App.css';
import { PrimerComponente } from './Components/PrimerComponente';
import { SegundoComponente } from './Components/SegundoComponente';
import { EjercicioComponent } from './Components/EjercicioComponent';

function App() {
  const fecha = new Date();
  const yearActual = fecha.getFullYear();
  console.log(yearActual)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
         Esto es un repaso.
        </p>
        <PrimerComponente></PrimerComponente>
        <SegundoComponente></SegundoComponente>

        <EjercicioComponent year={yearActual}></EjercicioComponent>
      </header>
    </div>
  );
}

export default App;
