'use client';

import { Card, CardBody, Button, Link } from '@heroui/react';
import { useFormik } from 'formik';
import { recoverPasswordSchema } from '@/lib/validations';
import { useState } from 'react';

export default function RecuperarPasswordPage() {
  const [sent, setSent] = useState(false);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: recoverPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await fetch('/api/password-recovery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: values.email }),
        });
        setSent(true);
      } catch {
        // Still show success to prevent email enumeration
        setSent(true);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-md glass border border-default-100 relative z-10">
        <CardBody className="p-8 space-y-6">
          <div className="text-center">
            <Link href="/" className="inline-block mb-4">
              <h1 className="text-2xl font-bold gradient-text">
                Alma & Expresión
              </h1>
            </Link>
            <p className="text-foreground/60">Recuperar contraseña</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">📧</div>
              <p className="text-foreground/70">
                Si el email existe en nuestra base de datos, vas a recibir un
                enlace para restablecer tu contraseña.
              </p>
              <Button as={Link} href="/login" color="primary" variant="flat" radius="full">
                Volver al Login
              </Button>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="recovery-email"
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  Email
                </label>
                <input
                  id="recovery-email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 rounded-xl bg-default-100/50 border text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-primary ${formik.touched.email && formik.errors.email
                      ? 'border-danger'
                      : 'border-default-200'
                    }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-danger text-xs mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                color="primary"
                variant="flat"
                fullWidth
                radius="full"
                isLoading={formik.isSubmitting}
                className="font-semibold bg-gradient-to-r from-pink-500 to-pink-600 text-white"
              >
                Enviar enlace
              </Button>

              <p className="text-center text-sm text-foreground/60">
                <Link href="/login" className="text-primary">
                  Volver al Login
                </Link>
              </p>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
