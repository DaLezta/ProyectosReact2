import React,{useState} from 'react'
import PropTypes from 'prop-types'
export const EjercicioComponent = ({year}) => {

let[yearNow, setYearNow] = useState(year);

function siguiente(){
    setYearNow(yearNow+1)
}

function anterior(){
    setYearNow(yearNow-1)
}

function cambiarYear(e){
    let valor = parseInt(e.target.value); //Como es un valor que viene desde el input siempre va ser string, asi que parseamos a int

    if(Number.isInteger(valor)){
        setYearNow(valor)
    }else{
        setYearNow(year)
    }
    
}
  return (
    <div>
        <h2>Ejercicio con eventos y use state</h2>
        <p className='label'>
            {yearNow}
        </p>
        <p>
            <button onClick={siguiente}>Siguiente</button>
            <button onClick={anterior}>Anterior</button>
        </p>
        <p>
            <input type='text' placeholder="Cambia el ano" onChange={cambiarYear}></input>
        </p>

    </div>
  )
}

EjercicioComponent.propTypes ={
    year: PropTypes.number.isRequired
}
