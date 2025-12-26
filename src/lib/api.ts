// API Configuration for Spring Boot Backend
// Update this URL when your backend is deployed

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Owner API
export const ownerApi = {
  getAll: () => fetchApi<Owner[]>('/owners'),
  getById: (id: number) => fetchApi<Owner>(`/owners/${id}`),
  create: (owner: Omit<Owner, 'id'>) => 
    fetchApi<Owner>('/owners', { method: 'POST', body: JSON.stringify(owner) }),
  update: (id: number, owner: Partial<Owner>) => 
    fetchApi<Owner>(`/owners/${id}`, { method: 'PUT', body: JSON.stringify(owner) }),
  delete: (id: number) => 
    fetchApi<void>(`/owners/${id}`, { method: 'DELETE' }),
};

// Pet API
export const petApi = {
  getAll: () => fetchApi<Pet[]>('/pets'),
  getById: (id: number) => fetchApi<Pet>(`/pets/${id}`),
  getByOwner: (ownerId: number) => fetchApi<Pet[]>(`/owners/${ownerId}/pets`),
  create: (pet: Omit<Pet, 'id'>) => 
    fetchApi<Pet>('/pets', { method: 'POST', body: JSON.stringify(pet) }),
  update: (id: number, pet: Partial<Pet>) => 
    fetchApi<Pet>(`/pets/${id}`, { method: 'PUT', body: JSON.stringify(pet) }),
  delete: (id: number) => 
    fetchApi<void>(`/pets/${id}`, { method: 'DELETE' }),
};

// Visit API
export const visitApi = {
  getAll: () => fetchApi<Visit[]>('/visits'),
  getById: (id: number) => fetchApi<Visit>(`/visits/${id}`),
  getByPet: (petId: number) => fetchApi<Visit[]>(`/pets/${petId}/visits`),
  create: (visit: Omit<Visit, 'id'>) => 
    fetchApi<Visit>('/visits', { method: 'POST', body: JSON.stringify(visit) }),
  update: (id: number, visit: Partial<Visit>) => 
    fetchApi<Visit>(`/visits/${id}`, { method: 'PUT', body: JSON.stringify(visit) }),
  delete: (id: number) => 
    fetchApi<void>(`/visits/${id}`, { method: 'DELETE' }),
};

// Vet API
export const vetApi = {
  getAll: () => fetchApi<Vet[]>('/vets'),
  getById: (id: number) => fetchApi<Vet>(`/vets/${id}`),
  create: (vet: Omit<Vet, 'id'>) => 
    fetchApi<Vet>('/vets', { method: 'POST', body: JSON.stringify(vet) }),
  update: (id: number, vet: Partial<Vet>) => 
    fetchApi<Vet>(`/vets/${id}`, { method: 'PUT', body: JSON.stringify(vet) }),
  delete: (id: number) => 
    fetchApi<void>(`/vets/${id}`, { method: 'DELETE' }),
};

// Types matching Spring Boot entities
export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  telephone: string;
  email?: string;
  pets?: Pet[];
}

export interface Pet {
  id: number;
  name: string;
  birthDate: string;
  type: string;
  breed?: string;
  color?: string;
  ownerId: number;
  owner?: Owner;
  visits?: Visit[];
}

export interface Visit {
  id: number;
  date: string;
  description: string;
  petId: number;
  vetId: number;
  pet?: Pet;
  vet?: Vet;
  status?: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface Vet {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  email?: string;
  phone?: string;
}
