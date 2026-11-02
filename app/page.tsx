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
      showToast('Objetivo cadastrado no backlog!');
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
        showToast('Parabéns! Objetivo movido para Concluído! 🎉');
      } else if (newStatus === 'em_andamento') {
        showToast('Objetivo movido para Em Progresso! 🚀');
      } else {
        showToast('Objetivo movido para A Fazer.');
      }
    }
  };

  // Handler para recarregar exemplos
  const handleLoadSamples = () => {
    storageService.resetToSamples();
    showToast('Exemplos de objetivos tech carregados!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121214] text-[#E1E1E6] font-sans antialiased">
      {/* Header com Navegação e Ação */}
      <Header
        onOpenNewGoalModal={handleOpenCreateModal}
        totalGoals={goals.length}
      />

      {/* Conteúdo Principal */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        {/* Hero Section Estilo Dev / Jira / GitHub */}
        <section className="relative overflow-hidden rounded-2xl border border-[#29292E] bg-[#1A1A1E] p-5 sm:p-7 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-md bg-[#121214] px-2.5 py-1 text-xs font-mono text-[#64B5F6] border border-[#29292E]">
              <Terminal className="h-3.5 w-3.5" />
              <span>git commit -m &quot;foco continuo nos estudos&quot;</span>
            </div>

            <h1 className="mt-3 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#EDEDEF] leading-tight">
              Gerencie seus objetivos de estudo em tecnologia
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-[#8D8D99] leading-relaxed max-w-2xl">
              Interface desenhada para longas horas de foco. Acompanhe seu progresso de aprendizado com clareza visual, sem sobrecarga ou poluição de cores.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 rounded-lg bg-[#64B5F6] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#121214] shadow-sm hover:bg-[#85c6f8] active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Novo Objetivo</span>
              </button>

              {goals.length === 0 && (
                <button
                  type="button"
                  onClick={handleLoadSamples}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#29292E] bg-[#121214] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#8D8D99] hover:bg-[#29292E] hover:text-[#EDEDEF] transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-[#FFB74D]" />
                  <span>Carregar Exemplos Prontos</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Resumo e Progresso */}
        {isClient && <StatsOverview goals={goals} />}

        {/* Quadro Kanban e Lista de Objetivos */}
        {isClient ? (
          <section aria-label="Quadro de objetivos de estudo" className="pt-2">
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
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#64B5F6] border-t-transparent" />
              <p className="mt-2 text-xs text-[#8D8D99] font-mono">Carregando objetivos...</p>
            </div>
          </div>
        )}
      </main>

      {/* Rodapé Acolhedor estilo Dev */}
      <footer className="mt-auto border-t border-[#29292E] bg-[#121214] py-6">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3 px-4 text-xs text-[#71717A] sm:px-6">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-[#64B5F6]" />
            <span className="font-mono font-semibold text-[#C4C4CC]">gitfocus</span>
            <span>· Desenvolvido para impulsionar sua evolução tech</span>
          </div>
          <div className="font-mono text-[11px] text-[#71717A]">
            Persistência local via <span className="text-[#8D8D99]">localStorage</span>
          </div>
        </div>
      </footer>

      {/* Modal de Formulário */}
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
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl bg-[#1A1A1E] border border-[#29292E] px-4 py-3 text-xs font-medium text-[#EDEDEF] shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCheck className="h-4 w-4 text-[#81C784] shrink-0" />
          <span>{toastMessage}</span>
        </aside>
      )}
    </div>
  );
}
