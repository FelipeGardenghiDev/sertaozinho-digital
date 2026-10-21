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
