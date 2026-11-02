'use client';

import React, { useState, useMemo } from 'react';
import { Goal, GoalStatus } from '@/types/goal';
import { GoalCard } from './GoalCard';
import { EmptyState } from './EmptyState';
import { Search, ArrowDownUp, Filter, Sparkles, X } from 'lucide-react';

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
  const [selectedStatus, setSelectedStatus] = useState<'todos' | GoalStatus>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Garantir rigorosamente a regra: "em ordem de adição (mais novo em cima)"
  const sortedGoals = useMemo(() => {
    return [...goals].sort((a, b) => b.createdAt - a.createdAt);
  }, [goals]);

  // 2. Filtragem por busca e por status mantendo a ordem dos mais novos em cima
  const filteredGoals = useMemo(() => {
    return sortedGoals.filter((goal) => {
      // Filtro de status
      if (selectedStatus !== 'todos' && goal.status !== selectedStatus) {
        return false;
      }
      // Filtro de busca textual
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = goal.title.toLowerCase().includes(query);
        const matchesDesc = (goal.description || '').toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }
      return true;
    });
  }, [sortedGoals, selectedStatus, searchQuery]);

  // Contagens para os botões de filtro
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

  return (
    <div className="space-y-4">
      {/* Barra de Controles: Busca, Filtros e Indicador de Ordenação */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Campo de Busca Rápida */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por tecnologia, tópico ou título..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Limpar pesquisa"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Indicador de ordenação explícito atendendo ao requisito */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 self-end sm:self-auto shrink-0 font-medium">
          <ArrowDownUp className="h-3.5 w-3.5 text-indigo-500" />
          <span>Mais recente em cima</span>
        </div>
      </div>

      {/* Abas de Filtro por Status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 text-xs">
          <button
            type="button"
            onClick={() => setSelectedStatus('todos')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
              selectedStatus === 'todos'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({counts.todos})
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('em_andamento')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
              selectedStatus === 'em_andamento'
                ? 'bg-white text-indigo-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Em andamento ({counts.em_andamento})
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('nao_iniciado')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
              selectedStatus === 'nao_iniciado'
                ? 'bg-white text-amber-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Não iniciados ({counts.nao_iniciado})
          </button>
          <button
            type="button"
            onClick={() => setSelectedStatus('concluido')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer ${
              selectedStatus === 'concluido'
                ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Concluídos ({counts.concluido})
          </button>
        </div>

        {/* Quantidade exibida */}
        <span className="text-xs text-slate-500 font-medium">
          Mostrando <strong className="text-slate-700 font-semibold">{filteredGoals.length}</strong> de {goals.length} objetivos
        </span>
      </div>

      {/* Lista de Cartões ou Estado de Busca Vazia */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          type="no_results"
          searchQuery={searchQuery}
          onNewGoal={onNewGoal}
          onClearFilters={() => {
            setSelectedStatus('todos');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-2">
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
      )}
    </div>
  );
};
