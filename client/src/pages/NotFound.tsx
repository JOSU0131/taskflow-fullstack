import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-black text-slate-800">404</h1>
      
      <div className="bg-orange-500 text-white px-4 py-1 rotate-3 -mt-8 mb-8 font-bold text-xl uppercase">
        ¡Unidad eliminada!
      </div>

      <h2 className="text-2xl font-bold text-white mb-4">
        Te has adentrado demasiado en la Disformidad
      </h2>
      
      <p className="text-slate-400 max-w-md mb-8">
        La página que buscas no existe en este sector de la galaxia. 
        Puede que haya sido purgada por la Inquisición o que el enlace se haya roto.
      </p>

      <Link 
        to="/" 
        className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105"
      >
        Volver a la Forja (Inicio)
      </Link>
    </div>
  );
}