'use client';

import React, { useState, useSyncExternalStore, useCallback } from 'react';
import { Goal, GoalFormData, GoalStatus } from '@/types/goal';
import { storageService } from '@/services/storageService';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { GoalList } from '@/components/GoalList';
import { GoalFormModal } from '@/components/GoalFormModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { Plus, Terminal, Sparkles, Code2, CheckCheck } from 'lucide-react';

const emptySubscribe = () => () => {};

export default function Home() {
  // Sincronização segura e reativa com o localStorage via useSyncExternalStore
  const goals = useSyncExternalStore(
    storageService.subscribe,
    storageService.getSnapshot,
    storageService.getServerSnapshot
  );

  // Detecção de cliente sem setState em useEffect
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Estados dos modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);

  // Toast / feedback amigável
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  // Handlers para cadastro e edição
  const handleOpenCreateModal = () => {
    setFormMode('create');
    setEditingGoal(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (goal: Goal) => {
    setFormMode('edit');
    setEditingGoal(goal);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (data: GoalFormData) => {
    if (formMode === 'create') {
      storageService.create(data);
      showToast('Objetivo cadastrado com sucesso!');
    } else if (formMode === 'edit' && editingGoal) {
      storageService.update(editingGoal.id, data);
      showToast('Objetivo atualizado com sucesso!');
    }
    setIsFormModalOpen(false);
    setEditingGoal(null);
  };

  // Handlers para exclusão com confirmação obrigatória
  const handleDeleteRequest = (goal: Goal) => {
    setDeletingGoal(goal);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (goalId: string) => {
    const success = storageService.delete(goalId);
    if (success) {
      showToast('Objetivo excluído.');
    }
    setIsDeleteModalOpen(false);
    setDeletingGoal(null);
  };

  // Handler para mudança rápida de status
  const handleStatusChange = (id: string, newStatus: GoalStatus) => {
    const updated = storageService.updateStatus(id, newStatus);
    if (updated) {
      if (newStatus === 'concluido') {
        showToast('Parabéns! Objetivo marcado como concluído! 🎉');
      } else {
        showToast('Status do objetivo atualizado.');
      }
    }
  };

  // Handler para recarregar exemplos
  const handleLoadSamples = () => {
    storageService.resetToSamples();
    showToast('Exemplos de objetivos tech carregados!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Header com Navegação e Ação */}
      <Header
        onOpenNewGoalModal={handleOpenCreateModal}
        totalGoals={goals.length}
      />

      {/* Conteúdo Principal */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Hero Section Acolhedor */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              <Terminal className="h-3.5 w-3.5" />
              <span>git commit -m &quot;aprendizado contínuo&quot;</span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Organize seus objetivos de estudo em tecnologia
            </h1>

            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              Mantenha o foco no que você precisa aprender hoje para alcançar a sua próxima oportunidade como desenvolvedor ou estudante tech.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Cadastrar Novo Objetivo</span>
              </button>

              {goals.length === 0 && (
                <button
                  type="button"
                  onClick={handleLoadSamples}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Carregar Exemplos Prontos</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Resumo e Progresso */}
        {isClient && <StatsOverview goals={goals} />}

        {/* Lista de Objetivos (Ordenados: Mais Novo em Cima) */}
        {isClient ? (
          <section aria-label="Objetivos de estudo">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Meus Objetivos de Estudo
                </h2>
                <p className="text-xs text-slate-500">
                  Adicionados recentemente aparecem no topo
                </p>
              </div>
            </div>

            <GoalList
              goals={goals}
              onEditGoal={handleOpenEditModal}
              onDeleteGoalRequest={handleDeleteRequest}
              onStatusChange={handleStatusChange}
              onNewGoal={handleOpenCreateModal}
              onLoadSamples={handleLoadSamples}
            />
          </section>
        ) : (
          <div className="flex h-48 items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <p className="mt-2 text-xs text-slate-500">Carregando seus objetivos...</p>
            </div>
          </div>
        )}
      </main>

      {/* Rodapé Acolhedor */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:px-6">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-indigo-500" />
            <span className="font-mono font-semibold text-slate-800">gitfocus</span>
            <span>· Desenvolvido para impulsionar seus estudos</span>
          </div>
          <div>
            Dados salvos localmente no seu navegador via <span className="font-mono text-slate-700">localStorage</span>
          </div>
        </div>
      </footer>

      {/* Modal de Formulário montado com key para resetar o estado limpo */}
      {isFormModalOpen && (
        <GoalFormModal
          key={editingGoal ? `edit-${editingGoal.id}` : 'create'}
          isOpen={isFormModalOpen}
          mode={formMode}
          initialGoal={editingGoal}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingGoal(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        goal={deletingGoal}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingGoal(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Notificação Toast Flutuante */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </aside>
      )}
    </div>
  );
}
