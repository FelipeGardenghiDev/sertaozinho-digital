import { describe, it, expect } from 'vitest';
import { formatCurrency, formatTimeAgo, generateWhatsAppLink, generatePhoneCallLink, formatShortDate } from '../src/utils/formatters';
import mercadosData from '../src/data/mercados.json';
import vagasData from '../src/data/vagas-pat.json';
import telefonesData from '../src/data/telefones-uteis.json';
import noticiasData from '../src/data/noticias.json';
import artistasData from '../src/data/artistas.json';
import onibusData from '../src/data/onibus.json';
import coletaData from '../src/data/coleta-lixo.json';
import cpData from '../src/data/cruz-das-posses.json';

describe('Sertãozinho Digital - Utilitários de Formatação', () => {
  it('formata valores monetários em Real (BRL) corretamente', () => {
    const formatted = formatCurrency(24.99);
    expect(formatted).toContain('24,99');
    expect(formatted).toMatch(/R\$\s*24,99/);
  });

  it('formata datas curtas corretamente (YYYY-MM-DD para DD/MM)', () => {
    expect(formatShortDate('2026-10-24')).toBe('24/10');
    expect(formatShortDate('2026-05-01')).toBe('01/05');
  });

  it('gera links válidos de WhatsApp com limpeza de caracteres', () => {
    const link = generateWhatsAppLink('(16) 99765-4321', 'Olá Sertãozinho');
    expect(link).toBe('https://wa.me/16997654321?text=Ol%C3%A1%20Sert%C3%A3ozinho');
  });

  it('gera links de discagem telefônica (tel:) limpos', () => {
    expect(generatePhoneCallLink('(16) 3946-9500')).toBe('tel:1639469500');
    expect(generatePhoneCallLink('0800-771-1195')).toBe('tel:08007711195');
    expect(generatePhoneCallLink('192')).toBe('tel:192');
  });

  it('calcula tempo relativo formatado adequadamente', () => {
    const nowIso = new Date().toISOString();
    expect(formatTimeAgo(nowIso)).toMatch(/min/);

    const pastDate = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
    expect(formatTimeAgo(pastDate)).toBe('Há 3h');
  });
});

describe('Sertãozinho Digital - Integridade dos Dados Cívicos', () => {
  it('valida estrutura dos dados de supermercados', () => {
    expect(mercadosData.length).toBeGreaterThan(0);
    mercadosData.forEach((item) => {
      expect(item.id).toBeDefined();
      expect(item.produto.length).toBeGreaterThan(2);
      expect(item.preco).toBeGreaterThan(0);
      expect(['Savegnago', 'Gricki', 'Copercana', 'Paulistão']).toContain(item.mercado);
      expect(item.unidade).toBeDefined();
    });
  });

  it('valida estrutura das vagas abertas no PAT', () => {
    expect(vagasData.length).toBeGreaterThan(0);
    vagasData.forEach((vaga) => {
      expect(vaga.id).toBeDefined();
      expect(vaga.cargo.length).toBeGreaterThan(2);
      expect(vaga.quantidade).toBeGreaterThanOrEqual(1);
      expect(vaga.comoCandidatar.length).toBeGreaterThan(5);
    });
  });

  it('valida telefones essenciais e de emergência de Sertãozinho', () => {
    expect(telefonesData.length).toBeGreaterThan(0);
    
    const telefonesStr = JSON.stringify(telefonesData);
    expect(telefonesStr).toContain('Samu');
    expect(telefonesStr).toContain('Bombeiros');
    expect(telefonesStr).toContain('Guarda Civil');
    expect(telefonesStr).toContain('Saae');
    expect(telefonesStr).toContain('UPA');
  });

  it('valida notícias locais agregadas com URLs válidas', () => {
    expect(noticiasData.length).toBeGreaterThan(0);
    noticiasData.forEach((noticia) => {
      expect(noticia.titulo.length).toBeGreaterThan(5);
      expect(noticia.url).toMatch(/^https?:\/\//);
      expect(noticia.fonte.length).toBeGreaterThan(1);
    });
  });

  it('valida catálogo cultural e músicos de Sertãozinho', () => {
    expect(artistasData.length).toBeGreaterThan(0);
    artistasData.forEach((artista) => {
      expect(artista.nome.length).toBeGreaterThan(2);
      expect(artista.estilo).toBeDefined();
    });
  });
});

describe('Sertãozinho Digital - Novas Funcionalidades (5 Melhorias)', () => {
  it('1. valida horários de ônibus (Sertãozinho ⇄ Ribeirão e Bairros)', () => {
    expect(onibusData.linhas.length).toBeGreaterThan(0);
    expect(onibusData.pontos.length).toBeGreaterThan(0);

    const linhaRibeirao = onibusData.linhas.find(l => l.codigoLinha === 'SUB-RP');
    expect(linhaRibeirao).toBeDefined();
    expect(linhaRibeirao?.horariosSegundaSexta.length).toBeGreaterThan(5);
    expect(linhaRibeirao?.tarifa).toBeGreaterThan(0);

    const linhaDistrito = onibusData.linhas.find(l => l.codigoLinha === 'LINHA-CP');
    expect(linhaDistrito).toBeDefined();
  });

  it('2. valida dados cívicos e serviços do Distrito de Cruz das Posses', () => {
    expect(cpData.length).toBeGreaterThan(0);
    const subprefeitura = cpData.find(item => item.titulo.includes('Subprefeitura'));
    expect(subprefeitura).toBeDefined();
    expect(subprefeitura?.telefone).toBeDefined();

    const ubs = cpData.find(item => item.categoria === 'Saúde');
    expect(ubs).toBeDefined();
  });

  it('3. simula algoritmo da Calculadora de Cesta Básica com economia real', () => {
    const selected = ['Arroz Branco Tipo 1 5kg', 'Feijão Carioca Tipo 1 1kg', 'Óleo de Soja 900ml'];
    
    // Calcula soma no Savegnago vs Copercana vs Gricki
    const precosSavegnago = mercadosData.filter(m => m.mercado === 'Savegnago' && selected.includes(m.produto));
    const precosGricki = mercadosData.filter(m => m.mercado === 'Gricki' && selected.includes(m.produto));
    
    expect(precosSavegnago.length).toBeGreaterThan(0);
    expect(precosGricki.length).toBeGreaterThan(0);

    const somaSavegnago = precosSavegnago.reduce((acc, curr) => acc + curr.preco, 0);
    expect(somaSavegnago).toBeGreaterThan(0);
  });

  it('4. valida calendário de Coleta de Lixo Seletiva e Cata-Treco por bairro', () => {
    expect(coletaData.length).toBeGreaterThan(0);

    const centro = coletaData.find(b => b.bairro === 'Centro');
    expect(centro).toBeDefined();
    expect(centro?.coletaComumDias).toContain('Segunda');
    expect(centro?.cataTrecoDiaSemana).toBeDefined();

    const alvorada = coletaData.find(b => b.bairro === 'Jardim Alvorada');
    expect(alvorada?.coletaSeletivaDias).toBeDefined();
  });

  it('5. valida interface de notificações do sistema', async () => {
    const { checkNotificationPermission } = await import('../src/utils/notifications');
    const hasPerm = await checkNotificationPermission();
    expect(typeof hasPerm).toBe('boolean');
  });
});
