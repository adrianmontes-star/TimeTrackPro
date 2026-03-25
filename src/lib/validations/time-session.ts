import { z } from "zod";

export const timeSessionSchema = z.object({
  taskId: z.string().min(1, "Debe seleccionar una tarea"),
  projectId: z.string().min(1, "Debe seleccionar un proyecto"),
  startTime: z.coerce.date({ errorMap: () => ({ message: "La hora de inicio es requerida" }) }),
  endTime: z.coerce.date().nullable().optional(),
  duration: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const manualTimeEntrySchema = z.object({
  taskId: z.string().min(1, "Debe seleccionar una tarea"),
  projectId: z.string().min(1, "Debe seleccionar un proyecto"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida"),
  notes: z.string().optional(),
});
