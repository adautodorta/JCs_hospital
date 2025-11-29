/**
 * Cliente API para comunicação com o backend.
 * 
 * Este módulo centraliza todas as chamadas HTTP para a API REST.
 * 
 * Funcionalidades:
 * - Gerencia autenticação JWT automaticamente
 * - Adiciona token de autorização em todas as requisições
 * - Fornece interfaces TypeScript para type safety
 * - Organiza endpoints por módulo (Profiles, Queue, Records, Attendance)
 * 
 * Regras de Autenticação:
 * - Token JWT é obtido do localStorage (chave: "access_token")
 * - Token é enviado no header Authorization como "Bearer <token>"
 * - Se token não existir, requisição é feita sem autenticação
 */
import config from "@/utils/config";

export interface ProfilesSummary {
  id: string;
  full_name: string;
  role: string;
  document_number: string;
  date_of_birth: string;
  priority: boolean;
  gender: string;
  mom_full_name: string;
  address: string;
  nationality: string;
}

interface CheckinQueueProps {
  id?: string;
  checkin?: string;
  profile_id?: string;
  status?: string;
  assigned_doctor_id?: string | undefined;
}

export interface GetPositionQueueProps {
  position?: number;
  status?: string;
}

export interface RecordsSummaryProps {
  id: number;
  doctor_id: string;
  patient_id: string;
  started_at: string;
  end_at: string;
  subjective: string;
  objective_data: string;
  assessment: string;
  planning: string;
}

export interface CallNextResponse {
  message: string;
  called: {
    id: string;
    checkin: string;
    profile_id: string;
    status: string;
    assigned_doctor_id: string | null;
  } | null;
}

/**
 * Função auxiliar para fazer requisições HTTP autenticadas.
 * 
 * Regras de Negócio:
 * 1. Obtém token JWT do localStorage automaticamente
 * 2. Adiciona header Authorization se token existir
 * 3. Configura Content-Type como application/json por padrão
 * 4. Trata erros HTTP (status não OK)
 * 
 * @param input - URL ou Request object
 * @param init - Opções de configuração da requisição (método, body, etc.)
 * @returns Promise com Response da requisição
 */
async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  // Obtém token JWT do localStorage
  // Token é armazenado após login bem-sucedido via Supabase Auth
  const token = localStorage.getItem("access_token");

  // Configura headers da requisição
  const headers = new Headers(init?.headers ?? {});
  headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");

  // Adiciona token de autorização se existir
  // Formato: "Bearer <token>" conforme padrão JWT
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Executa requisição HTTP
  const response = await fetch(input, {
    ...init,
    headers,
  });

  // Log de erros HTTP para debugging
  // Regra: Erros são tratados pelos componentes que chamam a API
  if (!response.ok) {
    console.error(response.status);
  }

  return response;
}

/**
 * API de Perfis de Usuários.
 * 
 * Endpoints disponíveis:
 * - getInfoMe: Retorna perfil do usuário autenticado (requer autenticação)
 * - getAllProfiles: Lista todos os perfis (público)
 * - getProfileById: Busca perfil específico por ID (público)
 */
export const ProfilesAPI = {
  /**
   * Retorna o perfil do usuário autenticado.
   * Regra: Requer autenticação JWT válida
   */
  getInfoMe: async (): Promise<ProfilesSummary> => {
    const response = await apiFetch(`${config.baseUrl}/profiles/me`, {
      method: "GET",
    });

    return (await response.json()) as ProfilesSummary;
  },

  /**
   * Lista todos os perfis cadastrados no sistema.
   * Regra: Endpoint público, não requer autenticação
   */
  getAllProfiles: async (): Promise<ProfilesSummary[]> => {
    const response = await apiFetch(`${config.baseUrl}/profiles/`, {
      method: "GET",
    });

    return (await response.json()) as ProfilesSummary[];
  },

  /**
   * Busca um perfil específico por ID.
   * Regra: Endpoint público, utilizado para visualizar perfil de outros usuários
   */
  getProfileById: async (profileId: string): Promise<ProfilesSummary> => {
    const response = await apiFetch(`${config.baseUrl}/profiles/${profileId}`, {
      method: "GET",
    });

    return (await response.json()) as ProfilesSummary;
  },
};

/**
 * API de Fila de Atendimento.
 * 
 * Gerencia check-in, cancelamento e posição na fila.
 * 
 * Regras de Negócio:
 * - checkIn: Paciente entra na fila (requer autenticação)
 * - cancel: Paciente cancela check-in (requer autenticação)
 * - getMyPosition: Retorna posição considerando priorização (requer autenticação)
 * - callNext: Médico chama próximo paciente (requer autenticação de médico)
 * - getAllQueue: Lista toda a fila (público)
 */
export const QueueAPI = {
  /**
   * Lista toda a fila de atendimento.
   * Regra: Endpoint público, mostra todos os pacientes aguardando
   */
  getAllQueue: async (): Promise<CheckinQueueProps[]> => {
    const response = await apiFetch(`${config.baseUrl}/queue/`, {
      method: "GET",
    });

    return (await response.json()) as CheckinQueueProps[];
  },

  /**
   * Realiza check-in do paciente na fila.
   * Regra: Requer autenticação, registra paciente com status "waiting"
   */
  checkIn: async (): Promise<CheckinQueueProps> => {
    const response = await apiFetch(`${config.baseUrl}/queue/checkin`, {
      method: "POST",
    });

    return response.json() as CheckinQueueProps;
  },

  /**
   * Cancela check-in do paciente.
   * Regra: Requer autenticação, remove paciente da fila
   */
  cancel: async () => {
    await apiFetch(`${config.baseUrl}/queue/checkin`, {
      method: "DELETE",
    });
  },

  /**
   * Retorna posição do paciente na fila.
   * Regra: Considera priorização (pacientes prioritários primeiro)
   * Retorna: {status: "waiting"|"called"|"not_in_queue", position?: number}
   */
  getMyPosition: async (): Promise<GetPositionQueueProps> => {
    const response = await apiFetch(`${config.baseUrl}/queue/position`, {
      method: "GET",
    });
    return response.json() as GetPositionQueueProps;
  },

  /**
   * Médico chama próximo paciente da fila.
   * Regra: Requer autenticação de médico, aplica priorização
   * Retorna: Dados do paciente chamado ou mensagem se fila vazia
   */
  callNext: async (): Promise<CallNextResponse> => {
    const response = await apiFetch(`${config.baseUrl}/queue/next`, {
      method: "POST",
    });

    const json = (await response.json()) as unknown;

    const data = json as CallNextResponse;

    return data;
  },
};

/**
 * API de Registros Médicos.
 * 
 * Gerencia acesso aos prontuários eletrônicos criados durante atendimentos.
 * 
 * Regras de Negócio:
 * - Registros são permanentes e não podem ser alterados após criação
 * - Utilizam metodologia SOAP (Subjective, Objective, Assessment, Planning)
 * - Ordenação padrão: mais antigos primeiro
 */
export const RecordsAPI = {
  /**
   * Lista todos os registros médicos do sistema.
   * Regra: Endpoint público, utilizado por admin
   */
  getAllRecords: async (): Promise<RecordsSummaryProps[]> => {
    const response = await apiFetch(`${config.baseUrl}/records/`, {
      method: "GET",
    });
    return (await response.json()) as RecordsSummaryProps[];
  },

  /**
   * Lista registros médicos do usuário autenticado.
   * Regra: Requer autenticação, retorna histórico do próprio paciente
   */
  getRecordsMe: async (): Promise<RecordsSummaryProps[]> => {
    const response = await apiFetch(`${config.baseUrl}/records/me`, {
      method: "GET",
    });

    return (await response.json()) as RecordsSummaryProps[];
  },

  /**
   * Lista registros médicos de um paciente específico.
   * Regra: Endpoint público, utilizado por médicos para ver histórico do paciente
   */
  getRecordsByPatientId: async (patientId: string): Promise<RecordsSummaryProps[]> => {
    const response = await apiFetch(`${config.baseUrl}/records/by_patient/${patientId}`, {
      method: "GET",
    });

    return (await response.json()) as RecordsSummaryProps[];
  },

  /**
   * Busca um registro médico específico por ID.
   * Regra: Endpoint público, retorna detalhes completos incluindo dados SOAP
   */
  getRecordById: async (recordId: string): Promise<RecordsSummaryProps> => {
    const response = await apiFetch(`${config.baseUrl}/records/${recordId}`, {
      method: "GET",
    });

    return (await response.json()) as RecordsSummaryProps;
  },
};

/**
 * API de Atendimento Médico.
 * 
 * Gerencia finalização de atendimentos e criação de registros médicos.
 * 
 * Regras de Negócio (CRÍTICAS):
 * - Apenas médicos podem finalizar atendimentos
 * - Utiliza metodologia SOAP para registro
 * - Ao finalizar, cria registro médico permanente e remove paciente da fila
 * - Médico pode ter apenas um atendimento ativo por vez
 */
export const AttendanceAPI = {
  /**
   * Finaliza atendimento e cria registro médico.
   * 
   * Regras:
   * - Requer autenticação de médico
   * - Todos os campos SOAP são obrigatórios
   * - Cria registro permanente no banco de dados
   * - Remove paciente da fila após criar registro
   * 
   * @param payload - Dados do atendimento em formato SOAP
   * @returns Registro médico criado
   */
  finish: async (payload: {
    subjective: string;      // SOAP: Dados subjetivos
    objective_data: string;   // SOAP: Dados objetivos
    assessment: string;       // SOAP: Avaliação e diagnóstico
    planning: string;         // SOAP: Plano de tratamento
  }): Promise<RecordsSummaryProps> => {
    const response = await apiFetch(`${config.baseUrl}/attendance/finish`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return (await response.json()) as RecordsSummaryProps;
  },
};
