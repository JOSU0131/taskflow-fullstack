import { useState } from 'react';

// T representa cualquier objeto que tenga un ID
interface DataTableProps<T extends { id: string | number }> {
  titulo: string;
  datos: T[];
  columnas: { clave: keyof T; etiqueta: string }[];
}

export function DataTable<T extends { id: string | number }>({ titulo, datos, columnas }: DataTableProps<T>) {
  
  // 🛠️ USO DE UTILITY TYPE: Partial<T>
  // 'Partial' hace que todas las propiedades de T sean opcionales.
  // Es perfecto para un estado de "edición" temporal.
  const [elementoEditando, setElementoEditando] = useState<Partial<T> | null>(null);

  return (
    <div style={{ padding: '20px', border: '1px solid #646cff', borderRadius: '12px', margin: '20px 0' }}>
      <h2>{titulo}</h2>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #444' }}>
            {columnas.map((col) => (
              <th key={String(col.clave)} style={{ padding: '10px' }}>{col.etiqueta}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.map((fila) => (
            <tr 
              key={fila.id} 
              onClick={() => setElementoEditando(fila)} 
              style={{ cursor: 'pointer', borderBottom: '1px solid #222' }}
            >
              {columnas.map((col) => (
                <td key={String(col.clave)} style={{ padding: '10px' }}>
                  {String(fila[col.clave])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {elementoEditando && (
        <div style={{ marginTop: '15px', color: '#646cff', fontSize: '0.9rem' }}>
          📝 Seleccionado para editar: ID {elementoEditando.id} (Usando Partial&lt;T&gt;)
        </div>
      )}
    </div>
  );
}