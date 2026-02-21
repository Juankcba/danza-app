'use client';

import { Card, CardBody, Button, Link, Divider } from '@heroui/react';
import { useFormik } from 'formik';
import { loginSchema } from '@/lib/validations';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 rounded-xl bg-default-100/50 border text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-primary ${hasError ? 'border-danger' : 'border-default-200'
  }`;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Email o contraseña incorrectos');
        } else {
          router.push('/dashboard');
          router.refresh();
        }
      } catch {
        setError('Error de conexión');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-md glass border border-default-100 relative z-10">
        <CardBody className="p-8 space-y-6">
          <div className="text-center">
            <Link href="/" className="inline-block mb-4">
              <h1 className="text-2xl font-bold gradient-text">
                Alma & Expresión
              </h1>
            </Link>
            <p className="text-foreground/60">Ingresá a tu cuenta</p>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-foreground/80 mb-2">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass(!!formik.touched.email && !!formik.errors.email)}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-danger text-xs mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-foreground/80 mb-2">
                Contraseña
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Tu contraseña"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass(!!formik.touched.password && !!formik.errors.password)}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-danger text-xs mt-1">{formik.errors.password}</p>
              )}
            </div>

            <div className="text-right">
              <Link href="/recuperar-password" className="text-sm text-primary">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              color="primary"
              variant="flat"
              fullWidth
              radius="full"
              isLoading={formik.isSubmitting}
              className="font-semibold bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/25"
            >
              Ingresar
            </Button>
          </form>

          <Divider />

          <Button
            variant="bordered"
            fullWidth
            radius="full"
            className="border-default-200"
            onPress={() => signIn('google', { callbackUrl: '/dashboard' })}
            startContent={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            }
          >
            Continuar con Google
          </Button>

          <p className="text-center text-sm text-foreground/60">
            ¿No tenés cuenta?{' '}
            <Link href="/registro" className="text-primary font-semibold">
              Registrate
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
