

export interface QueryReceta {
  creadoPorId?: string;
  ingredientes?: { $regex: string; $options: string };
  temporadaId?: string;
}
