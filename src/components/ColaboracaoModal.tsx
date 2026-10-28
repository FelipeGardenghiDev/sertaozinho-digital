import React, { useState } from 'react';
import { X, Send, HeartHandshake, Tag, Music, Briefcase, HelpCircle, CheckCircle } from 'lucide-react';
import { SugestaoColaboracao } from '../types';
import { generateWhatsAppLink } from '../utils/formatters';

interface ColaboracaoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColaboracaoModal: React.FC<ColaboracaoModalProps> = ({ isOpen, onClose }) => {
  const [tipo, setTipo] = useState<'oferta' | 'artista' | 'vaga' | 'utilidade'>('oferta');
  const [titulo, setTitulo] = useState('');
  const [detalhes, setDetalhes] = useState('');
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [enviadoSucesso, setEnviadoSucesso] = useState(false);

  if (!isOpen) return null;

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !detalhes.trim()) return;

    // Criar payload da sugestão
    const novaSugestao: SugestaoColaboracao = {
      id: `sug-${Date.now()}`,
      tipo,
      titulo: titulo.trim(),
      detalhes: detalhes.trim(),
      contatoNome: nome.trim() || undefined,
      contatoWhatsapp: whatsapp.trim() || undefined,
      dataEnvio: new Date().toISOString()
    };

    // Salvar localmente no histórico de colaborações
    try {
      const salvas = JSON.parse(localStorage.getItem('stz_colaboracoes') || '[]');
      salvas.unshift(novaSugestao);
      localStorage.setItem('stz_colaboracoes', JSON.stringify(salvas.slice(0, 20)));
    } catch {
      // ignore
    }

    // Gerar link formatado para envio direto via WhatsApp para curadoria
    const tipoLabel = {
      oferta: '🛒 Oferta de Supermercado',
      artista: '🎸 Divulgação de Artista/Show',
      vaga: '💼 Vaga de Emprego',
      utilidade: '💡 Telefone Útil / Serviço'
    }[tipo];

    const mensagem = `Olá, Sertãozinho Digital! Gostaria de colaborar:\n\n*Tipo:* ${tipoLabel}\n*Título:* ${titulo.trim()}\n*Detalhes:* ${detalhes.trim()}${nome ? `\n*Enviado por:* ${nome.trim()}` : ''}${whatsapp ? `\n*Contato:* ${whatsapp.trim()}` : ''}`;

    const waLink = generateWhatsAppLink('16997001200', mensagem);
    
    // Tenta abrir o WhatsApp
    window.open(waLink, '_blank');

    setEnviadoSucesso(true);
    setTimeout(() => {
      setEnviadoSucesso(false);
      setTitulo('');
      setDetalhes('');
      setNome('');
      setWhatsapp('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-emerald-600/40 rounded-3xl w-full max-w-lg p-5 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/80">
            <HeartHandshake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Canal Cidadão • Colabore</h3>
            <p className="text-xs text-emerald-400 font-medium">
              Envie ofertas, shows de bandas ou novas vagas para a comunidade
            </p>
          </div>
        </div>

        {enviadoSucesso ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">Colaboração enviada com sucesso!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Obrigado por ajudar a manter o Sertãozinho Digital atualizado. Sua sugestão foi encaminhada para curadoria.
            </p>
          </div>
        ) : (
          <form onSubmit={handleEnviar} className="space-y-4">
            {/* Seletor de Tipo */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">O que você gostaria de enviar?</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTipo('oferta')}
                  className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                    tipo === 'oferta'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Tag className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span className="text-xs">Oferta de Mercado</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTipo('artista')}
                  className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                    tipo === 'artista'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Music className="w-4 h-4 shrink-0 text-purple-400" />
                  <span className="text-xs">Músico / Show</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTipo('vaga')}
                  className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                    tipo === 'vaga'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Briefcase className="w-4 h-4 shrink-0 text-amber-400" />
                  <span className="text-xs">Vaga de Emprego</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTipo('utilidade')}
                  className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                    tipo === 'utilidade'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 shrink-0 text-sky-400" />
                  <span className="text-xs">Outro Serviço Útil</span>
                </button>
              </div>
            </div>

            {/* Campo Título */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {tipo === 'oferta' && 'Produto e Supermercado (ex: Arroz 5kg no Savegnago)'}
                {tipo === 'artista' && 'Nome da Banda / Artista (ex: Banda X - Show Sexta)'}
                {tipo === 'vaga' && 'Cargo ou Oportunidade (ex: Soldador TIG na Empresa Y)'}
                {tipo === 'utilidade' && 'Nome do Serviço / Telefone (ex: Chaveiro 24h)'}
              </label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Preço mais barato encontrado, local do show..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Campo Detalhes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Detalhes (preço R$, horário do show, endereço ou como se candidatar):
              </label>
              <textarea
                required
                rows={3}
                value={detalhes}
                onChange={(e) => setDetalhes(e.target.value)}
                placeholder="Descreva as informações para conferência da curadoria comunitária..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Contato Opcional */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Seu Nome (opcional)</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome ou apelido"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">WhatsApp (opcional)</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(16) 9..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs shadow-lg shadow-emerald-950/80 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Sugestão via WhatsApp & Salvar</span>
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-2">
                100% colaborativo e gratuito. Nenhuma taxa é cobrada para divulgar artistas ou comércios locais.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
