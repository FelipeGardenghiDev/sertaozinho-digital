import React, { useState, useMemo } from 'react';
import { Newspaper, ExternalLink, Clock, Filter } from 'lucide-react';
import { NoticiaLocal } from '../types';
import { formatTimeAgo } from '../utils/formatters';

interface NoticiasViewProps {
  noticias: NoticiaLocal[];
  searchQuery: string;
}

export const NoticiasView: React.FC<NoticiasViewProps> = ({ noticias, searchQuery }) => {
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todas');

  const categorias = ['todas', 'Cidade', 'Economia', 'Cultura', 'Saúde'];

  const filteredNoticias = useMemo(() => {
    return noticias.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.resumo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fonte.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategoria === 'todas' || item.categoria === selectedCategoria;

      return matchesSearch && matchesCat;
    });
  }, [noticias, searchQuery, selectedCategoria]);

  return (
    <div className="space-y-4 pb-12">
      {/* Cabeçalho */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Newspaper className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Radar de Notícias de Sertãozinho</h2>
        </div>
        <p className="text-xs text-slate-400">
          Agregação dos principais portais, comunicados públicos e diários de Sertãozinho e região
        </p>
      </div>

      {/* Categorias */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategoria(cat)}
            className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              selectedCategoria === cat
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {cat === 'todas' ? 'Todas Notícias' : cat}
          </button>
        ))}
      </div>

      {/* Grid de Notícias */}
      <div className="space-y-3">
        {filteredNoticias.length === 0 ? (
          <div className="py-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
            <Filter className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">Nenhuma notícia encontrada</p>
            <p className="text-xs text-slate-500">Tente buscar por outras palavras-chave.</p>
          </div>
        ) : (
          filteredNoticias.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 transition-all group block shadow-sm"
            >
              {item.imagemUrl && (
                <div className="w-full sm:w-44 h-36 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-800 relative">
                  <img
                    src={item.imagemUrl}
                    alt={item.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded border border-slate-700/60">
                    {item.categoria}
                  </span>
                </div>
              )}

              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span className="font-semibold text-emerald-400">{item.fonte}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{formatTimeAgo(item.data)}</span>
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {item.titulo}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.resumo}
                  </p>
                </div>

                <div className="flex items-center text-xs font-semibold text-emerald-400 space-x-1 pt-1">
                  <span>Ler matéria completa na fonte</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
};
