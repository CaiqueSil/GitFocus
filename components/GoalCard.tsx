'use client';

import React from 'react';
import { Goal, GoalStatus, STATUS_CONFIG } from '@/types/goal';
import { formatDatePtBR, formatCreationDate, getDeadlineInfo } from '@/lib/dateUtils';
import { Calendar, Edit3, Trash2, CheckCircle2, Clock, PlayCircle, AlertCircle } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDeleteRequest: (goal: Goal) => void;
  onStatusChange: (id: string, newStatus: GoalStatus) => void;
  compact?: boolean;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDeleteRequest,
  onStatusChange,
  compact = false,
}) => {
  const isCompleted = goal.status === 'concluido';
  const deadlineInfo = getDeadlineInfo(goal.deadline, isCompleted);
  const statusInfo = STATUS_CONFIG[goal.status];

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-xl border border-[#29292E] bg-[#1A1A1E] transition-all duration-200 hover:border-[#3E3E47] hover:shadow-lg hover:shadow-black/40 border-l-4 ${statusInfo.borderLeftClass} ${
        compact ? 'p-3.5' : 'p-4 sm:p-5'
      }`}
    >
      {/* Topo do Cartão: Tag de Status e Ações */}
      <div>
        <div className="flex items-start justify-between gap-2">
          {/* Tag / Pílula texturizada com a cor do status */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold ${statusInfo.badgeClass}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotColor}`} />
              {statusInfo.label}
            </span>

            {/* Ciclo Rápido de Status (Estilo Dev / Jira) */}
            <div className="flex items-center gap-0.5 rounded-md bg-[#121214] p-0.5 border border-[#29292E]">
              <button
                type="button"
                onClick={() => onStatusChange(goal.id, 'nao_iniciado')}
                title="Mover para: A Fazer"
                className={`rounded px-1.5 py-0.5 text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                  goal.status === 'nao_iniciado'
                    ? 'text-[#64B5F6] bg-[#64B5F6]/15 font-semibold'
                    : 'text-[#8D8D99] hover:text-[#64B5F6] hover:bg-[#1A1A1E]'
                }`}
              >
                <Clock className="h-3 w-3" />
                <span className="hidden sm:inline">To Do</span>
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(goal.id, 'em_andamento')}
                title="Mover para: Em Progresso"
                className={`rounded px-1.5 py-0.5 text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                  goal.status === 'em_andamento'
                    ? 'text-[#FFB74D] bg-[#FFB74D]/15 font-semibold'
                    : 'text-[#8D8D99] hover:text-[#FFB74D] hover:bg-[#1A1A1E]'
                }`}
              >
                <PlayCircle className="h-3 w-3" />
                <span className="hidden sm:inline">WIP</span>
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(goal.id, 'concluido')}
                title="Mover para: Concluído"
                className={`rounded px-1.5 py-0.5 text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                  goal.status === 'concluido'
                    ? 'text-[#81C784] bg-[#81C784]/15 font-semibold'
                    : 'text-[#8D8D99] hover:text-[#81C784] hover:bg-[#1A1A1E]'
                }`}
              >
                <CheckCircle2 className="h-3 w-3" />
                <span className="hidden sm:inline">Done</span>
              </button>
            </div>
          </div>

          {/* Botões de Ação: Editar e Excluir */}
          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEdit(goal)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#A1A1AA] hover:bg-[#29292E] hover:text-[#EDEDEF] transition-colors cursor-pointer"
              title="Editar este objetivo"
              aria-label={`Editar ${goal.title}`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Editar</span>
            </button>
            <button
              type="button"
              onClick={() => onDeleteRequest(goal)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-rose-400/90 hover:bg-rose-500/10 hover:text-rose-400 transition-colors cursor-pointer"
              title="Excluir este objetivo"
              aria-label={`Excluir ${goal.title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Excluir</span>
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`mt-2.5 text-sm sm:text-base font-semibold leading-snug tracking-tight ${
            isCompleted
              ? 'line-through text-[#71717A]'
              : 'text-[#EDEDEF]'
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição */}
        {goal.description && (
          <p
            className={`mt-1.5 text-xs sm:text-sm leading-relaxed text-[#A1A1AA] line-clamp-3 whitespace-pre-line`}
          >
            {goal.description}
          </p>
        )}
      </div>

      {/* Rodapé do Cartão: Prazo e Data de Criação */}
      <div className="mt-3.5 pt-2.5 border-t border-[#29292E]/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Informação do Prazo */}
        <div className="flex items-center gap-1.5 text-[#8D8D99]">
          <Calendar className="h-3.5 w-3.5 text-[#71717A]" />
          <span className="font-medium text-[#C4C4CC]">
            Prazo: {formatDatePtBR(goal.deadline)}
          </span>

          {!isCompleted && goal.deadline && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium ml-1 ${
                deadlineInfo.isOverdue
                  ? 'text-rose-400'
                  : deadlineInfo.isDueSoon
                  ? 'text-[#FFB74D]'
                  : 'text-[#8D8D99]'
              }`}
            >
              {deadlineInfo.isOverdue && <AlertCircle className="h-3 w-3" />}
              ({deadlineInfo.label})
            </span>
          )}
        </div>

        {/* Data de Adição */}
        <div className="text-[11px] text-[#71717A] font-mono">
          {formatCreationDate(goal.createdAt)}
        </div>
      </div>
    </article>
  );
};
