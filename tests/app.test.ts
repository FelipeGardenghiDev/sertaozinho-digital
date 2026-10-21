import { describe, it, expect } from 'vitest';
import { formatCurrency, formatTimeAgo, generateWhatsAppLink, generatePhoneCallLink, formatShortDate } from '../src/utils/formatters';
import mercadosData from '../src/data/mercados.json';
import vagasData from '../src/data/vagas-pat.json';
import telefonesData from '../src/data/telefones-uteis.json';
import noticiasData from '../src/data/noticias.json';
import artistasData from '../src/data/artistas.json';

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
    
    // Verifica presença obrigatória dos órgãos vitais da cidade
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
