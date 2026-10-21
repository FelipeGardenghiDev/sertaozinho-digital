import React, { useState } from 'react';
import { X, Landmark, Bus, PhoneCall, MessageSquare, MapPin } from 'lucide-react';
import cpData from '../data/cruz-das-posses.json';
import { InfoCruzDasPosses } from '../types';
import { generatePhoneCallLink, generateWhatsAppLink } from '../utils/formatters';

interface CruzDasPossesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTransporte: () => void;
}

export const CruzDasPossesModal: React.FC<CruzDasPossesModalProps> = ({
  isOpen,
  onClose,
  onOpenTransporte,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('todas');

  if (!isOpen) return null;

  const items = cpData as InfoCruzDasPosses[];
  const categorias = ['todas', 'Serviços', 'Saúde', 'Transporte', 'História'];

  const filteredItems = items.filter((item) => {
    if (selectedCat === 'todas') return true;
    return item.categoria === selectedCat;
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
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-950/80">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Distrito de Cruz das Posses</h3>
            <p className="text-xs text-amber-300 font-medium">
              Guia oficial de serviços, saúde e transporte do distrito
            </p>
          </div>
        </div>

        {/* Banner de Boas-Vindas */}
        <div className="bg-gradient-to-r from-amber-950/60 to-slate-900 p-3 rounded-2xl border border-amber-600/30 text-xs text-slate-300 leading-relaxed">
          O distrito de <strong>Cruz das Posses</strong> conta com atendimento descentralizado da Prefeitura de Sertãozinho, unidade de saúde própria e linha de ônibus direta.
        </div>

        {/* Filtros */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'todas' ? 'Todos os Tópicos' : cat}
            </button>
          ))}
        </div>

        {/* Lista de Serviços de Cruz das Posses */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  {item.categoria}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{item.titulo}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.descricao}</p>
              </div>

              {item.endereco && (
                <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{item.endereco}</span>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                {item.telefone && (
                  <a
                    href={generatePhoneCallLink(item.telefone)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-1.5 px-3 rounded-xl flex items-center justify-center space-x-1 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Ligar ({item.telefone})</span>
                  </a>
                )}

                {item.whatsapp && (
                  <a
                    href={generateWhatsAppLink(item.whatsapp, 'Olá, gostaria de informações sobre os serviços em Cruz das Posses.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold py-1.5 px-3 rounded-xl flex items-center justify-center space-x-1 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {item.categoria === 'Transporte' && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTransporte();
                    }}
                    className="flex-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold py-1.5 px-3 rounded-xl flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Bus className="w-3.5 h-3.5" />
                    <span>Ver Tabela de Horários</span>
                  </button>
                )}
              </div>
            </div>
          ))}
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
