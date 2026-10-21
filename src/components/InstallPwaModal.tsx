import React from 'react';
import { Download, X, Smartphone, CheckCircle, Share2 } from 'lucide-react';

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  canInstall: boolean;
}

export const InstallPwaModal: React.FC<InstallPwaModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  canInstall,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
      <div className="bg-slate-900 border border-emerald-600/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/80">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Instalar no Celular</h3>
            <p className="text-xs text-emerald-400 font-medium">Sertãozinho Digital como App</p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-300 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Acesso em 1 toque direto na tela inicial</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Abre instantâneo mesmo sem internet (offline)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Pesa menos de 2MB (não enche a memória)</span>
          </div>
        </div>

        <div className="space-y-2">
          {canInstall ? (
            <button
              onClick={onInstall}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Instalar Aplicativo Agora</span>
            </button>
          ) : (
            <div className="text-xs text-slate-400 text-center space-y-1">
              <p className="font-semibold text-slate-300">Como instalar no seu navegador:</p>
              <p className="text-[11px] leading-relaxed">
                Toque no botão de menu do seu navegador (três pontinhos ou <Share2 className="w-3 h-3 inline text-emerald-400" /> compartilhar) e selecione <strong>"Adicionar à Tela Inicial"</strong> ou <strong>"Instalar Aplicativo"</strong>.
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Continuar no navegador
          </button>
        </div>
      </div>
    </div>
  );
};
