/**
 * Scraper & Aggregator Automático Real para Sertãozinho Digital
 * Coleta notícias recentes diretamente do portal oficial da Prefeitura de Sertãozinho/SP.
 * Executado localmente com `npm run scrape` ou no GitHub Actions via Cron Job.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOTICIAS_PATH = path.resolve(__dirname, '../src/data/noticias.json');

function toSentenceCase(str) {
  if (!str) return '';
  const cleaned = str.trim().toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function detectCategory(title, summary) {
  const combined = (title + ' ' + summary).toLowerCase();
  if (combined.includes('saúde') || combined.includes('vacina') || combined.includes('upa') || combined.includes('dengue')) {
    return 'Saúde';
  }
  if (combined.includes('cultura') || combined.includes('show') || combined.includes('música') || combined.includes('teatro') || combined.includes('feira')) {
    return 'Cultura';
  }
  if (combined.includes('economia') || combined.includes('emprego') || combined.includes('pat') || combined.includes('curso') || combined.includes('empresa')) {
    return 'Economia';
  }
  if (combined.includes('polícia') || combined.includes('guarda') || combined.includes('gcm') || combined.includes('segurança')) {
    return 'Policial';
  }
  return 'Cidade';
}

function getCategoryImage(category) {
  switch (category) {
    case 'Saúde':
      return 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80';
    case 'Economia':
      return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80';
    case 'Cultura':
      return 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&auto=format&fit=crop&q=80';
    case 'Policial':
      return 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=800&auto=format&fit=crop&q=80';
    default:
      return 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80';
  }
}

async function scrapeAndSync() {
  console.log('🌿 [Sertãozinho Digital] Iniciando rotina de agregação cívica...');

  let existingNoticias = [];
  try {
    if (fs.existsSync(NOTICIAS_PATH)) {
      const rawData = fs.readFileSync(NOTICIAS_PATH, 'utf-8');
      existingNoticias = JSON.parse(rawData);
    }
  } catch (err) {
    console.warn('⚠️ Não foi possível ler notícias existentes:', err.message);
  }

  const scrapedItems = [];

  try {
    console.log('📡 Acessando portal da Prefeitura de Sertãozinho (sertaozinho.sp.gov.br)...');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch('https://www.sertaozinho.sp.gov.br', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SertaozinhoDigital-Bot/1.0 (+https://felipegardenghidev.github.io/sertaozinho-digital/)'
      }
    });
    clearTimeout(timeout);

    if (res.ok) {
      const html = await res.text();
      // Regex para encontrar links de notícias
      const regex = /<a\s+[^>]*href=["']([^"']*(?:noticia|portal\/noticias)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let match;

      while ((match = regex.exec(html)) !== null) {
        const rawUrl = match[1];
        const rawContent = match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

        if (rawContent.length > 25) {
          // Extrair título e resumo do texto do card
          let title = rawContent;
          let summary = '';

          // O padrão da prefeitura frequentemente contém: "TÍTULO... DD MÊS AAAA Resumo... Continuar lendo"
          const dateMatch = rawContent.match(/(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})/i);
          if (dateMatch && dateMatch.index > 5) {
            title = rawContent.slice(0, dateMatch.index).trim();
            summary = rawContent.slice(dateMatch.index + dateMatch[0].length).replace(/Continuar lendo.*$/i, '').trim();
          }

          // Limpar caracteres excessivos de reticências
          title = title.replace(/\.{2,}$/, '').trim();
          if (title.length > 80 && title === title.toUpperCase()) {
            title = toSentenceCase(title);
          }

          const fullUrl = rawUrl.startsWith('http') ? rawUrl : 'https://www.sertaozinho.sp.gov.br' + rawUrl;
          const category = detectCategory(title, summary);

          if (!scrapedItems.some(item => item.url === fullUrl || item.titulo === title)) {
            scrapedItems.push({
              id: `not-stz-${Date.now()}-${scrapedItems.length}`,
              titulo: title,
              resumo: summary || 'Acesse a matéria completa no portal oficial do Governo Municipal de Sertãozinho.',
              fonte: 'Prefeitura de Sertãozinho',
              url: fullUrl,
              categoria: category,
              data: new Date().toISOString(),
              imagemUrl: getCategoryImage(category)
            });
          }
        }
      }

      console.log(`✅ Coletadas com sucesso ${scrapedItems.length} matérias recentes do portal oficial!`);
    } else {
      console.warn(`⚠️ Portal retornou status HTTP ${res.status}`);
    }
  } catch (err) {
    console.warn(`⚠️ Não foi possível obter dados ao vivo (${err.message}). Mantendo base local.`);
  }

  // Mesclar dados raspados com notícias existentes preservando histórico
  const merged = [...scrapedItems];
  for (const existing of existingNoticias) {
    if (!merged.some(m => m.url === existing.url || m.titulo === existing.titulo)) {
      merged.push(existing);
    }
  }

  // Ordenar por data (mais recente primeiro) e limitar a 20 notícias
  merged.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  const finalList = merged.slice(0, 20);

  fs.writeFileSync(NOTICIAS_PATH, JSON.stringify(finalList, null, 2), 'utf-8');
  console.log(`🎉 Base de notícias atualizada com ${finalList.length} matérias salvas em ${NOTICIAS_PATH}!`);
}

scrapeAndSync();
