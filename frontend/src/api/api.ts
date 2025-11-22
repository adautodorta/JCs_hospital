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

async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem("access_token");

  const headers = new Headers(init?.headers ?? {});
  headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (!response.ok) {
    console.error(response.status);
  }

  return response;
}

export const ProfilesAPI = {
  getInfoMe: async (): Promise<ProfilesSummary> => {
    const response = await apiFetch(`${config.baseUrl}/profiles/me`, {
      method: "GET",
    });

    return (await response.json()) as ProfilesSummary;
  },

  getAllProfiles: async (): Promise<ProfilesSummary[]> => {
    const response = await apiFetch(`${config.baseUrl}/profiles/`, {
      method: "GET",
    });

    return (await response.json()) as ProfilesSummary[];
  },

  getProfileById: async (profileId: string): Promise<ProfilesSummary> => {
    const response = await apiFetch(`${config.baseUrl}/profiles/${profileId}`, {
      method: "GET",
    });

    return (await response.json()) as ProfilesSummary;
  },
};

export const QueueAPI = {
  getAllQueue: async (): Promise<CheckinQueueProps[]> => {
    const response = await apiFetch(`${config.baseUrl}/queue/`, {
      method: "GET",
    });

    return (await response.json()) as CheckinQueueProps[];
  },

  checkIn: async (): Promise<CheckinQueueProps> => {
    const response = await apiFetch(`${config.baseUrl}/queue/checkin`, {
      method: "POST",
    });

    return response.json() as CheckinQueueProps;
  },

  cancel: async () => {
    await apiFetch(`${config.baseUrl}/queue/checkin`, {
      method: "DELETE",
    });
  },

  getMyPosition: async (): Promise<GetPositionQueueProps> => {
    const response = await apiFetch(`${config.baseUrl}/queue/position`, {
      method: "GET",
    });
    return response.json() as GetPositionQueueProps;
  },
};

export const RecordsAPI = {
  getAllRecords: async (): Promise<RecordsSummaryProps[]> => {
    const response = await apiFetch(`${config.baseUrl}/records/`, {
      method: "GET",
    });
    return (await response.json()) as RecordsSummaryProps[];
  },

  getRecordsMe: async (): Promise<RecordsSummaryProps[]> => {
    const response = await apiFetch(`${config.baseUrl}/records/me`, {
      method: "GET",
    });

    return (await response.json()) as RecordsSummaryProps[];
  },

  getRecordsByPatientId: async (patientId: string): Promise<RecordsSummaryProps[]> => {
    const response = await apiFetch(`${config.baseUrl}/records/patient/${patientId}`, {
      method: "GET",
    });

    return (await response.json()) as RecordsSummaryProps[];
  },
};
