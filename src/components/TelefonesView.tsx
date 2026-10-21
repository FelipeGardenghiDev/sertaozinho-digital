import React, { useState, useMemo } from 'react';
import { PhoneCall, MessageSquare, MapPin, Clock, ShieldCheck, HeartPulse, Building, Wrench } from 'lucide-react';
import { TelefoneUtil } from '../types';
import { generatePhoneCallLink, generateWhatsAppLink } from '../utils/formatters';

interface TelefonesViewProps {
  telefones: TelefoneUtil[];
  searchQuery: string;
}

export const TelefonesView: React.FC<TelefonesViewProps> = ({ telefones, searchQuery }) => {
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todas');

  const categorias = [
    'todas',
    'Emergência',
    'Saúde',
    'Serviços Públicos',
    'Bancos',
    'SOS & Chaveiros 24h',
  ];

  const filteredTelefones = useMemo(() => {
    return telefones.filter((tel) => {
      const matchesSearch =
        searchQuery === '' ||
        tel.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tel.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tel.descricao && tel.descricao.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tel.endereco && tel.endereco.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategoria === 'todas' || tel.categoria === selectedCategoria;

      return matchesSearch && matchesCat;
    });
  }, [telefones, searchQuery, selectedCategoria]);

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case 'Emergência':
        return <ShieldCheck className="w-4 h-4 text-red-400" />;
      case 'Saúde':
        return <HeartPulse className="w-4 h-4 text-emerald-400" />;
      case 'Serviços Públicos':
      case 'Bancos':
        return <Building className="w-4 h-4 text-blue-400" />;
      default:
        return <Wrench className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Cabeçalho */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <PhoneCall className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Guia de Telefones & SOS Sertãozinho</h2>
        </div>
        <p className="text-xs text-slate-400">
          Contatos de emergência, saúde, bancos e serviços úteis com ligação e WhatsApp em 1 clique
        </p>
      </div>

      {/* Filtro por Categoria */}
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
            {cat === 'todas' ? 'Todos os Telefones' : cat}
          </button>
        ))}
      </div>

      {/* Lista de Contatos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredTelefones.map((tel) => (
          <div
            key={tel.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-colors shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                  {getCategoryIcon(tel.categoria)}
                  <span>{tel.categoria}</span>
                </div>
                {tel.plantao24h && (
                  <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    24 Horas
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-white tracking-tight">{tel.nome}</h3>
                {tel.descricao && (
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{tel.descricao}</p>
                )}
              </div>

              <div className="space-y-1 text-xs text-slate-400 pt-1">
                {tel.endereco && (
                  <div className="flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{tel.endereco}</span>
                  </div>
                )}
                {tel.horario && (
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{tel.horario}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ações em 1 Toque */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <a
                href={generatePhoneCallLink(tel.telefone)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Ligar ({tel.telefone})</span>
              </a>

              {tel.whatsapp && (
                <a
                  href={generateWhatsAppLink(tel.whatsapp, `Olá, encontrei seu contato pelo Sertãozinho Digital.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-950/80 border border-emerald-600/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors active:scale-95"
                  title="Chamar no WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
