'use client';

import React, { useState, useEffect } from 'react';
import { Goal, GoalFormData, GoalStatus } from '@/types/goal';
import { X, Calendar, PlusCircle, Check, BookOpen, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';

interface GoalFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialGoal?: Goal | null;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  mode,
  initialGoal,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState(mode === 'edit' && initialGoal ? initialGoal.title : '');
  const [description, setDescription] = useState(
    mode === 'edit' && initialGoal ? initialGoal.description || '' : ''
  );
  const [deadline, setDeadline] = useState(() => {
    if (mode === 'edit' && initialGoal?.deadline) {
      return initialGoal.deadline;
    }
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    return defaultDate.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState<GoalStatus>(
    mode === 'edit' && initialGoal ? initialGoal.status : 'nao_iniciado'
  );
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { title?: string; deadline?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Por favor, informe o título do seu objetivo de estudo.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres.';
    }

    if (!deadline) {
      newErrors.deadline = 'Por favor, escolha uma data limite para o prazo.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
  };

  const handleQuickDeadline = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDeadline(d.toISOString().split('T')[0]);
    if (errors.deadline) {
      setErrors((prev) => ({ ...prev, deadline: undefined }));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121214]/80 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#1A1A1E] border border-[#29292E] p-6 shadow-2xl shadow-black/60 transition-all sm:p-7">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-[#29292E]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#121214] border border-[#29292E] text-[#64B5F6]">
              {mode === 'create' ? <PlusCircle className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
            </div>
            <div>
              <h2 id="goal-modal-title" className="text-base sm:text-lg font-bold text-[#EDEDEF]">
                {mode === 'create' ? 'Cadastrar Novo Objetivo' : 'Editar Objetivo de Estudo'}
              </h2>
              <p className="text-xs text-[#8D8D99]">
                {mode === 'create'
                  ? 'Defina o que você deseja aprender na sua jornada tech'
                  : 'Atualize os detalhes, prazo ou status do seu objetivo'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#8D8D99] hover:bg-[#29292E] hover:text-[#EDEDEF] transition-colors cursor-pointer"
            aria-label="Fechar formulário"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Campo: Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-semibold text-[#EDEDEF] font-mono">
              Título do objetivo <span className="text-rose-400">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Ex: Dominar TypeScript: Generics e Utility Types"
              className={`mt-1.5 w-full rounded-lg border bg-[#121214] px-3.5 py-2.5 text-sm text-[#EDEDEF] placeholder:text-[#71717A] focus:outline-none focus:ring-1 transition-colors ${
                errors.title
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-500/5'
                  : 'border-[#29292E] focus:border-[#64B5F6] focus:ring-[#64B5F6]'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-400 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Campo: Descrição */}
          <div>
            <label htmlFor="goal-description" className="block text-xs font-semibold text-[#EDEDEF] font-mono">
              Descrição e tópicos a estudar
            </label>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Estudar Record, Omit, Partial, infer e criar tipos genéricos reutilizáveis para projetos React."
              className="mt-1.5 w-full rounded-lg border border-[#29292E] bg-[#121214] px-3.5 py-2.5 text-sm text-[#EDEDEF] placeholder:text-[#71717A] focus:border-[#64B5F6] focus:outline-none focus:ring-1 focus:ring-[#64B5F6] transition-colors"
            />
            <span className="mt-1 block text-[11px] text-[#71717A]">
              Dica: liste links, cursos ou o projeto prático que você construirá.
            </span>
          </div>

          {/* Campo: Prazo */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="goal-deadline" className="block text-xs font-semibold text-[#EDEDEF] font-mono">
                Prazo final <span className="text-rose-400">*</span>
              </label>
              {/* Atalhos Rápidos de Prazo */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[#71717A] hidden sm:inline">Atalhos:</span>
                <button
                  type="button"
                  onClick={() => handleQuickDeadline(7)}
                  className="rounded bg-[#121214] border border-[#29292E] px-2 py-0.5 text-[11px] font-medium text-[#8D8D99] hover:bg-[#29292E] hover:text-[#EDEDEF] transition-colors cursor-pointer"
                >
                  +7d
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDeadline(15)}
                  className="rounded bg-[#121214] border border-[#29292E] px-2 py-0.5 text-[11px] font-medium text-[#8D8D99] hover:bg-[#29292E] hover:text-[#EDEDEF] transition-colors cursor-pointer"
                >
                  +15d
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDeadline(30)}
                  className="rounded bg-[#121214] border border-[#29292E] px-2 py-0.5 text-[11px] font-medium text-[#8D8D99] hover:bg-[#29292E] hover:text-[#EDEDEF] transition-colors cursor-pointer"
                >
                  +30d
                </button>
              </div>
            </div>

            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#71717A]">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                id="goal-deadline"
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: undefined }));
                }}
                className={`w-full rounded-lg border bg-[#121214] pl-10 pr-3.5 py-2.5 text-sm text-[#EDEDEF] [color-scheme:dark] focus:outline-none focus:ring-1 transition-colors ${
                  errors.deadline
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-500/5'
                    : 'border-[#29292E] focus:border-[#64B5F6] focus:ring-[#64B5F6]'
                }`}
              />
            </div>
            {errors.deadline && (
              <p className="mt-1 text-xs text-rose-400 font-medium">{errors.deadline}</p>
            )}
          </div>

          {/* Campo: Status */}
          <div>
            <label className="block text-xs font-semibold text-[#EDEDEF] mb-1.5 font-mono">
              Status inicial
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* A Fazer (To Do) - #64B5F6 */}
              <button
                type="button"
                onClick={() => setStatus('nao_iniciado')}
                className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  status === 'nao_iniciado'
                    ? 'border-[#64B5F6] bg-[#64B5F6]/15 text-[#64B5F6] ring-1 ring-[#64B5F6]'
                    : 'border-[#29292E] bg-[#121214] text-[#8D8D99] hover:bg-[#29292E] hover:text-[#EDEDEF]'
                }`}
              >
                <Clock className="h-4 w-4 text-[#64B5F6]" />
                <span>A Fazer</span>
              </button>

              {/* Em Progresso - #FFB74D */}
              <button
                type="button"
                onClick={() => setStatus('em_andamento')}
                className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  status === 'em_andamento'
                    ? 'border-[#FFB74D] bg-[#FFB74D]/15 text-[#FFB74D] ring-1 ring-[#FFB74D]'
                    : 'border-[#29292E] bg-[#121214] text-[#8D8D99] hover:bg-[#29292E] hover:text-[#EDEDEF]'
                }`}
              >
                <PlayCircle className="h-4 w-4 text-[#FFB74D]" />
                <span>Em Progresso</span>
              </button>

              {/* Concluído - #81C784 */}
              <button
                type="button"
                onClick={() => setStatus('concluido')}
                className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-2.5 text-xs font-semibold transition-all cursor-pointer ${
                  status === 'concluido'
                    ? 'border-[#81C784] bg-[#81C784]/15 text-[#81C784] ring-1 ring-[#81C784]'
                    : 'border-[#29292E] bg-[#121214] text-[#8D8D99] hover:bg-[#29292E] hover:text-[#EDEDEF]'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 text-[#81C784]" />
                <span>Concluído</span>
              </button>
            </div>
          </div>

          {/* Ações do Formulário */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#29292E]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#8D8D99] hover:bg-[#29292E] hover:text-[#EDEDEF] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#64B5F6] px-5 py-2.5 text-sm font-semibold text-[#121214] shadow-sm hover:bg-[#85c6f8] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64B5F6] cursor-pointer transition-all"
            >
              <Check className="h-4 w-4 stroke-[2.5]" />
              <span>{mode === 'create' ? 'Salvar Objetivo' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
