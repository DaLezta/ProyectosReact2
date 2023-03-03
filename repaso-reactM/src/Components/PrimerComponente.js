import React,{useState} from 'react'

export const PrimerComponente = () => {

    //let nombre="Daniel Bustos";
    let web =  "daniel.com";

    const [nombre,setNombre]= useState("Nombre estatico inicial")
    const [nombre2,setNombre2]= useState("")
    let cursos=[
        "Master de js",
        "Master de React",
        "Master de Angular",
        "Master de html",
        "Master de Css"
    ]

    function cambiarNombre(nuevoNombre){
        setNombre(nuevoNombre)
    }

    function mostrarValor(){
        setNombre2(nombre)
    }
  return (
    <div>
        <h1>Este es el primer componente.</h1>
        <p>Mi nombre es: <strong className={nombre.length >=6 ? 'Verde':'Rojo'} >{nombre}</strong></p>
        <p>Mi pagina es: {web}</p>
        <h1>Cursos</h1>
        <input onChange={e=> cambiarNombre(e.target.value)} placeholder="Escribe un nombre"></input>

        <button onClick={e => cambiarNombre("Mirna Elizabeth")}> Cambiar Nombre</button>
        <button onClick={mostrarValor}>Muestra valor</button>
        <p>El valor de la variable es: {nombre2}</p>
        <ul>
                {
                    cursos.map(function(element,indice){
                        return(<li key={indice}>
                                {element}
                            </li>);
                    })
                }
        </ul>
    </div>
  )
}
