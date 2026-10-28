import React, { useState } from 'react';
import { X, MapPin, Navigation, PhoneCall, Search, Clock, Compass, Trash2, Bus, HeartPulse } from 'lucide-react';
import pontosData from '../data/pontos-interesse.json';
import { PontoInteresse } from '../types';
import { generatePhoneCallLink } from '../utils/formatters';

interface MapaCivicoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MapaCivicoModal: React.FC<MapaCivicoModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPontoId, setSelectedPontoId] = useState<string>(pontosData[0]?.id || 'poi-1');

  if (!isOpen) return null;

  const pontos = pontosData as PontoInteresse[];
  const categorias = [
    'todos',
    'Saúde & SOS',
    'Ecoponto de Entulho',
    'Transporte',
    'Farmácia de Plantão',
    'Cultura & Lazer'
  ];

  const filteredPontos = pontos.filter((p) => {
    const matchesCat = selectedCategoria === 'todos' || p.categoria === selectedCategoria;
    const matchesSearch =
      searchTerm === '' ||
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const selectedPonto = pontos.find((p) => p.id === selectedPontoId) || filteredPontos[0] || pontos[0];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Saúde & SOS':
        return <HeartPulse className="w-4 h-4 text-red-400" />;
      case 'Ecoponto de Entulho':
        return <Trash2 className="w-4 h-4 text-emerald-400" />;
      case 'Transporte':
        return <Bus className="w-4 h-4 text-sky-400" />;
      case 'Farmácia de Plantão':
        return <HeartPulse className="w-4 h-4 text-teal-400" />;
      default:
        return <MapPin className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-emerald-600/40 rounded-3xl w-full max-w-xl p-5 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Título */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/80">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Mapa Cívico Interativo</h3>
            <p className="text-xs text-emerald-400 font-medium">
              Ecopontos, UPAs, Rodoviária e Farmácias de Sertãozinho no GPS
            </p>
          </div>
        </div>

        {/* Campo de Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por local ou bairro (ex: UPA, Alvorada, Ecoponto...)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filtro de Categorias */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoria(cat)}
              className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-all ${
                selectedCategoria === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'todos' ? 'Todos os Locais' : cat}
            </button>
          ))}
        </div>

        {/* Radar Visual SVG de Sertãozinho */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Plano Cartográfico de Sertãozinho & Distrito</span>
            </span>
            <span>Toque no ponto para selecionar</span>
          </div>

          <div className="h-36 sm:h-44 bg-slate-900/60 rounded-xl border border-slate-800/80 relative flex items-center justify-center overflow-hidden">
            {/* Linhas de grade e anéis do radar */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <div className="w-48 h-48 rounded-full border border-emerald-500" />
              <div className="w-32 h-32 rounded-full border border-emerald-500 absolute" />
              <div className="w-16 h-16 rounded-full border border-emerald-500 absolute" />
              <div className="w-full h-px bg-emerald-500 absolute" />
              <div className="h-full w-px bg-emerald-500 absolute" />
            </div>

            {/* Rótulos dos Quadrantes */}
            <span className="absolute top-2 left-2 text-[9px] font-mono text-slate-500">ZONA NORTE (Alvorada/Docão)</span>
            <span className="absolute top-2 right-2 text-[9px] font-mono text-purple-400">CRUZ DAS POSSES ➔</span>
            <span className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-500">ZONA OESTE</span>
            <span className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-500">ZONA LESTE (Cohabs/Aliança)</span>

            {/* Pins no Radar */}
            <div className="relative w-full h-full p-2">
              {filteredPontos.map((p) => {
                // Mapear coordenadas relativas para posicionamento visual
                // Centro aprox: lat -21.138, lon -47.989
                // Cruz das Posses: lat -21.074 (norte), lon -47.904 (leste)
                const isSelected = selectedPonto?.id === p.id;
                
                let topPct = 50;
                let leftPct = 50;

                if (p.regiao === 'Cruz das Posses') {
                  topPct = 18;
                  leftPct = 85;
                } else if (p.regiao === 'Norte') {
                  topPct = 25;
                  leftPct = p.nome.includes('Alvorada') ? 35 : 48;
                } else if (p.regiao === 'Leste') {
                  topPct = p.nome.includes('UPA') ? 45 : 65;
                  leftPct = 78;
                } else if (p.regiao === 'Centro') {
                  topPct = p.nome.includes('Santa Casa') ? 48 : 55;
                  leftPct = p.nome.includes('Rodoviário') ? 38 : 50;
                }

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPontoId(p.id)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 scale-125 z-20 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 z-10'
                    }`}
                    style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                    title={`${p.nome} (${p.bairro})`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card do Ponto Selecionado */}
        {selectedPonto && (
          <div className="bg-slate-950 border border-emerald-600/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  {getCategoryIcon(selectedPonto.categoria)}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {selectedPonto.categoria} &middot; {selectedPonto.regiao}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {selectedPonto.nome}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedPonto.endereco}
                  </p>
                </div>
              </div>

              {selectedPonto.telefone && (
                <a
                  href={generatePhoneCallLink(selectedPonto.telefone)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 hover:text-white transition-colors shrink-0"
                  title="Ligar"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              {selectedPonto.descricao}
            </p>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedPonto.horario}</span>
              </span>

              <a
                href={selectedPonto.linkGoogleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-md shadow-emerald-950/80 transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navegar no GPS</span>
              </a>
            </div>
          </div>
        )}

        {/* Lista Resumida dos Locais */}
        <div className="space-y-2 pt-1">
          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Todos os Pontos Encontrados ({filteredPontos.length})
          </h5>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {filteredPontos.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPontoId(p.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                  selectedPontoId === p.id
                    ? 'bg-emerald-950/40 border-emerald-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  {getCategoryIcon(p.categoria)}
                  <span className="font-semibold truncate">{p.nome}</span>
                  <span className="text-[10px] text-slate-500 shrink-0">({p.bairro})</span>
                </div>
                <Navigation className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
