'use client';

import React, { useState, useMemo } from 'react';
import { Goal, GoalStatus } from '@/types/goal';
import { GoalCard } from './GoalCard';
import { EmptyState } from './EmptyState';
import {
  Search,
  ArrowDownUp,
  Columns3,
  List,
  X,
  Clock,
  PlayCircle,
  CheckCircle2,
  Plus,
} from 'lucide-react';

interface GoalListProps {
  goals: Goal[];
  onEditGoal: (goal: Goal) => void;
  onDeleteGoalRequest: (goal: Goal) => void;
  onStatusChange: (id: string, newStatus: GoalStatus) => void;
  onNewGoal: () => void;
  onLoadSamples: () => void;
}

export const GoalList: React.FC<GoalListProps> = ({
  goals,
  onEditGoal,
  onDeleteGoalRequest,
  onStatusChange,
  onNewGoal,
  onLoadSamples,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedStatus, setSelectedStatus] = useState<'todos' | GoalStatus>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Regra rigorosa: mais novo em cima (b.createdAt - a.createdAt)
  const sortedGoals = useMemo(() => {
    return [...goals].sort((a, b) => b.createdAt - a.createdAt);
  }, [goals]);

  // 2. Filtragem por busca e por status (para o modo lista)
  const filteredGoals = useMemo(() => {
    return sortedGoals.filter((goal) => {
      if (selectedStatus !== 'todos' && goal.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = goal.title.toLowerCase().includes(query);
        const matchesDesc = (goal.description || '').toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }
      return true;
    });
  }, [sortedGoals, selectedStatus, searchQuery]);

  // Contagens para os botões e colunas
  const counts = useMemo(() => {
    return {
      todos: goals.length,
      nao_iniciado: goals.filter((g) => g.status === 'nao_iniciado').length,
      em_andamento: goals.filter((g) => g.status === 'em_andamento').length,
      concluido: goals.filter((g) => g.status === 'concluido').length,
    };
  }, [goals]);

  // Se não existir absolutamente nenhum objetivo
  if (goals.length === 0) {
    return (
      <EmptyState
        type="no_goals"
        onNewGoal={onNewGoal}
        onLoadSamples={onLoadSamples}
      />
    );
  }

  // Agrupamento para as colunas do Kanban (mantendo a ordenação mais novo em cima)
  const kanbanColumns: Array<{
    id: GoalStatus;
    title: string;
    icon: React.ReactNode;
    color: string;
    borderTopColor: string;
    goals: Goal[];
  }> = [
    {
      id: 'nao_iniciado',
      title: 'A Fazer',
      icon: <Clock className="h-4 w-4 text-[#64B5F6]" />,
      color: '#64B5F6',
      borderTopColor: 'border-t-[#64B5F6]',
      goals: sortedGoals.filter((g) => {
        if (g.status !== 'nao_iniciado') return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return g.title.toLowerCase().includes(q) || (g.description || '').toLowerCase().includes(q);
      }),
    },
    {
      id: 'em_andamento',
      title: 'Em Progresso',
      icon: <PlayCircle className="h-4 w-4 text-[#FFB74D]" />,
      color: '#FFB74D',
      borderTopColor: 'border-t-[#FFB74D]',
      goals: sortedGoals.filter((g) => {
        if (g.status !== 'em_andamento') return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return g.title.toLowerCase().includes(q) || (g.description || '').toLowerCase().includes(q);
      }),
    },
    {
      id: 'concluido',
      title: 'Concluído',
      icon: <CheckCircle2 className="h-4 w-4 text-[#81C784]" />,
      color: '#81C784',
      borderTopColor: 'border-t-[#81C784]',
      goals: sortedGoals.filter((g) => {
        if (g.status !== 'concluido') return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return g.title.toLowerCase().includes(q) || (g.description || '').toLowerCase().includes(q);
      }),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Barra de Controles Estilo GitHub / Jira */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#29292E] bg-[#1A1A1E] p-3 sm:p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Campo de Busca Rápida */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#71717A]">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar metas por tecnologia, tópico ou título..."
            className="w-full rounded-lg border border-[#29292E] bg-[#121214] pl-9 pr-9 py-2 text-xs sm:text-sm text-[#EDEDEF] placeholder:text-[#71717A] focus:border-[#64B5F6] focus:outline-none focus:ring-1 focus:ring-[#64B5F6] transition-colors font-mono"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#71717A] hover:text-[#EDEDEF] cursor-pointer"
              title="Limpar pesquisa"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Alternador de Visualização (Kanban vs Lista) + Ordenação */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="flex items-center rounded-lg bg-[#121214] p-1 border border-[#29292E]">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-[#1A1A1E] text-[#EDEDEF] border border-[#29292E] shadow-xs'
                  : 'text-[#8D8D99] hover:text-[#EDEDEF]'
              }`}
              title="Visualização em Colunas Kanban"
            >
              <Columns3 className="h-3.5 w-3.5 text-[#64B5F6]" />
              <span>Kanban</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#1A1A1E] text-[#EDEDEF] border border-[#29292E] shadow-xs'
                  : 'text-[#8D8D99] hover:text-[#EDEDEF]'
              }`}
              title="Visualização em Lista"
            >
              <List className="h-3.5 w-3.5 text-[#FFB74D]" />
              <span>Lista</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8D8D99] font-mono">
            <ArrowDownUp className="h-3.5 w-3.5 text-[#64B5F6]" />
            <span>Recentes no topo</span>
          </div>
        </div>
      </div>

      {/* Visão 1: KANBAN BOARD (Estilo Jira / GitHub Projects) */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {kanbanColumns.map((col) => (
            <div
              key={col.id}
              className={`flex flex-col rounded-xl border border-[#29292E] bg-[#121214] border-t-2 ${col.borderTopColor} p-3 min-h-[420px]`}
            >
              {/* Cabeçalho da Coluna Kanban */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#29292E]/60">
                <div className="flex items-center gap-2">
                  {col.icon}
                  <span className="font-semibold text-xs sm:text-sm text-[#EDEDEF] font-mono">
                    {col.title}
                  </span>
                </div>
                <span className="rounded-full bg-[#1A1A1E] px-2 py-0.5 text-xs font-mono font-bold text-[#8D8D99] border border-[#29292E]">
                  {col.goals.length}
                </span>
              </div>

              {/* Lista de Cards da Coluna */}
              <div className="flex flex-col gap-2.5 flex-1">
                {col.goals.length > 0 ? (
                  col.goals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      compact
                      onEdit={onEditGoal}
                      onDeleteRequest={onDeleteGoalRequest}
                      onStatusChange={onStatusChange}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 rounded-lg border border-dashed border-[#29292E] p-6 text-center text-xs text-[#71717A]">
                    <span>Nenhum objetivo nesta etapa</span>
                    {col.id === 'nao_iniciado' && (
                      <button
                        type="button"
                        onClick={onNewGoal}
                        className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#64B5F6] hover:underline cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        Criar novo
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visão 2: LISTA DE OBJETIVOS (Feed com filtros) */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {/* Abas de Filtro por Status */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#1A1A1E] rounded-xl border border-[#29292E] text-xs">
              <button
                type="button"
                onClick={() => setSelectedStatus('todos')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
                  selectedStatus === 'todos'
                    ? 'bg-[#121214] text-[#EDEDEF] border border-[#29292E] font-semibold'
                    : 'text-[#8D8D99] hover:text-[#EDEDEF]'
                }`}
              >
                Todos ({counts.todos})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('nao_iniciado')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
                  selectedStatus === 'nao_iniciado'
                    ? 'bg-[#64B5F6]/15 text-[#64B5F6] border border-[#64B5F6]/30 font-semibold'
                    : 'text-[#8D8D99] hover:text-[#64B5F6]'
                }`}
              >
                A Fazer ({counts.nao_iniciado})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('em_andamento')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
                  selectedStatus === 'em_andamento'
                    ? 'bg-[#FFB74D]/15 text-[#FFB74D] border border-[#FFB74D]/30 font-semibold'
                    : 'text-[#8D8D99] hover:text-[#FFB74D]'
                }`}
              >
                Em Progresso ({counts.em_andamento})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('concluido')}
                className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
                  selectedStatus === 'concluido'
                    ? 'bg-[#81C784]/15 text-[#81C784] border border-[#81C784]/30 font-semibold'
                    : 'text-[#8D8D99] hover:text-[#81C784]'
                }`}
              >
                Concluídos ({counts.concluido})
              </button>
            </div>

            <span className="text-xs text-[#8D8D99] font-mono">
              Exibindo <strong className="text-[#EDEDEF]">{filteredGoals.length}</strong> de {goals.length}
            </span>
          </div>

          {/* Lista de Cards */}
          {filteredGoals.length > 0 ? (
            <div className="space-y-3">
              {filteredGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={onEditGoal}
                  onDeleteRequest={onDeleteGoalRequest}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="no_results"
              searchQuery={searchQuery}
              onNewGoal={onNewGoal}
              onClearFilters={() => {
                setSelectedStatus('todos');
                setSearchQuery('');
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
