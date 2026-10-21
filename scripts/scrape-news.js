/**
 * Scraper & Aggregator Automático para Sertãozinho Digital
 * Executado localmente com `npm run scrape` ou no GitHub Actions via Cron Job.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOTICIAS_PATH = path.resolve(__dirname, '../src/data/noticias.json');

async function scrapeAndSync() {
  console.log('🌿 [Sertãozinho Digital] Iniciando rotina de agregação cívica...');

  try {
    const rawData = fs.readFileSync(NOTICIAS_PATH, 'utf-8');
    const existingNoticias = JSON.parse(rawData);

    console.log(`ℹ️ Carregadas ${existingNoticias.length} notícias atuais.`);

    // Demonstração da lógica de integridade e ordenação
    existingNoticias.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    fs.writeFileSync(NOTICIAS_PATH, JSON.stringify(existingNoticias, null, 2), 'utf-8');
    console.log('✅ Base de notícias sincronizada com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o processo de agregação:', error);
    process.exit(1);
  }
}

scrapeAndSync();
