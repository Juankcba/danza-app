'use client';

import { Card, CardBody, Button, Link } from '@heroui/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

const resetSchema = yup.object({
    password: yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es obligatoria'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Confirmá tu contraseña'),
});

const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl bg-default-100/50 border text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-primary ${hasError ? 'border-danger' : 'border-default-200'}`;

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const formik = useFormik({
        initialValues: { password: '', confirmPassword: '' },
        validationSchema: resetSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setError('');
            try {
                const res = await fetch('/api/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, password: values.password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || 'Error al restablecer la contraseña');
                    return;
                }

                setSuccess(true);
            } catch {
                setError('Error de conexión. Intentá de nuevo.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (!token) {
        return (
            <div className="text-center space-y-4">
                <div className="text-4xl">⚠️</div>
                <p className="text-foreground/70">
                    El enlace no es válido. Necesitás acceder desde el email que te enviamos.
                </p>
                <Button
                    size="lg"
                    radius="full"
                    className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold"
                    onPress={() => router.push('/recuperar-password')}
                >
                    Solicitar nuevo enlace
                </Button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="text-4xl">✅</div>
                <h2 className="text-lg font-bold">¡Contraseña actualizada!</h2>
                <p className="text-foreground/70">
                    Tu contraseña fue restablecida correctamente. Ya podés ingresar con tu nueva contraseña.
                </p>
                <Button
                    size="lg"
                    radius="full"
                    className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold"
                    onPress={() => router.push('/login')}
                >
                    Ir al Login
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="text-center">
                <Link href="/" className="inline-block mb-4">
                    <h1 className="text-2xl font-bold gradient-text">
                        Alma & Expresión
                    </h1>
                </Link>
                <p className="text-foreground/60">Creá tu nueva contraseña</p>
            </div>

            {error && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
                    <p className="text-danger text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="reset-password" className="block text-sm font-medium text-foreground/80 mb-2">
                        Nueva contraseña
                    </label>
                    <input
                        id="reset-password"
                        name="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={inputClass(!!formik.touched.password && !!formik.errors.password)}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-danger text-xs mt-1">{formik.errors.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="reset-confirm" className="block text-sm font-medium text-foreground/80 mb-2">
                        Confirmar contraseña
                    </label>
                    <input
                        id="reset-confirm"
                        name="confirmPassword"
                        type="password"
                        placeholder="Repetí tu contraseña"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={inputClass(!!formik.touched.confirmPassword && !!formik.errors.confirmPassword)}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <p className="text-danger text-xs mt-1">{formik.errors.confirmPassword}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    color="primary"
                    variant="flat"
                    size="lg"
                    fullWidth
                    radius="full"
                    isLoading={formik.isSubmitting}
                    className="font-semibold bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/25"
                >
                    Restablecer Contraseña
                </Button>

                <p className="text-center text-sm text-foreground/60">
                    <Link href="/login" className="text-primary">
                        Volver al Login
                    </Link>
                </p>
            </form>
        </>
    );
}

export default function RestablecerPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

            <Card className="w-full max-w-md glass border border-default-100 relative z-10">
                <CardBody className="p-8 space-y-6">
                    <Suspense fallback={<div className="text-center py-8">Cargando...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </CardBody>
            </Card>
        </div>
    );
}
