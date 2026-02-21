'use client';

import { Button, Input, Textarea, Chip, addToast } from '@heroui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { contactSchema } from '@/lib/validations';

export function ContactSection() {
  return (
    <section id="contacto" className="py-24 px-6 bg-default-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Chip color="secondary" variant="flat" className="mb-4">
            Contacto
          </Chip>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            ¿Tenés <span className="gradient-text">preguntas</span>?
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
            Envianos un mensaje y te respondemos a la brevedad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="space-y-8">
            <div className="glass rounded-xl p-6 border border-default-100">
              <h3 className="text-lg font-bold mb-4">📍 Ubicación</h3>
              <p className="text-foreground/70">
                San Miguel de Tucumán, Argentina
              </p>
            </div>
            <div className="glass rounded-xl p-6 border border-default-100">
              <h3 className="text-lg font-bold mb-4">📱 Redes Sociales</h3>
              <div className="space-y-2">
                <p className="text-foreground/70">
                  Instagram: @almayexpresion
                </p>
                <p className="text-foreground/70">Facebook: Alma & Expresión</p>
              </div>
            </div>
            <div className="glass rounded-xl p-6 border border-default-100">
              <h3 className="text-lg font-bold mb-4">🕐 Horarios</h3>
              <p className="text-foreground/70">
                Lunes a Viernes: 17:00 - 22:00
              </p>
              <p className="text-foreground/70">Sábados: 10:00 - 14:00</p>
            </div>
          </div>

          {/* Contact form with Formik + Yup */}
          <div className="glass rounded-xl p-8 border border-default-100">
            <Formik
              initialValues={{ name: '', email: '', message: '' }}
              validationSchema={contactSchema}
              onSubmit={async (values, { resetForm, setSubmitting }) => {
                try {
                  // For now, just log. Can add email API later.
                  console.log('Contact form:', values);
                  addToast({
                    title: '¡Mensaje enviado!',
                    description: 'Nos pondremos en contacto pronto.',
                    color: 'success',
                  });
                  resetForm();
                } catch {
                  addToast({
                    title: 'Error',
                    description: 'No se pudo enviar el mensaje.',
                    color: 'danger',
                  });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-5">
                  <div>
                    <Field
                      as={Input}
                      name="name"
                      label="Nombre"
                      placeholder="Tu nombre"
                      variant="bordered"
                      isInvalid={touched.name && !!errors.name}
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-danger text-xs mt-1"
                    />
                  </div>

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

                  <div>
                    <Field
                      as={Textarea}
                      name="message"
                      label="Mensaje"
                      placeholder="Escribí tu consulta..."
                      variant="bordered"
                      minRows={4}
                      isInvalid={touched.message && !!errors.message}
                    />
                    <ErrorMessage
                      name="message"
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
                    Enviar Mensaje
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
}
