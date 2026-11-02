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
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const isCompleted = goal.status === 'concluido';
  const deadlineInfo = getDeadlineInfo(goal.deadline, isCompleted);
  const statusInfo = STATUS_CONFIG[goal.status];

  return (
    <article className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
      {/* Topo do Cartão: Status e Ações */}
      <div>
        <div className="flex items-start justify-between gap-3">
          {/* Seletor Rápido de Status Interativo */}
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${statusInfo.badgeClass}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotColor}`} />
              {statusInfo.label}
            </span>

            {/* Ciclo Rápido de Status (UX acolhedor para estudantes) */}
            <div className="flex items-center gap-0.5 ml-1">
              <button
                type="button"
                onClick={() => onStatusChange(goal.id, 'nao_iniciado')}
                title="Marcar como Não iniciado"
                className={`rounded p-1 text-xs transition-colors cursor-pointer ${
                  goal.status === 'nao_iniciado'
                    ? 'text-amber-700 bg-amber-100/60 font-semibold'
                    : 'text-slate-400 hover:text-amber-700 hover:bg-slate-100'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(goal.id, 'em_andamento')}
                title="Marcar como Em andamento"
                className={`rounded p-1 text-xs transition-colors cursor-pointer ${
                  goal.status === 'em_andamento'
                    ? 'text-indigo-700 bg-indigo-100/60 font-semibold'
                    : 'text-slate-400 hover:text-indigo-700 hover:bg-slate-100'
                }`}
              >
                <PlayCircle className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(goal.id, 'concluido')}
                title="Marcar como Concluído"
                className={`rounded p-1 text-xs transition-colors cursor-pointer ${
                  goal.status === 'concluido'
                    ? 'text-emerald-700 bg-emerald-100/60 font-semibold'
                    : 'text-slate-400 hover:text-emerald-700 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Botões de Ação: Editar e Excluir */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(goal)}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 cursor-pointer"
              title="Editar este objetivo"
              aria-label={`Editar ${goal.title}`}
            >
              <Edit3 className="h-3.5 w-3.5 text-slate-500" />
              <span>Editar</span>
            </button>
            <button
              type="button"
              onClick={() => onDeleteRequest(goal)}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 cursor-pointer"
              title="Excluir este objetivo (solicitará confirmação)"
              aria-label={`Excluir ${goal.title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Excluir</span>
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3 className={`mt-3 text-base font-semibold text-slate-900 leading-snug ${
          isCompleted ? 'line-through text-slate-500' : ''
        }`}>
          {goal.title}
        </h3>

        {/* Descrição */}
        <p className="mt-2 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
          {goal.description || 'Nenhuma descrição fornecida.'}
        </p>
      </div>

      {/* Rodapé do Cartão: Prazo e Data de Criação */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Informação do Prazo */}
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">
            Prazo: {formatDatePtBR(goal.deadline)}
          </span>

          {!isCompleted && goal.deadline && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium ml-1 ${
                deadlineInfo.isOverdue
                  ? 'text-rose-600'
                  : deadlineInfo.isDueSoon
                  ? 'text-amber-600'
                  : 'text-slate-500'
              }`}
            >
              {deadlineInfo.isOverdue && <AlertCircle className="h-3 w-3" />}
              ({deadlineInfo.label})
            </span>
          )}
        </div>

        {/* Data de Adição (garante visibilidade da ordem "mais novo em cima") */}
        <div className="text-[11px] text-slate-400">
          Adicionado em {formatCreationDate(goal.createdAt)}
        </div>
      </div>
    </article>
  );
};
