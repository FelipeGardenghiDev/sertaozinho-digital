import React, { useState, useMemo } from 'react';
import { ShoppingBag, ArrowUpDown, Filter, ExternalLink, Calendar, CheckCircle, Calculator } from 'lucide-react';
import { ProdutoMercado } from '../types';
import { formatCurrency, formatShortDate } from '../utils/formatters';

interface MercadosViewProps {
  mercados: ProdutoMercado[];
  searchQuery: string;
  onOpenCalculadora: () => void;
}

export const MercadosView: React.FC<MercadosViewProps> = ({ mercados, searchQuery, onOpenCalculadora }) => {
  const [selectedMercado, setSelectedMercado] = useState<string>('todos');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todas');
  const [sortBy, setSortBy] = useState<'menor-preco' | 'maior-desconto'>('menor-preco');

  const mercadosList = ['todos', 'Savegnago', 'Gricki', 'Copercana', 'Paulistão'];
  const categoriasList = ['todas', 'Cesta Básica', 'Açougue', 'Hortifruti', 'Bebidas', 'Limpeza & Casa'];

  const filteredItems = useMemo(() => {
    return mercados
      .filter((item) => {
        const matchesSearch =
          searchQuery === '' ||
          item.produto.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.mercado.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesMercado =
          selectedMercado === 'todos' || item.mercado === selectedMercado;

        const matchesCategoria =
          selectedCategoria === 'todas' || item.categoria === selectedCategoria;

        return matchesSearch && matchesMercado && matchesCategoria;
      })
      .sort((a, b) => {
        if (sortBy === 'menor-preco') {
          return a.preco - b.preco;
        } else {
          const discountA = a.precoOriginal ? (a.precoOriginal - a.preco) / a.precoOriginal : 0;
          const discountB = b.precoOriginal ? (b.precoOriginal - b.preco) / b.precoOriginal : 0;
          return discountB - discountA;
        }
      });
  }, [mercados, searchQuery, selectedMercado, selectedCategoria, sortBy]);

  return (
    <div className="space-y-4 pb-12">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <span>Comparador de Preços e Ofertas</span>
          </h2>
          <p className="text-xs text-slate-400">
            Encartes e ofertas ativas em Sertãozinho/SP (Savegnago, Gricki, Copercana e Paulistão)
          </p>
        </div>

        {/* Ordenador */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-emerald-500 outline-none"
          >
            <option value="menor-preco">Menor Preço</option>
            <option value="maior-desconto">Maior Economia (%)</option>
          </select>
        </div>
      </div>

      {/* Botão Chamada da Calculadora */}
      <button
        onClick={onOpenCalculadora}
        className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold p-3.5 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-950/60 transition-all active:scale-95 cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <span className="text-xs sm:text-sm font-black block">Calculadora da Cesta Básica</span>
            <span className="text-[11px] text-emerald-100 font-medium">Monte sua lista e descubra onde fica mais barato</span>
          </div>
        </div>
        <span className="text-xs bg-emerald-950/60 text-emerald-200 border border-emerald-400/30 px-3 py-1.5 rounded-xl shrink-0 font-bold">
          Calcular Agora
        </span>
      </button>

      {/* Filtro por Supermercado */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {mercadosList.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMercado(m)}
            className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              selectedMercado === m
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {m === 'todos' ? 'Todos os Mercados' : m}
          </button>
        ))}
      </div>

      {/* Filtro por Categoria */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categoriasList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategoria(cat)}
            className={`text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
              selectedCategoria === cat
                ? 'bg-slate-700 text-emerald-300 font-medium border border-emerald-500/40'
                : 'bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'todas' ? 'Todas Categorias' : cat}
          </button>
        ))}
      </div>

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
            <Filter className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">Nenhum produto encontrado</p>
            <p className="text-xs text-slate-500">Tente buscar por outro termo ou limpe os filtros.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const hasDiscount = item.precoOriginal && item.precoOriginal > item.preco;
            const discountPercent = hasDiscount
              ? Math.round(((item.precoOriginal! - item.preco) / item.precoOriginal!) * 100)
              : 0;

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-600/40 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-800/50 px-2 py-0.5 rounded-lg">
                      {item.mercado}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Até {formatShortDate(item.validoAte)}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.categoria}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {item.produto}
                    </h3>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-end justify-between">
                  <div>
                    {hasDiscount && (
                      <div className="flex items-center space-x-1.5 mb-0.5">
                        <span className="text-[11px] text-slate-500 line-through">
                          {formatCurrency(item.precoOriginal!)}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">
                          -{discountPercent}%
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline space-x-1">
                      <span className="text-xl font-black text-emerald-400">
                        {formatCurrency(item.preco)}
                      </span>
                      <span className="text-xs text-slate-400">/ {item.unidade}</span>
                    </div>
                  </div>

                  {item.linkEncarte && (
                    <a
                      href={item.linkEncarte}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-[11px] font-medium text-slate-400 hover:text-emerald-400 transition-colors p-1"
                      title="Ver encarte do mercado"
                    >
                      <span>Encarte</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-slate-950/70 border border-slate-800/60 rounded-xl p-3 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Preços e encartes apurados semanalmente em Sertãozinho. Sujeito à disponibilidade nos pontos de venda.</span>
      </div>
    </div>
  );
};
