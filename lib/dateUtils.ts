/**
 * Utilitários para formatação e cálculo de datas em PT-BR
 */

export function formatDatePtBR(dateString: string): string {
  if (!dateString) return 'Sem prazo definido';
  try {
    // Corrige para o timezone local sem deslocamento de dia
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatCreationDate(timestamp: number): string {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export interface DeadlineInfo {
  label: string;
  isOverdue: boolean;
  isDueToday: boolean;
  isDueSoon: boolean; // dentro de 3 dias
  daysDiff: number;
}

export function getDeadlineInfo(dateString: string, isCompleted: boolean = false): DeadlineInfo {
  if (!dateString) {
    return {
      label: 'Sem prazo',
      isOverdue: false,
      isDueToday: false,
      isDueSoon: false,
      daysDiff: 0,
    };
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(23, 59, 59, 999);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (isCompleted) {
    return {
      label: 'Concluído',
      isOverdue: false,
      isDueToday: false,
      isDueSoon: false,
      daysDiff,
    };
  }

  if (daysDiff < 0) {
    const daysLate = Math.abs(daysDiff);
    return {
      label: `Vencido há ${daysLate} ${daysLate === 1 ? 'dia' : 'dias'}`,
      isOverdue: true,
      isDueToday: false,
      isDueSoon: false,
      daysDiff,
    };
  }

  if (daysDiff === 0 || daysDiff === 1) {
    return {
      label: 'Vence hoje',
      isOverdue: false,
      isDueToday: true,
      isDueSoon: true,
      daysDiff,
    };
  }

  if (daysDiff <= 3) {
    return {
      label: `Vence em ${daysDiff} dias`,
      isOverdue: false,
      isDueToday: false,
      isDueSoon: true,
      daysDiff,
    };
  }

  return {
    label: `Faltam ${daysDiff} dias`,
    isOverdue: false,
    isDueToday: false,
    isDueSoon: false,
    daysDiff,
  };
}
