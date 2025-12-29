export enum ServiceCategory {
  CUSTOM_WEAR = "Custom Wear (Oversized, T-shirt, Hoodies)",
  EVENT_IDENTITY = "Identidade de Eventos",
  GRAPHIC_MATERIALS = "Materiais Gráficos",
  WEB_DESIGN = "Sites e Páginas Web",
  SOCIAL_MEDIA = "Gestão de Redes Sociais",
  CREATIVE_PACKS = "Pacotes de Criativos",
  OTHERS = "Outros / Projetos Especiais"
}

export enum RequestStatus {
  PENDING = "Pendente",
  IN_PROGRESS = "Em Produção",
  COMPLETED = "Finalizado"
}

export interface ServiceRequest {
  id: string;
  clientName: string; 
  clientEmail: string;
  serviceType: ServiceCategory;
  description: string;
  referenceFileName?: string;
  createdAt: number;
  status: RequestStatus;
  tags?: string[];
}

export interface AdminUser {
  username: string;
  isAuthenticated: boolean;
}