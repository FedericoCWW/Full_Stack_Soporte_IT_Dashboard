import {z} from "zod";

export const schema = z.object({
    name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
    email: z.string().email(),
    role: z.enum(['admin', 'user']),
    area: z.string().min(6, 'Area debe tener al menos 2 caracteres'),
    image: z.string().optional(),
    imageCldPubId: z.string().optional(),
    password: z.string().min(8),
});

export const taskSchema = z.object({
    name: z.string().min(3, "La Tarea debe tener al menos 3 caracteres"),
    code: z.string().min(5, "El Código debe tener al menos 5 caracteres"),
    description: z
        .string()
        .min(5, "La Descripción debe tener al menos 5 caracteres"),
    area: z.string().min(6, "La Area debe tener al menos 6 caracteres"),
});

const scheduleSchema = z.object({
    day: z.string().min(1, "El Día es requerido"),
    startTime: z.string().min(1, "La Hora de Inicio es requerida"),
    endTime: z.string().min(1, "La Hora de Fin es requerida"),
});

export const classSchema = z.object({
    name: z
        .string()
        .min(2, "El Nombre debe tener al menos 2 caracteres")
        .max(50, "El Nombre debe tener al menos 50 caracteres"),
    description: z
        .string({ required_error: "Descripción requerida" })
        .min(5, "La descripción debe tener al menos 5 caracteres"),
    areaId: z.coerce
        .number({
            required_error: "El área es requerida",
            invalid_type_error: "El área es requerida",
        })
        .min(1, "El área es requerida"),
    taskId: z.coerce
        .number({
            required_error: "La Tarea es requerida",
            invalid_type_error: "La Tarea es requerida",
        })
        .min(1, "La Tarea es requerida"),
    userId: z.string().min(1, "El Usuario es requerido"),
    status: z.enum(["Activo", "Inactivo"]),
});

export const enrollmentSchema = z.object({
    classId: z.coerce
        .number({
            required_error: "La Clase es requerida",
            invalid_type_error: "La Clase es requerida",
        })
        .min(1, "La Clase es requerida"),
    userId: z.string().min(1, "El Usuario es requerido"),
});



export type Schema = z.infer<typeof schema>;