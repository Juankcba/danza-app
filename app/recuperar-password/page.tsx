'use client';

import { Card, CardBody, Button, Input, Link } from '@heroui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { recoverPasswordSchema } from '@/lib/validations';
import { useState } from 'react';

export default function RecuperarPasswordPage() {
  const [sent, setSent] = useState(false);

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
              <Button as={Link} href="/login" color="primary" variant="flat">
                Volver al Login
              </Button>
            </div>
          ) : (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={recoverPasswordSchema}
              onSubmit={async (_values, { setSubmitting }) => {
                // TODO: implement password reset API
                setTimeout(() => {
                  setSent(true);
                  setSubmitting(false);
                }, 1000);
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                  <div>
                    <Field
                      as={Input}
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="tu@email.com"
                      variant="bordered"
                      isInvalid={touched.email && !!errors.email}
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-danger text-xs mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    color="primary"
                    variant="shadow"
                    fullWidth
                    isLoading={isSubmitting}
                    className="font-semibold"
                  >
                    Enviar enlace
                  </Button>

                  <p className="text-center text-sm text-foreground/60">
                    <Link href="/login" className="text-primary">
                      Volver al Login
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
