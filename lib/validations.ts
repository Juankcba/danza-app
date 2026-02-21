import * as Yup from 'yup';

export const loginSchema = Yup.object({
    email: Yup.string()
        .email('Email inválido')
        .required('El email es obligatorio'),
    password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es obligatoria'),
});

export const registerSchema = Yup.object({
    name: Yup.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .required('El nombre es obligatorio'),
    email: Yup.string()
        .email('Email inválido')
        .required('El email es obligatorio'),
    password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es obligatoria'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Confirmar la contraseña es obligatorio'),
});

export const courseSchema = Yup.object({
    name: Yup.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .required('El nombre es obligatorio'),
    description: Yup.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .required('La descripción es obligatoria'),
    level: Yup.string()
        .oneOf(['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'], 'Nivel inválido')
        .required('El nivel es obligatorio'),
    duration: Yup.string()
        .required('La duración es obligatoria'),
    schedule: Yup.string()
        .required('El horario es obligatorio'),
    price: Yup.number()
        .positive('El precio debe ser positivo')
        .required('El precio es obligatorio'),
    capacity: Yup.number()
        .integer('La capacidad debe ser un número entero')
        .positive('La capacidad debe ser positiva')
        .required('La capacidad es obligatoria'),
    instructorId: Yup.string()
        .required('El instructor es obligatorio'),
});

export const contactSchema = Yup.object({
    name: Yup.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .required('El nombre es obligatorio'),
    email: Yup.string()
        .email('Email inválido')
        .required('El email es obligatorio'),
    message: Yup.string()
        .min(10, 'El mensaje debe tener al menos 10 caracteres')
        .required('El mensaje es obligatorio'),
});

export const enrollmentSchema = Yup.object({
    courseId: Yup.string()
        .required('Debes seleccionar un curso'),
    phone: Yup.string()
        .matches(/^[0-9+\-\s()]+$/, 'Teléfono inválido')
        .optional(),
});

export const recoverPasswordSchema = Yup.object({
    email: Yup.string()
        .email('Email inválido')
        .required('El email es obligatorio'),
});
