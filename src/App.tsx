import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { MercadosView } from './components/MercadosView';
import { VagasPatView } from './components/VagasPatView';
import { TelefonesView } from './components/TelefonesView';
import { NoticiasView } from './components/NoticiasView';
import { CulturaView } from './components/CulturaView';
import { InstallPwaModal } from './components/InstallPwaModal';
import { CalculadoraEconomiaModal } from './components/CalculadoraEconomiaModal';
import { TransporteModal } from './components/TransporteModal';
import { ColetaLixoModal } from './components/ColetaLixoModal';
import { CruzDasPossesModal } from './components/CruzDasPossesModal';
import { NotificationModal } from './components/NotificationModal';
import { MapaCivicoModal } from './components/MapaCivicoModal';
import { ColaboracaoModal } from './components/ColaboracaoModal';

import mercadosData from './data/mercados.json';
import vagasData from './data/vagas-pat.json';
import telefonesData from './data/telefones-uteis.json';
import noticiasData from './data/noticias.json';
import artistasData from './data/artistas.json';
import farmaciasData from './data/farmacias.json';

import { ProdutoMercado, VagaPAT, TelefoneUtil, NoticiaLocal, ArtistaLocal, FarmaciaPlantao } from './types';
import { Download } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  // Modais das novas funcionalidades cívicas
  const [isCalculadoraOpen, setIsCalculadoraOpen] = useState(false);
  const [isTransporteOpen, setIsTransporteOpen] = useState(false);
  const [isColetaOpen, setIsColetaOpen] = useState(false);
  const [isCruzDasPossesOpen, setIsCruzDasPossesOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isMapaCivicoOpen, setIsMapaCivicoOpen] = useState(false);
  const [isColaboracaoOpen, setIsColaboracaoOpen] = useState(false);

  // Escuta evento de instalação de PWA
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setCanInstall(false);
      }
      setDeferredPrompt(null);
      setIsInstallModalOpen(false);
    } else {
      setIsInstallModalOpen(true);
    }
  };

  const getTabTitle = (tab: TabType): string => {
    switch (tab) {
      case 'home':
        return 'Página Inicial • Tudo sobre a Cidade';
      case 'mercados':
        return 'Comparador de Supermercados & Ofertas';
      case 'vagas':
        return 'Oportunidades de Emprego no PAT';
      case 'guia':
        return 'Telefones Úteis, Saúde e SOS 24h';
      case 'noticias':
        return 'Radar de Notícias e Diários Oficiais';
      case 'cultura':
        return 'Radar de Músicos, Shows & Artistas';
      default:
        return 'Sertãozinho Digital';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTabTitle={getTabTitle(activeTab)}
      />

      {/* Banner rápido para instalar PWA (caso disponível no mobile) */}
      {canInstall && (
        <div className="bg-emerald-950/80 border-b border-emerald-600/30 px-4 py-2 flex items-center justify-between text-xs max-w-4xl mx-auto w-full">
          <span className="text-emerald-300 font-medium">
            📱 Deseja usar o <strong>Sertãozinho Digital</strong> como aplicativo?
          </span>
          <button
            onClick={handleInstallClick}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0 ml-2 transition-colors text-[11px]"
          >
            <Download className="w-3 h-3" />
            <span>Instalar</span>
          </button>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-4">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            mercados={mercadosData as ProdutoMercado[]}
            vagas={vagasData as VagaPAT[]}
            telefones={telefonesData as TelefoneUtil[]}
            noticias={noticiasData as NoticiaLocal[]}
            farmacias={farmaciasData as FarmaciaPlantao[]}
            onOpenTransporte={() => setIsTransporteOpen(true)}
            onOpenCalculadora={() => setIsCalculadoraOpen(true)}
            onOpenColeta={() => setIsColetaOpen(true)}
            onOpenCruzDasPosses={() => setIsCruzDasPossesOpen(true)}
            onOpenNotificacoes={() => setIsNotificationModalOpen(true)}
            onOpenMapaCivico={() => setIsMapaCivicoOpen(true)}
            onOpenColaboracao={() => setIsColaboracaoOpen(true)}
          />
        )}

        {activeTab === 'mercados' && (
          <MercadosView
            mercados={mercadosData as ProdutoMercado[]}
            searchQuery={searchQuery}
            onOpenCalculadora={() => setIsCalculadoraOpen(true)}
          />
        )}

        {activeTab === 'vagas' && (
          <VagasPatView
            vagas={vagasData as VagaPAT[]}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'guia' && (
          <TelefonesView
            telefones={telefonesData as TelefoneUtil[]}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'noticias' && (
          <NoticiasView
            noticias={noticiasData as NoticiaLocal[]}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'cultura' && (
          <CulturaView
            artistas={artistasData as ArtistaLocal[]}
            searchQuery={searchQuery}
          />
        )}
      </main>

      {/* Barra de Navegação Inferior (Mobile-First) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        vagasCount={vagasData.length}
      />

      {/* Modais de Funcionalidades */}
      <InstallPwaModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstall={handleInstallClick}
        canInstall={canInstall}
      />

      <CalculadoraEconomiaModal
        isOpen={isCalculadoraOpen}
        onClose={() => setIsCalculadoraOpen(false)}
        mercados={mercadosData as ProdutoMercado[]}
      />

      <TransporteModal
        isOpen={isTransporteOpen}
        onClose={() => setIsTransporteOpen(false)}
      />

      <ColetaLixoModal
        isOpen={isColetaOpen}
        onClose={() => setIsColetaOpen(false)}
      />

      <CruzDasPossesModal
        isOpen={isCruzDasPossesOpen}
        onClose={() => setIsCruzDasPossesOpen(false)}
        onOpenTransporte={() => setIsTransporteOpen(true)}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      <MapaCivicoModal
        isOpen={isMapaCivicoOpen}
        onClose={() => setIsMapaCivicoOpen(false)}
      />

      <ColaboracaoModal
        isOpen={isColaboracaoOpen}
        onClose={() => setIsColaboracaoOpen(false)}
      />
    </div>
  );
};
