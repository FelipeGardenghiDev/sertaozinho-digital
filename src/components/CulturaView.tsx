import React, { useState, useMemo } from 'react';
import { Music, MessageSquare, Calendar, ExternalLink } from 'lucide-react';
import { ArtistaLocal } from '../types';
import { generateWhatsAppLink } from '../utils/formatters';

interface CulturaViewProps {
  artistas: ArtistaLocal[];
  searchQuery: string;
}

export const CulturaView: React.FC<CulturaViewProps> = ({ artistas, searchQuery }) => {
  const [selectedEstilo, setSelectedEstilo] = useState<string>('todos');

  const estilos = [
    'todos',
    'Sertanejo & Raiz',
    'Rock & Pop',
    'Pagode & Samba',
    'Eletrônica & DJ',
  ];

  const filteredArtistas = useMemo(() => {
    return artistas.filter((art) => {
      const matchesSearch =
        searchQuery === '' ||
        art.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.estilo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.bio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEstilo = selectedEstilo === 'todos' || art.estilo === selectedEstilo;

      return matchesSearch && matchesEstilo;
    });
  }, [artistas, searchQuery, selectedEstilo]);

  return (
    <div className="space-y-4 pb-12">
      {/* Cabeçalho */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Music className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Radar Musical & Artistas de Sertãozinho</h2>
        </div>
        <p className="text-xs text-slate-400">
          Descubra bandas locais, músicos independentes, agenda de shows nos bares e contrate direto
        </p>
      </div>

      {/* Filtro por Estilo */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {estilos.map((estilo) => (
          <button
            key={estilo}
            onClick={() => setSelectedEstilo(estilo)}
            className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              selectedEstilo === estilo
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {estilo === 'todos' ? 'Todos os Estilos' : estilo}
          </button>
        ))}
      </div>

      {/* Grid de Artistas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredArtistas.map((art) => (
          <div
            key={art.id}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-600/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-colors shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                  {art.estilo}
                </span>

                {/* Redes Sociais */}
                <div className="flex items-center space-x-2.5">
                  {art.instagram && (
                    <a
                      href={art.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-pink-400 transition-colors"
                      title="Instagram"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  {art.youtube && (
                    <a
                      href={art.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-red-400 transition-colors"
                      title="YouTube"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  )}
                  {art.spotify && (
                    <a
                      href={art.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-emerald-400 transition-colors"
                      title="Spotify"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white tracking-tight">{art.nome}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{art.bio}</p>
              </div>

              {/* Próximos Shows */}
              {art.proximosShows && art.proximosShows.length > 0 && (
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 space-y-1 text-xs">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Próximas Apresentações:</span>
                  </div>
                  {art.proximosShows.map((show, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
                      <span className="font-semibold text-slate-200">{show.data}</span>
                      <span className="text-slate-400 truncate max-w-[170px] text-right">{show.local} • {show.horario}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contrato Direto via WhatsApp */}
            {art.whatsappContato && (
              <a
                href={generateWhatsAppLink(
                  art.whatsappContato,
                  `Olá, vi o perfil de vocês no Sertãozinho Digital e gostaria de informações sobre shows e contratações.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-950/80 border border-emerald-600/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contratar Show / Contato WhatsApp</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
