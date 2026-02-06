export interface LogoSettings { name: string; color: string; }
export interface AIFeedback { score: number; text: string; }
export interface SiteConfig {
  imageUrl: string;
  caption: string;
}

export interface LinkItem {
  id: string;
  url: string;
  createdAt: number;
}

// Default configuration if nothing is saved
export const DEFAULT_CONFIG: SiteConfig = {
  imageUrl: 'https://picsum.photos/400/200',
  caption: 'Clique abaixo para continuar para o seu destino exclusivo.',
};
