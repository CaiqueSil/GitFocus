export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: number; // timestamp em milissegundos para ordenação (mais novo em cima)
  updatedAt?: number;
}

export type GoalFormData = Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>;

export interface GoalFilterOptions {
  status?: 'todos' | GoalStatus;
  searchQuery?: string;
}

export const STATUS_CONFIG: Record<GoalStatus, {
  label: string;
  shortLabel: string;
  description: string;
  badgeClass: string;
  dotColor: string;
  borderLeftClass: string;
  hexColor: string;
  hoverBorderClass: string;
}> = {
  nao_iniciado: {
    label: 'A Fazer',
    shortLabel: 'A Fazer',
    description: 'Planejado para iniciar',
    badgeClass: 'text-[#64B5F6] bg-[#64B5F6]/10 border border-[#64B5F6]/25',
    dotColor: 'bg-[#64B5F6]',
    borderLeftClass: 'border-l-[#64B5F6]',
    hexColor: '#64B5F6',
    hoverBorderClass: 'hover:border-[#64B5F6]/40',
  },
  em_andamento: {
    label: 'Em Progresso',
    shortLabel: 'Progresso',
    description: 'Estudos em progresso ativo',
    badgeClass: 'text-[#FFB74D] bg-[#FFB74D]/10 border border-[#FFB74D]/25',
    dotColor: 'bg-[#FFB74D]',
    borderLeftClass: 'border-l-[#FFB74D]',
    hexColor: '#FFB74D',
    hoverBorderClass: 'hover:border-[#FFB74D]/40',
  },
  concluido: {
    label: 'Concluído',
    shortLabel: 'Concluído',
    description: 'Objetivo alcançado com sucesso',
    badgeClass: 'text-[#81C784] bg-[#81C784]/10 border border-[#81C784]/25',
    dotColor: 'bg-[#81C784]',
    borderLeftClass: 'border-l-[#81C784]',
    hexColor: '#81C784',
    hoverBorderClass: 'hover:border-[#81C784]/40',
  },
};
