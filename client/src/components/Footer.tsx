// src/components/Footer.tsx
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube, FaDiscord } from 'react-icons/fa'; 

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-slate-800 pt-12 pb-8 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* LOGO Y REDES */}
        <div className="space-y-6">
          <span className="text-xl font-black text-white italic tracking-tighter">
            HAMMERFLOW <span className="text-[#ff6600]">FORGE</span>
          </span>
          <div className="flex gap-4">
            {[FaFacebook, FaInstagram, FaYoutube, FaDiscord].map((Icon, i) => (
              <a key={i} href="#" onClick={(e) => e.preventDefault()} 
                 className="w-10 h-10 bg-black border border-slate-800 flex items-center justify-center text-slate-500 hover:text-[#ff6600] transition-all rounded-sm">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* ENLACES USUARIO */}
        <div>
          <h4 className="text-white font-bold uppercase text-[10px] tracking-widest mb-6">Mi Forja</h4>
          <ul className="space-y-3 text-sm text-slate-500">
            <li><Link to="/favoritos" className="hover:text-white transition-colors">Mis Favoritos</Link></li>
            <li><Link to="/nuevo" className="hover:text-white transition-colors">Forjar Nueva Pieza</Link></li>
          </ul>
        </div>

        {/* CATEGORÍAS RÁPIDAS */}
        <div>
          <h4 className="text-white font-bold uppercase text-[10px] tracking-widest mb-6">Explorar</h4>
          <ul className="space-y-3 text-sm text-slate-500">
            {['Fantasía', 'Bustos', 'Monstruos', 'Tutorial'].map(cat => (
              <li key={cat}><Link to={`/?categoria=${cat}`} className="hover:text-[#ff6600] transition-colors">{cat}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="text-center mt-12 pt-8 border-t border-white/5 text-[10px] text-slate-600 uppercase tracking-widest">
        © {new Date().getFullYear()} HammerFlow Forge - Las leyendas se escriben a pincel
      </div>
    </footer>
  );
};