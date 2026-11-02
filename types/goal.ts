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
  description: string;
  badgeClass: string;
  dotColor: string;
}> = {
  nao_iniciado: {
    label: 'Não iniciado',
    description: 'Planejado para iniciar',
    badgeClass: 'text-amber-700 bg-amber-50 border border-amber-200/80',
    dotColor: 'bg-amber-500',
  },
  em_andamento: {
    label: 'Em andamento',
    description: 'Estudos em progresso ativo',
    badgeClass: 'text-indigo-700 bg-indigo-50 border border-indigo-200/80',
    dotColor: 'bg-indigo-500',
  },
  concluido: {
    label: 'Concluído',
    description: 'Objetivo alcançado com sucesso',
    badgeClass: 'text-emerald-700 bg-emerald-50 border border-emerald-200/80',
    dotColor: 'bg-emerald-500',
  },
};
