import React, { useState } from 'react';
import { X, Trash2, Recycle, Truck, Search, Info, MapPin } from 'lucide-react';
import coletaData from '../data/coleta-lixo.json';
import { ColetaBairro } from '../types';

interface ColetaLixoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColetaLixoModal: React.FC<ColetaLixoModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegiao, setSelectedRegiao] = useState<string>('todas');

  if (!isOpen) return null;

  const bairros = coletaData as ColetaBairro[];
  const regioes = ['todas', 'Centro', 'Norte', 'Sul', 'Leste', 'Oeste', 'Distrito'];

  const filteredBairros = bairros.filter((b) => {
    const matchesSearch =
      searchTerm === '' ||
      b.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.regiao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegiao = selectedRegiao === 'todas' || b.regiao === selectedRegiao;
    return matchesSearch && matchesRegiao;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-emerald-600/40 rounded-3xl w-full max-w-lg p-5 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Título */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/80">
            <Trash2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Coleta de Lixo & Cata-Treco</h3>
            <p className="text-xs text-emerald-400 font-medium">
              Consulte os dias de coleta comum, seletiva e móveis velhos por bairro
            </p>
          </div>
        </div>

        {/* Campo de Busca por Bairro */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome do seu bairro (ex: Alvorada, Cohab, Centro...)"
            className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filtro por Região */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {regioes.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegiao(reg)}
              className={`text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                selectedRegiao === reg
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {reg === 'todas' ? 'Todas Regiões' : reg}
            </button>
          ))}
        </div>

        {/* Lista de Bairros */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {filteredBairros.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 bg-slate-950/50 rounded-xl">
              Nenhum bairro encontrado com esse termo.
            </div>
          ) : (
            filteredBairros.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.bairro}</span>
                  </h4>
                  <span className="text-[10px] font-bold uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    Região {item.regiao}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {/* Coleta Comum */}
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center space-x-1 text-slate-400 text-[10px] font-bold uppercase">
                      <Trash2 className="w-3 h-3 text-emerald-400" />
                      <span>Coleta Comum</span>
                    </div>
                    <div className="font-bold text-slate-100">{item.coletaComumDias}</div>
                    <div className="text-[10px] text-slate-400">{item.coletaComumPeriodo}</div>
                  </div>

                  {/* Coleta Seletiva */}
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center space-x-1 text-teal-300 text-[10px] font-bold uppercase">
                      <Recycle className="w-3 h-3 text-teal-400" />
                      <span>Recicláveis</span>
                    </div>
                    <div className="font-bold text-slate-100">{item.coletaSeletivaDias}</div>
                    <div className="text-[10px] text-slate-400">Vidros, latas e papel</div>
                  </div>

                  {/* Cata-Treco */}
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center space-x-1 text-amber-300 text-[10px] font-bold uppercase">
                      <Truck className="w-3 h-3 text-amber-400" />
                      <span>Cata-Treco</span>
                    </div>
                    <div className="font-bold text-slate-100">{item.cataTrecoDiaSemana}</div>
                    <div className="text-[10px] text-slate-400">Móveis e madeiras</div>
                  </div>
                </div>

                {item.observacoes && (
                  <p className="text-[11px] text-slate-400 bg-slate-900/40 p-2 rounded-lg flex items-start space-x-1.5">
                    <Info className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item.observacoes}</span>
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
