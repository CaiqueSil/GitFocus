'use client';

import React from 'react';
import { Goal } from '@/types/goal';
import { Target, Clock, CheckCircle2, Flame } from 'lucide-react';

interface StatsOverviewProps {
  goals: Goal[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ goals }) => {
  const total = goals.length;
  const aFazer = goals.filter((g) => g.status === 'nao_iniciado').length;
  const emProgresso = goals.filter((g) => g.status === 'em_andamento').length;
  const concluidos = goals.filter((g) => g.status === 'concluido').length;
  const percentConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <section aria-label="Resumo do progresso" className="w-full">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3.5">
        {/* Card 1: Total */}
        <div className="rounded-xl border border-[#29292E] bg-[#1A1A1E] p-3.5 sm:p-4 shadow-sm transition-all hover:border-[#3E3E47]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8D8D99]">Total de Metas</span>
            <Target className="h-4 w-4 text-[#71717A]" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#EDEDEF] tabular-nums font-mono">
            {total}
          </p>
          <span className="mt-1 block text-[11px] text-[#71717A]">
            {total === 1 ? 'meta no backlog' : 'metas no backlog'}
          </span>
        </div>

        {/* Card 2: A Fazer (To Do) - #64B5F6 */}
        <div className="rounded-xl border border-[#29292E] bg-[#1A1A1E] p-3.5 sm:p-4 shadow-sm transition-all hover:border-[#64B5F6]/40 border-l-2 border-l-[#64B5F6]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64B5F6]">A Fazer (To Do)</span>
            <Clock className="h-4 w-4 text-[#64B5F6]" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#64B5F6] tabular-nums font-mono">
            {aFazer}
          </p>
          <span className="mt-1 block text-[11px] text-[#8D8D99]">
            Aguardando início
          </span>
        </div>

        {/* Card 3: Em Progresso - #FFB74D */}
        <div className="rounded-xl border border-[#29292E] bg-[#1A1A1E] p-3.5 sm:p-4 shadow-sm transition-all hover:border-[#FFB74D]/40 border-l-2 border-l-[#FFB74D]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#FFB74D]">Em Progresso</span>
            <Flame className="h-4 w-4 text-[#FFB74D]" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#FFB74D] tabular-nums font-mono">
            {emProgresso}
          </p>
          <span className="mt-1 block text-[11px] text-[#8D8D99]">
            Foco ativo agora
          </span>
        </div>

        {/* Card 4: Concluídos - #81C784 */}
        <div className="rounded-xl border border-[#29292E] bg-[#1A1A1E] p-3.5 sm:p-4 shadow-sm transition-all hover:border-[#81C784]/40 border-l-2 border-l-[#81C784]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#81C784]">Concluído (Done)</span>
            <CheckCircle2 className="h-4 w-4 text-[#81C784]" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[#81C784] tabular-nums font-mono">
            {concluidos}
          </p>
          <span className="mt-1 block text-[11px] text-[#8D8D99]">
            {percentConcluido}% concluído
          </span>
        </div>
      </div>

      {/* Barra de Progresso Dev / Jira */}
      {total > 0 && (
        <div className="mt-3 rounded-xl border border-[#29292E] bg-[#1A1A1E] px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[#8D8D99]">
              Sprint Progress
            </span>
            <span className="font-mono font-medium text-[#C4C4CC] tabular-nums">
              {concluidos}/{total} concluídas ({percentConcluido}%)
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#121214] border border-[#29292E]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#64B5F6] via-[#FFB74D] to-[#81C784] transition-all duration-500"
              style={{ width: `${percentConcluido}%` }}
              role="progressbar"
              aria-valuenow={percentConcluido}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}
    </section>
  );
};
