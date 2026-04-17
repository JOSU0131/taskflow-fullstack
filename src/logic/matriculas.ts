// src/logic/matriculas.ts

// 1. Interfaces del Módulo 2 (El "Corazón" de tus datos)
export interface MatriculaActiva {
    tipo: "ACTIVA";
    asignaturas: string[];
}

export interface MatriculaSuspendida {
    tipo: "SUSPENDIDA";
    motivo: string;
}

export interface MatriculaFinalizada {
    tipo: "FINALIZADA";
    notaMedia: number;
}

// Unión Discriminada
export type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada;

// 2. Interfaz principal del Alumno
export interface Alumno {
    id: string; // Añadimos ID para que React pueda manejar listas
    nombre: string;
    estado: EstadoMatricula;
}

// 3. Lógica con el "Análisis Exhaustivo" (Requisito Módulo 3)
export function generarReporte(estado: EstadoMatricula): string {
    switch (estado.tipo) {
        case "ACTIVA":
            return `En curso: ${estado.asignaturas.join(", ")}`;
        case "SUSPENDIDA":
            return `Pausada por: ${estado.motivo}`;
        case "FINALIZADA":
            return `Completada. Media: ${estado.notaMedia}`;
        default:
            // 🛡️ El guardián 'never' que pide el laboratorio
            const _check: never = estado;
            return _check;
    }
}