import React, { useState, useMemo } from 'react';
import { Briefcase, Building2, GraduationCap, MapPin, Send, AlertCircle, Info } from 'lucide-react';
import { VagaPAT } from '../types';
import { formatShortDate } from '../utils/formatters';

interface VagasPatViewProps {
  vagas: VagaPAT[];
  searchQuery: string;
}

export const VagasPatView: React.FC<VagasPatViewProps> = ({ vagas, searchQuery }) => {
  const [selectedSetor, setSelectedSetor] = useState<string>('todos');

  const setores = [
    'todos',
    'Metalurgia / Indústria',
    'Comércio & Vendas',
    'Serviços Gerais',
    'Logística',
  ];

  const filteredVagas = useMemo(() => {
    return vagas.filter((vaga) => {
      const matchesSearch =
        searchQuery === '' ||
        vaga.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vaga.setor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vaga.escolaridade.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSetor = selectedSetor === 'todos' || vaga.setor === selectedSetor;

      return matchesSearch && matchesSetor;
    });
  }, [vagas, searchQuery, selectedSetor]);

  return (
    <div className="space-y-4 pb-12">
      {/* Cabeçalho */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Vagas Abertas no PAT Sertãozinho</h2>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
            {filteredVagas.length} vagas
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Boletim atualizado do Posto de Atendimento ao Trabalhador (PAT / Poupatempo de Sertãozinho)
        </p>
      </div>

      {/* Cartão de Orientações do PAT */}
      <div className="bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-800/40 rounded-2xl p-3.5 space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-emerald-300 font-bold">
          <Info className="w-4 h-4 shrink-0" />
          <span>Como se candidatar às vagas:</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Compareça ao <strong>Poupatempo Sertãozinho</strong> (Rua José Bonini, 83) de segunda a sexta, das 08h às 16h, com <strong>RG, CPF e Carteira de Trabalho</strong> (física ou digital), ou utilize o aplicativo federal <strong>Emprega Brasil</strong>.
        </p>
      </div>

      {/* Filtro por Setor */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {setores.map((setor) => (
          <button
            key={setor}
            onClick={() => setSelectedSetor(setor)}
            className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              selectedSetor === setor
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {setor === 'todos' ? 'Todos os Setores' : setor}
          </button>
        ))}
      </div>

      {/* Lista de Vagas */}
      <div className="space-y-3">
        {filteredVagas.length === 0 ? (
          <div className="py-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
            <Briefcase className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">Nenhuma vaga encontrada</p>
            <p className="text-xs text-slate-500">Tente buscar por outro cargo ou selecione outro setor.</p>
          </div>
        ) : (
          filteredVagas.map((vaga) => (
            <div
              key={vaga.id}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-600/40 rounded-2xl p-4 space-y-3 transition-colors shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-base font-bold text-white">
                      {vaga.cargo}
                    </h3>
                    {vaga.vagaUrgente && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Contratação Imediata</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{vaga.setor}</span>
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-200">
                      {vaga.quantidade} {vaga.quantidade > 1 ? 'vagas abertas' : 'vaga aberta'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800/80 shrink-0">
                  {formatShortDate(vaga.dataPublicacao)}
                </span>
              </div>

              {/* Detalhes da Vaga */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <div className="space-y-1">
                  <div className="text-slate-400 flex items-center space-x-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    <span>Escolaridade:</span>
                  </div>
                  <div className="font-medium text-slate-200">{vaga.escolaridade}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400">Experiência:</div>
                  <div className="font-medium text-slate-200">{vaga.experienciaMinima}</div>
                </div>

                <div className="col-span-full pt-1 border-t border-slate-800/60 flex items-baseline justify-between">
                  <span className="text-slate-400">Remuneração:</span>
                  <span className="font-bold text-emerald-400">{vaga.salarioOuBeneficios}</span>
                </div>
              </div>

              {/* Como Candidatar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
                <div className="text-[11px] text-slate-400 flex items-start space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{vaga.comoCandidatar}</span>
                </div>

                <a
                  href="https://servicos.mte.gov.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shrink-0 transition-colors flex items-center justify-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Candidatar Online</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
