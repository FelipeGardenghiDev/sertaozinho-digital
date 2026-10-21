import React, { useState, useMemo } from 'react';
import { X, Calculator, Check, TrendingDown } from 'lucide-react';
import { ProdutoMercado } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CalculadoraEconomiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mercados: ProdutoMercado[];
}

export const CalculadoraEconomiaModal: React.FC<CalculadoraEconomiaModalProps> = ({
  isOpen,
  onClose,
  mercados,
}) => {
  // Lista padrão de produtos da cesta básica para seleção
  const produtosDisponiveis = useMemo(() => {
    // Agrupa nomes de produtos similares para o morador escolher
    const nomes = Array.from(new Set(mercados.map((m) => m.produto)));
    return nomes;
  }, [mercados]);

  const [selectedProdutos, setSelectedProdutos] = useState<string[]>([
    produtosDisponiveis[0] || 'Arroz Branco Tipo 1 5kg',
    produtosDisponiveis[1] || 'Feijão Carioca Tipo 1 1kg',
    produtosDisponiveis[2] || 'Óleo de Soja 900ml',
    produtosDisponiveis[3] || 'Tomate Italiano Fresco',
  ]);

  const toggleProduto = (nome: string) => {
    if (selectedProdutos.includes(nome)) {
      if (selectedProdutos.length > 1) {
        setSelectedProdutos(selectedProdutos.filter((p) => p !== nome));
      }
    } else {
      setSelectedProdutos([...selectedProdutos, nome]);
    }
  };

  // Calcula o total da cesta selecionada por mercado
  const comparativoPorMercado = useMemo(() => {
    const redes = ['Savegnago', 'Gricki', 'Copercana', 'Paulistão'] as const;

    const resultados = redes.map((rede) => {
      let total = 0;
      let itensDisponiveis = 0;

      selectedProdutos.forEach((prodNome) => {
        // Encontra o preço no mercado ou estima pela média se não estiver em encarte direto
        const itemEncontrado = mercados.find((m) => m.mercado === rede && m.produto === prodNome);
        if (itemEncontrado) {
          total += itemEncontrado.preco;
          itensDisponiveis++;
        } else {
          // Preço médio referencial
          const outroItem = mercados.find((m) => m.produto === prodNome);
          const precoRef = outroItem ? outroItem.preco * 1.05 : 10;
          total += precoRef;
        }
      });

      return {
        mercado: rede,
        total,
        itensDisponiveis,
      };
    });

    // Ordena do mais barato para o mais caro
    resultados.sort((a, b) => a.total - b.total);

    const maisBarato = resultados[0];
    const maisCaro = resultados[resultados.length - 1];
    const economia = Math.max(0, maisCaro.total - maisBarato.total);
    const economiaPercentual = Math.round((economia / maisCaro.total) * 100);

    return {
      ranking: resultados,
      maisBarato,
      economia,
      economiaPercentual,
    };
  }, [mercados, selectedProdutos]);

  if (!isOpen) return null;

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
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Calculadora da Cesta Básica</h3>
            <p className="text-xs text-emerald-400 font-medium">
              Compare onde a sua compra fica mais barata em Sertãozinho
            </p>
          </div>
        </div>

        {/* Seleção de Produtos */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>1. Selecione os itens da sua lista ({selectedProdutos.length}):</span>
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800">
            {produtosDisponiveis.map((prod) => {
              const isSelected = selectedProdutos.includes(prod);
              return (
                <button
                  key={prod}
                  onClick={() => toggleProduto(prod)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all text-left ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  <span className="truncate max-w-[200px]">{prod}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card do Vencedor (Mais Barato) */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/50 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs text-emerald-300 font-bold uppercase tracking-wider">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>Opção Mais Econômica Hoje:</span>
            </div>
            <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
              Economia de até {comparativoPorMercado.economiaPercentual}%
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-lg font-black text-white">
                {comparativoPorMercado.maisBarato.mercado}
              </span>
              <p className="text-[11px] text-slate-400">Total estimado da sua lista</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">
                {formatCurrency(comparativoPorMercado.maisBarato.total)}
              </span>
              {comparativoPorMercado.economia > 0 && (
                <p className="text-[11px] text-emerald-300 font-medium">
                  Você economiza {formatCurrency(comparativoPorMercado.economia)}!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Comparativo Completo entre os 4 Mercados */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            2. Comparativo Geral por Supermercado:
          </label>
          <div className="space-y-2">
            {comparativoPorMercado.ranking.map((item, idx) => {
              const isWinner = idx === 0;
              const diferenca = item.total - comparativoPorMercado.maisBarato.total;

              return (
                <div
                  key={item.mercado}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    isWinner
                      ? 'bg-emerald-950/40 border-emerald-600/50 shadow-sm'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isWinner ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-200">{item.mercado}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {diferenca > 0 && (
                      <span className="text-[10px] text-rose-400 font-medium">
                        +{formatCurrency(diferenca)}
                      </span>
                    )}
                    <span className={`text-sm font-extrabold ${isWinner ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs transition-colors"
        >
          Voltar para as Ofertas
        </button>
      </div>
    </div>
  );
};
