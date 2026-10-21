import React, { useState } from 'react';
import { X, Bus, Clock, MapPin, PhoneCall, MessageSquare } from 'lucide-react';
import onibusData from '../data/onibus.json';
import { LinhaOnibus, PontoTransporte } from '../types';
import { formatCurrency, generatePhoneCallLink, generateWhatsAppLink } from '../utils/formatters';

interface TransporteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransporteModal: React.FC<TransporteModalProps> = ({ isOpen, onClose }) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'onibus' | 'taxis'>('onibus');
  const [selectedDia, setSelectedDia] = useState<'seg-sex' | 'sab' | 'dom'>('seg-sex');
  const [selectedLinhaTipo, setSelectedLinhaTipo] = useState<string>('todos');

  if (!isOpen) return null;

  const linhas = onibusData.linhas as LinhaOnibus[];
  const pontos = onibusData.pontos as PontoTransporte[];

  const filteredLinhas = linhas.filter((l) => {
    if (selectedLinhaTipo === 'todos') return true;
    return l.tipo.includes(selectedLinhaTipo);
  });

  const getHorariosAtuais = (linha: LinhaOnibus) => {
    switch (selectedDia) {
      case 'seg-sex':
        return linha.horariosSegundaSexta;
      case 'sab':
        return linha.horariosSabado;
      case 'dom':
        return linha.horariosDomingoFeriado;
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
            <Bus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Transporte & Mobilidade</h3>
            <p className="text-xs text-emerald-400 font-medium">
              Horários de Ônibus (Ribeirão, Bairros e Cruz das Posses) e Táxis
            </p>
          </div>
        </div>

        {/* Abas Superiores: Ônibus vs Táxis */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedSubTab('onibus')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedSubTab === 'onibus'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Horários de Ônibus
          </button>
          <button
            onClick={() => setSelectedSubTab('taxis')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedSubTab === 'taxis'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pontos de Táxi & Moto-Táxi
          </button>
        </div>

        {selectedSubTab === 'onibus' ? (
          <div className="space-y-3">
            {/* Seletor de Dia da Semana */}
            <div className="flex items-center justify-between text-xs bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 pl-2">Dia da semana:</span>
              <div className="flex space-x-1">
                {[
                  { id: 'seg-sex' as const, label: 'Segunda a Sexta' },
                  { id: 'sab' as const, label: 'Sábado' },
                  { id: 'dom' as const, label: 'Domingo/Feriado' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDia(d.id)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg transition-all ${
                      selectedDia === d.id
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por tipo de linha */}
            <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'todos', label: 'Todas as Linhas' },
                { id: 'Ribeirão', label: 'Sertãozinho ⇄ Ribeirão Preto' },
                { id: 'Bairros', label: 'Circulares de Bairro' },
                { id: 'Cruz das Posses', label: 'Distrito Cruz das Posses' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedLinhaTipo(f.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                    selectedLinhaTipo === f.id
                      ? 'bg-slate-700 text-emerald-300 font-medium border border-emerald-500/40'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Lista de Linhas e Horários */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {filteredLinhas.map((linha) => {
                const horarios = getHorariosAtuais(linha);
                return (
                  <div
                    key={linha.id}
                    className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                            {linha.codigoLinha}
                          </span>
                          <span className="text-xs text-slate-400">{linha.tipo}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">
                          {linha.nomeLinha}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-emerald-400">
                          {formatCurrency(linha.tarifa)}
                        </span>
                        <p className="text-[10px] text-slate-400">Tarifa</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 flex items-start space-x-1.5 leading-relaxed bg-slate-900/60 p-2 rounded-xl">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{linha.itinerarioResumo}</span>
                    </p>

                    {/* Horários de Saída */}
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>Horários de Partida ({horarios.length} saídas):</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {horarios.map((h, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-semibold bg-slate-900 border border-slate-700/80 text-slate-200 px-2 py-1 rounded-lg"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Lista de Pontos de Táxi e Moto-Táxi */
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {pontos.map((ponto) => (
              <div
                key={ponto.id}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{ponto.nome}</span>
                    {ponto.atendimento24h && (
                      <span className="text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        24 Horas
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{ponto.endereco}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={generatePhoneCallLink(ponto.telefone)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-1.5 px-3 rounded-xl flex items-center space-x-1 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Ligar</span>
                  </a>
                  {ponto.whatsapp && (
                    <a
                      href={generateWhatsAppLink(ponto.whatsapp, 'Olá, gostaria de solicitar uma corrida por favor.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold py-1.5 px-3 rounded-xl flex items-center space-x-1 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

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
