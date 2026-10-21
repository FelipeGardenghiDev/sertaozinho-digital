export interface ProdutoMercado {
  id: string;
  mercado: 'Savegnago' | 'Gricki' | 'Copercana' | 'Paulistão';
  produto: string;
  categoria: 'Cesta Básica' | 'Hortifruti' | 'Açougue' | 'Bebidas' | 'Limpeza & Casa';
  preco: number;
  precoOriginal?: number;
  unidade: string;
  dataAtualizacao: string;
  validoAte: string;
  destaque?: boolean;
  linkEncarte?: string;
}

export interface VagaPAT {
  id: string;
  cargo: string;
  quantidade: number;
  setor: 'Metalurgia / Indústria' | 'Comércio & Vendas' | 'Serviços Gerais' | 'Administrativo' | 'Logística';
  escolaridade: string;
  experienciaMinima: string;
  salarioOuBeneficios: string;
  dataPublicacao: string;
  comoCandidatar: string;
  vagaUrgente?: boolean;
}

export interface TelefoneUtil {
  id: string;
  nome: string;
  categoria: 'Emergência' | 'Saúde' | 'Serviços Públicos' | 'Bancos' | 'SOS & Chaveiros 24h';
  telefone: string;
  whatsapp?: string;
  endereco?: string;
  horario?: string;
  plantao24h?: boolean;
  descricao?: string;
}

export interface NoticiaLocal {
  id: string;
  titulo: string;
  resumo: string;
  fonte: string;
  url: string;
  categoria: 'Cidade' | 'Cultura' | 'Economia' | 'Policial' | 'Saúde';
  data: string;
  imagemUrl?: string;
}

export interface ArtistaLocal {
  id: string;
  nome: string;
  estilo: 'Sertanejo & Raiz' | 'Rock & Pop' | 'Pagode & Samba' | 'Eletrônica & DJ' | 'MPB & Acústico';
  bio: string;
  instagram?: string;
  spotify?: string;
  youtube?: string;
  whatsappContato?: string;
  proximosShows?: {
    data: string;
    local: string;
    horario: string;
  }[];
}

export interface FarmaciaPlantao {
  id: string;
  farmacia: string;
  endereco: string;
  telefone: string;
  whatsapp?: string;
  bairro: string;
  horario: string;
  hojePlantao: boolean;
}

export interface LinhaOnibus {
  id: string;
  codigoLinha: string;
  nomeLinha: string;
  tipo: 'Suburbano (Ribeirão Preto)' | 'Circular Urbana (Bairros)' | 'Distrito (Cruz das Posses)';
  tarifa: number;
  itinerarioResumo: string;
  horariosSegundaSexta: string[];
  horariosSabado: string[];
  horariosDomingoFeriado: string[];
}

export interface PontoTransporte {
  id: string;
  nome: string;
  tipo: 'Ponto de Táxi' | 'Ponto de Moto-Táxi' | 'Terminal Rodoviário';
  endereco: string;
  telefone: string;
  whatsapp?: string;
  atendimento24h: boolean;
}

export interface ColetaBairro {
  id: string;
  bairro: string;
  regiao: 'Norte' | 'Sul' | 'Leste' | 'Oeste' | 'Centro' | 'Distrito';
  coletaComumDias: string;
  coletaComumPeriodo: 'Diurno (a partir das 07h)' | 'Noturno (a partir das 19h)';
  coletaSeletivaDias: string;
  cataTrecoDiaSemana: string;
  observacoes?: string;
}

export interface InfoCruzDasPosses {
  id: string;
  titulo: string;
  categoria: 'Saúde' | 'Serviços' | 'Transporte' | 'Comércio' | 'História';
  descricao: string;
  endereco?: string;
  telefone?: string;
  whatsapp?: string;
  destaque?: boolean;
}
