import React from 'react';
import { 
  Flame, 
  Briefcase, 
  HeartPulse, 
  ChevronRight, 
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { ProdutoMercado, VagaPAT, TelefoneUtil, NoticiaLocal, FarmaciaPlantao } from '../types';
import { formatCurrency, formatTimeAgo, generatePhoneCallLink } from '../utils/formatters';
import { TabType } from './BottomNav';

interface HomeViewProps {
  onNavigate: (tab: TabType) => void;
  mercados: ProdutoMercado[];
  vagas: VagaPAT[];
  telefones: TelefoneUtil[];
  noticias: NoticiaLocal[];
  farmacias: FarmaciaPlantao[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  mercados,
  vagas,
  telefones: _telefones,
  noticias,
  farmacias,
}) => {
  const ofertasDestaque = mercados.filter(m => m.destaque).slice(0, 3);
  const vagasUrgentes = vagas.filter(v => v.vagaUrgente || true).slice(0, 3);
  const farmaciaPlantaoHoje = farmacias.find(f => f.hojePlantao) || farmacias[0];

  return (
    <div className="space-y-5 pb-6">
      {/* Banner de Boas-Vindas & Plantão de Saúde */}
      <section className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs text-emerald-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guia Oficial Comunitário</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Sertãozinho em Tempo Real
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
            Economia de mercado, vagas abertas no PAT, contatos de emergência e notícias em um só lugar. Sem login, 100% gratuito.
          </p>

          {/* Plantão da Farmácia Hoje */}
          {farmaciaPlantaoHoje && (
            <div className="pt-2">
              <div className="bg-slate-950/70 border border-emerald-600/30 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase text-emerald-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Farmácia de Plantão Hoje</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white">
                      {farmaciaPlantaoHoje.farmacia}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {farmaciaPlantaoHoje.endereco}
                    </div>
                  </div>
                </div>
                <a
                  href={generatePhoneCallLink(farmaciaPlantaoHoje.telefone)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 transition-colors"
                >
                  Ligar
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Discagem Rápida de Emergência (1 Toque) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Emergências Rápidas (1 Toque)</span>
          </h3>
          <button
            onClick={() => onNavigate('guia')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-0.5"
          >
            <span>Ver todos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { nome: 'Samu', num: '192', cor: 'bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25' },
            { nome: 'Bombeiros', num: '193', cor: 'bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25' },
            { nome: 'GCM', num: '199', cor: 'bg-blue-500/15 border-blue-500/30 text-blue-400 hover:bg-blue-500/25' },
            { nome: 'Saae Água', num: '0800', link: 'tel:08007711195', cor: 'bg-teal-500/15 border-teal-500/30 text-teal-400 hover:bg-teal-500/25' },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.link || `tel:${item.num}`}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-transform active:scale-95 text-center ${item.cor}`}
            >
              <span className="text-base font-black tracking-tight">{item.num}</span>
              <span className="text-[10px] font-medium text-slate-300 truncate w-full mt-0.5">{item.nome}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Ofertas em Destaque nos Mercados */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Melhores Ofertas nos Mercados</span>
          </h3>
          <button
            onClick={() => onNavigate('mercados')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-0.5"
          >
            <span>Ver todas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {ofertasDestaque.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                    {item.mercado}
                  </span>
                  <span className="text-[10px] text-slate-400">Até {item.validoAte.split('-').slice(1).reverse().join('/')}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-100 line-clamp-1">
                  {item.produto}
                </h4>
              </div>

              <div className="pt-2 flex items-baseline justify-between">
                <div>
                  <span className="text-base font-extrabold text-emerald-400">
                    {formatCurrency(item.preco)}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">/ {item.unidade}</span>
                </div>
                {item.precoOriginal && (
                  <span className="text-[11px] text-slate-500 line-through">
                    {formatCurrency(item.precoOriginal)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vagas em Destaque no PAT */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span>Oportunidades de Emprego (PAT)</span>
          </h3>
          <button
            onClick={() => onNavigate('vagas')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-0.5"
          >
            <span>Ver {vagas.length} vagas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {vagasUrgentes.map((vaga) => (
            <div
              key={vaga.id}
              className="bg-slate-900 border border-slate-800/90 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition-colors"
            >
              <div className="space-y-0.5 pr-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white">{vaga.cargo}</span>
                  {vaga.vagaUrgente && (
                    <span className="text-[9px] font-black uppercase bg-red-500/20 text-red-300 border border-red-500/30 px-1.5 py-0.2 rounded">
                      Urgente
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  {vaga.setor} • {vaga.quantidade} {vaga.quantidade > 1 ? 'vagas' : 'vaga'}
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  {vaga.salarioOuBeneficios}
                </div>
              </div>

              <button
                onClick={() => onNavigate('vagas')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg shrink-0 transition-colors flex items-center space-x-1"
              >
                <span>Detalhes</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Principais Notícias de Sertãozinho */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Últimas Notícias da Cidade</span>
          </h3>
          <button
            onClick={() => onNavigate('noticias')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-0.5"
          >
            <span>Ver mais</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {noticias.slice(0, 2).map((noticia) => (
            <a
              key={noticia.id}
              href={noticia.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex space-x-3 hover:border-slate-700 transition-colors group block"
            >
              {noticia.imagemUrl && (
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                  <img
                    src={noticia.imagemUrl}
                    alt={noticia.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex-1 space-y-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                    <span className="font-semibold text-emerald-400">{noticia.fonte}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(noticia.data)}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-2 mt-0.5">
                    {noticia.titulo}
                  </h4>
                </div>
                <div className="flex items-center text-[11px] text-slate-400 space-x-1 group-hover:text-slate-300">
                  <span>Ler na fonte</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
