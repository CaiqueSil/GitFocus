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
  // Inicialização de estado direta baseada nas props (eliminando setState dentro de useEffect)
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

  // Suporte a fechar modal com tecla ESC
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

  // Atalho para adicionar dias ao prazo
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/10 transition-all sm:p-7">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              {mode === 'create' ? <PlusCircle className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
            </div>
            <div>
              <h2 id="goal-modal-title" className="text-lg font-bold text-slate-900">
                {mode === 'create' ? 'Cadastrar Novo Objetivo' : 'Editar Objetivo de Estudo'}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === 'create'
                  ? 'Defina o que você deseja aprender na sua jornada tech'
                  : 'Atualize os detalhes, prazo ou status do seu objetivo'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Fechar formulário"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Campo: Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-semibold text-slate-800">
              Título do objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Ex: Dominar Docker e conteinerização de aplicações"
              className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.title
                  ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Campo: Descrição */}
          <div>
            <label htmlFor="goal-description" className="block text-xs font-semibold text-slate-800">
              Descrição e tópicos a estudar
            </label>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Aprender a criar Dockerfiles enxutos, rodar multi-containers com Docker Compose e subir uma aplicação full-stack."
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-colors"
            />
            <span className="mt-1 block text-[11px] text-slate-400">
              Dica: liste ferramentas, links ou o projeto prático que você construirá.
            </span>
          </div>

          {/* Campo: Prazo */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="goal-deadline" className="block text-xs font-semibold text-slate-800">
                Prazo final <span className="text-rose-500">*</span>
              </label>
              {/* Atalhos Rápidos de Prazo */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 hidden sm:inline">Atalhos:</span>
                <button
                  type="button"
                  onClick={() => handleQuickDeadline(7)}
                  className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  +7 dias
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDeadline(15)}
                  className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  +15 dias
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDeadline(30)}
                  className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  +30 dias
                </button>
              </div>
            </div>

            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
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
                className={`w-full rounded-lg border pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                  errors.deadline
                    ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
              />
            </div>
            {errors.deadline && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.deadline}</p>
            )}
          </div>

          {/* Campo: Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Status atual do objetivo
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('nao_iniciado')}
                className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                  status === 'nao_iniciado'
                    ? 'border-amber-400 bg-amber-50 text-amber-900 ring-2 ring-amber-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className="h-4 w-4 text-amber-600" />
                <span>Não iniciado</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('em_andamento')}
                className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                  status === 'em_andamento'
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <PlayCircle className="h-4 w-4 text-indigo-600" />
                <span>Em andamento</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('concluido')}
                className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                  status === 'concluido'
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Concluído</span>
              </button>
            </div>
          </div>

          {/* Ações do Formulário */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer transition-all"
            >
              <Check className="h-4 w-4" />
              <span>{mode === 'create' ? 'Salvar Objetivo' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
