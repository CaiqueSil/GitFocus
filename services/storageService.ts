import { Goal, GoalFormData } from '@/types/goal';

const STORAGE_KEY = 'gitfocus_study_goals_v1';

/**
 * Exemplos iniciais acolhedores para estudantes de tecnologia
 * Carregados apenas se o localStorage nunca tiver sido inicializado.
 */
export const INITIAL_SAMPLE_GOALS: Goal[] = [
  {
    id: 'sample-1',
    title: 'Dominar TypeScript Avançado: Generics e Utility Types',
    description: 'Aprender a tipar estruturas complexas, Record, Omit, Partial, infer e criar tipos genéricos reutilizáveis para projetos React.',
    deadline: getFutureDate(7),
    status: 'em_andamento',
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 horas atrás
  },
  {
    id: 'sample-2',
    title: 'Construir uma API RESTful completa com Next.js & Node',
    description: 'Praticar rotas de API, validação com Zod, tratamento robusto de erros e testes manuais de endpoints.',
    deadline: getFutureDate(14),
    status: 'nao_iniciado',
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 dia atrás
  },
  {
    id: 'sample-3',
    title: 'Estudo de Git & GitHub: branches, PRs e resolução de conflitos',
    description: 'Entender fluxo de trabalho de times tech: rebase vs merge, commits semânticos e boas práticas de pull request.',
    deadline: getFutureDate(2),
    status: 'concluido',
    createdAt: Date.now() - 1000 * 60 * 60 * 48, // 2 dias atrás
  },
];

function getFutureDate(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `goal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

class StorageService {
  private listeners = new Set<() => void>();
  private memoryCache: Goal[] | null = null;
  private readonly emptyArray: Goal[] = [];

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Assinatura para sincronização reativa com React 18/19 (useSyncExternalStore)
   */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * Snapshot do cliente para useSyncExternalStore
   */
  getSnapshot = (): Goal[] => {
    if (!this.memoryCache) {
      this.memoryCache = this.getAll();
    }
    return this.memoryCache;
  };

  /**
   * Snapshot do servidor (SSR seguro)
   */
  getServerSnapshot = (): Goal[] => {
    return this.emptyArray;
  };

  /**
   * Retorna todos os objetivos armazenados.
   * Se for o primeiro acesso, popula com exemplos acolhedores.
   */
  getAll(): Goal[] {
    if (!this.isBrowser()) {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Inicializa com dados de exemplo na primeira visita para acolher o estudante
        this.saveAll(INITIAL_SAMPLE_GOALS);
        return [...INITIAL_SAMPLE_GOALS];
      }
      const parsed: Goal[] = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed;
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  }

  /**
   * Salva a lista inteira de objetivos no localStorage e notifica assinantes.
   */
  saveAll(goals: Goal[]): void {
    this.memoryCache = goals;
    if (this.isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
      } catch (error) {
        console.error('Erro ao salvar objetivos no localStorage:', error);
      }
    }
    this.notify();
  }

  /**
   * Cadastra um novo objetivo.
   * Adiciona o timestamp `createdAt` para garantir a ordenação "mais novo em cima".
   */
  create(data: GoalFormData): Goal {
    const goals = this.getAll();
    const newGoal: Goal = {
      id: generateId(),
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: Date.now(), // Marca temporal precisa para ordenação
    };

    // Salva novo objetivo (armazenamos com o mais recente no início)
    const updatedGoals = [newGoal, ...goals];
    this.saveAll(updatedGoals);
    return newGoal;
  }

  /**
   * Edita um objetivo existente pelo ID.
   */
  update(id: string, updates: Partial<GoalFormData>): Goal | null {
    const goals = this.getAll();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return null;

    const existing = goals[index];
    const updatedGoal: Goal = {
      ...existing,
      ...updates,
      title: updates.title !== undefined ? updates.title.trim() : existing.title,
      description: updates.description !== undefined ? updates.description.trim() : existing.description,
      updatedAt: Date.now(),
    };

    const newGoals = [...goals];
    newGoals[index] = updatedGoal;
    this.saveAll(newGoals);
    return updatedGoal;
  }

  /**
   * Atualiza apenas o status de um objetivo (atalho rápido).
   */
  updateStatus(id: string, status: Goal['status']): Goal | null {
    return this.update(id, { status });
  }

  /**
   * Exclui um objetivo pelo ID após confirmação do usuário.
   */
  delete(id: string): boolean {
    const goals = this.getAll();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length === goals.length) {
      return false;
    }
    this.saveAll(filtered);
    return true;
  }

  /**
   * Limpa todos os objetivos salvos.
   */
  clearAll(): void {
    this.saveAll([]);
  }

  /**
   * Restaura os exemplos iniciais.
   */
  resetToSamples(): Goal[] {
    this.saveAll(INITIAL_SAMPLE_GOALS);
    return [...INITIAL_SAMPLE_GOALS];
  }
}

export const storageService = new StorageService();
