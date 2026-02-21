'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import {
    Card,
    CardBody,
    Button,
    Spinner,
    Divider,
    addToast,
} from '@heroui/react';
import { courseSchema } from '@/lib/validations';
import { Header } from '@/components/header';

interface Instructor {
    id: string;
    name: string;
    specialty: string;
}

const levelOptions = [
    { key: 'PRINCIPIANTE', label: 'Principiante' },
    { key: 'INTERMEDIO', label: 'Intermedio' },
    { key: 'AVANZADO', label: 'Avanzado' },
];

const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl bg-default-100/50 border text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-primary ${hasError ? 'border-danger' : 'border-default-200'}`;

const selectClass =
    'w-full px-4 py-3 rounded-xl bg-default-100/50 border border-default-200 text-foreground outline-none transition-colors focus:border-primary appearance-none cursor-pointer';

export default function NuevoCursoPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [instructors, setInstructors] = useState<Instructor[]>([]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (session?.user && (session.user as any).role !== 'ADMIN') {
            router.push('/dashboard');
        }
    }, [status, session, router]);

    useEffect(() => {
        fetch('/api/instructors')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setInstructors(data);
            })
            .catch(console.error);
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            level: 'PRINCIPIANTE',
            duration: '',
            schedule: '',
            price: 0,
            capacity: 15,
            instructorId: '',
        },
        validationSchema: courseSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const res = await fetch('/api/courses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...values,
                        price: Number(values.price),
                        capacity: Number(values.capacity),
                    }),
                });

                if (res.ok) {
                    addToast({
                        title: '¡Curso creado exitosamente!',
                        color: 'success',
                    });
                    router.push('/admin');
                } else {
                    const data = await res.json();
                    addToast({
                        title: 'Error',
                        description: data.error || 'No se pudo crear el curso',
                        color: 'danger',
                    });
                }
            } catch {
                addToast({ title: 'Error de conexión', color: 'danger' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" color="secondary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-2xl mx-auto px-6 py-10">
                {/* Back button */}
                <button
                    type="button"
                    onClick={() => router.push('/admin')}
                    className="text-sm text-foreground/60 hover:text-foreground transition-colors mb-6 cursor-pointer flex items-center gap-1"
                >
                    ← Volver al panel
                </button>

                <Card className="glass border border-default-100">
                    <CardBody className="p-8">
                        <h1 className="text-2xl font-bold mb-2">Nuevo Curso</h1>
                        <p className="text-foreground/60 text-sm mb-6">
                            Completá los datos para crear un nuevo curso
                        </p>
                        <Divider className="mb-6" />

                        <form onSubmit={formik.handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label htmlFor="course-name" className="block text-sm font-medium text-foreground/80 mb-2">
                                    Nombre del curso
                                </label>
                                <input
                                    id="course-name"
                                    name="name"
                                    placeholder="ej: Salsa Nivel 1"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={inputClass(!!formik.touched.name && !!formik.errors.name)}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <p className="text-danger text-xs mt-1">{formik.errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="course-desc" className="block text-sm font-medium text-foreground/80 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    id="course-desc"
                                    name="description"
                                    rows={3}
                                    placeholder="Describí el contenido del curso..."
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`${inputClass(!!formik.touched.description && !!formik.errors.description)} resize-none`}
                                />
                                {formik.touched.description && formik.errors.description && (
                                    <p className="text-danger text-xs mt-1">{formik.errors.description}</p>
                                )}
                            </div>

                            {/* Level + Duration */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="course-level" className="block text-sm font-medium text-foreground/80 mb-2">
                                        Nivel
                                    </label>
                                    <select
                                        id="course-level"
                                        name="level"
                                        value={formik.values.level}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={selectClass}
                                    >
                                        {levelOptions.map((opt) => (
                                            <option key={opt.key} value={opt.key}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="course-duration" className="block text-sm font-medium text-foreground/80 mb-2">
                                        Duración
                                    </label>
                                    <input
                                        id="course-duration"
                                        name="duration"
                                        placeholder="ej: 3 meses"
                                        value={formik.values.duration}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={inputClass(!!formik.touched.duration && !!formik.errors.duration)}
                                    />
                                    {formik.touched.duration && formik.errors.duration && (
                                        <p className="text-danger text-xs mt-1">{formik.errors.duration}</p>
                                    )}
                                </div>
                            </div>

                            {/* Schedule */}
                            <div>
                                <label htmlFor="course-schedule" className="block text-sm font-medium text-foreground/80 mb-2">
                                    Horario
                                </label>
                                <input
                                    id="course-schedule"
                                    name="schedule"
                                    placeholder="ej: Lunes y Miércoles 18:00 - 19:30"
                                    value={formik.values.schedule}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={inputClass(!!formik.touched.schedule && !!formik.errors.schedule)}
                                />
                                {formik.touched.schedule && formik.errors.schedule && (
                                    <p className="text-danger text-xs mt-1">{formik.errors.schedule}</p>
                                )}
                            </div>

                            {/* Price + Capacity */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="course-price" className="block text-sm font-medium text-foreground/80 mb-2">
                                        Precio (ARS)
                                    </label>
                                    <input
                                        id="course-price"
                                        name="price"
                                        type="number"
                                        placeholder="ej: 5000"
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={inputClass(!!formik.touched.price && !!formik.errors.price)}
                                    />
                                    {formik.touched.price && formik.errors.price && (
                                        <p className="text-danger text-xs mt-1">{formik.errors.price}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="course-capacity" className="block text-sm font-medium text-foreground/80 mb-2">
                                        Capacidad
                                    </label>
                                    <input
                                        id="course-capacity"
                                        name="capacity"
                                        type="number"
                                        placeholder="ej: 15"
                                        value={formik.values.capacity}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={inputClass(!!formik.touched.capacity && !!formik.errors.capacity)}
                                    />
                                    {formik.touched.capacity && formik.errors.capacity && (
                                        <p className="text-danger text-xs mt-1">{formik.errors.capacity}</p>
                                    )}
                                </div>
                            </div>

                            {/* Instructor */}
                            <div>
                                <label htmlFor="course-instructor" className="block text-sm font-medium text-foreground/80 mb-2">
                                    Instructor
                                </label>
                                <select
                                    id="course-instructor"
                                    name="instructorId"
                                    value={formik.values.instructorId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={selectClass}
                                >
                                    <option value="">Seleccionar instructor...</option>
                                    {instructors.map((inst) => (
                                        <option key={inst.id} value={inst.id}>
                                            {inst.name} — {inst.specialty}
                                        </option>
                                    ))}
                                </select>
                                {formik.touched.instructorId && formik.errors.instructorId && (
                                    <p className="text-danger text-xs mt-1">{formik.errors.instructorId}</p>
                                )}
                            </div>

                            <Divider />

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    variant="flat"
                                    radius="full"
                                    onPress={() => router.push('/admin')}
                                >
                                    Cancelar
                                </Button>
                                <button
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    className="text-sm font-semibold px-8 py-2.5 rounded-full bg-linear-to-r from-pink-500 to-pink-600 text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                                >
                                    {formik.isSubmitting ? 'Creando...' : 'Crear Curso'}
                                </button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
}
