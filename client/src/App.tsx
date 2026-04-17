import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

// 1. Lógica del Módulo 2
import { Alumno, generarReporte } from './logic/matriculas';

// 2. Componentes y Utilidades del Módulo 3
import { DataTable } from './components/DataTable';
import { obtenerDiasDesde } from './utils/dateUtils';

// Interfaz para la Galería (Requisito de datos complejos)
interface Obra {
  id: string;
  titulo: string;
  artista: string;
  fechaIngreso: string;
}

const misAlumnos: Alumno[] = [
  { id: "1", nombre: "Daniel", estado: { tipo: "ACTIVA", asignaturas: ["TypeScript", "React"] } },
  { id: "2", nombre: "Josu", estado: { tipo: "FINALIZADA", notaMedia: 9.5 } }
];

const misObras: Obra[] = [
  { id: "OB-01", titulo: "Noche Estrellada", artista: "Van Gogh", fechaIngreso: "2023-01-10" },
  { id: "OB-02", titulo: "Guernica", artista: "Picasso", fechaIngreso: "2024-02-15" }
];

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        
        <div>
          <h1>TaskFlow: Panel de Control</h1>
          
          {/* SECCIÓN ALUMNOS (Módulo 2 + never) */}
          <div style={{ textAlign: 'left', background: '#222', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
            <h3>👥 Estado de Alumnos</h3>
            {misAlumnos.map(alumno => (
              <div key={alumno.id} style={{ marginBottom: '10px', borderBottom: '1px solid #444' }}>
                <p><strong>{alumno.nombre}</strong></p>
                <p style={{ color: '#646cff' }}>{generarReporte(alumno.estado)}</p>
              </div>
            ))}
          </div>

          {/* SECCIÓN TABLA GENÉRICA (Módulo 3: Genéricos + Partial) */}
          <DataTable 
            titulo="🏛️ Inventario Galería"
            datos={misObras}
            columnas={[
              { clave: 'titulo', etiqueta: 'Obra' },
              { clave: 'artista', etiqueta: 'Autor' }
            ]}
          />

          {/* SECCIÓN LUXON (Librería externa) */}
          <p style={{ fontSize: '0.9rem', color: '#888' }}>
            Info: La primera obra llegó hace {obtenerDiasDesde(misObras[0].fechaIngreso)} días.
          </p>
        </div>
        
        <button className="counter" onClick={() => setCount((c) => c + 1)} style={{ marginTop: '20px' }}>
          Interacciones: {count}
        </button>
      </section>

      <div className="ticks"></div>
    </>
  )
}

export default App