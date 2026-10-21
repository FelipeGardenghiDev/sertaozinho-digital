import React, { useState, useEffect } from 'react';
import { X, Bell, BellRing, CheckCircle, Send } from 'lucide-react';
import { requestNotificationPermission, checkNotificationPermission, sendLocalNotification } from '../utils/notifications';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [tested, setTested] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      checkNotificationPermission().then(setHasPermission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setHasPermission(granted);
    if (granted) {
      await sendLocalNotification(
        '🌿 Sertãozinho Digital Ativo!',
        'Notificações ativadas com sucesso. Você receberá avisos de vagas do PAT e alertas da cidade.'
      );
      setTested(true);
    }
  };

  const handleTestNotification = async () => {
    await sendLocalNotification(
      '💼 Nova Vaga no PAT Sertãozinho!',
      'Foram abertas vagas urgentes para Soldador e Comércio no Poupatempo.'
    );
    setTested(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-emerald-600/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Título */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/80">
            <BellRing className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Alertas no Celular</h3>
            <p className="text-xs text-emerald-400 font-medium">
              Notificações nativas locais (sem spam)
            </p>
          </div>
        </div>

        {/* Benefícios */}
        <div className="space-y-2 text-xs text-slate-300 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Avisos de novas vagas urgentes no PAT</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Comunicados de falta d'água ou chuvas fortes</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ofertas imperdíveis da semana nos mercados</span>
          </div>
        </div>

        {/* Botão de Ativação ou Status */}
        <div className="space-y-2 pt-1">
          {!hasPermission ? (
            <button
              onClick={handleRequestPermission}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 transition-all active:scale-95 text-xs"
            >
              <Bell className="w-4 h-4" />
              <span>Permitir Notificações no Aparelho</span>
            </button>
          ) : (
            <div className="space-y-2">
              <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-xl text-center text-xs text-emerald-300 font-bold flex items-center justify-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Alertas ativados neste dispositivo!</span>
              </div>

              <button
                onClick={handleTestNotification}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 text-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enviar Notificação de Teste</span>
              </button>
            </div>
          )}

          {tested && (
            <p className="text-[11px] text-center text-emerald-400 font-medium">
              Notificação enviada! Verifique a barra de status do seu celular.
            </p>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
