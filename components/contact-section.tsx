'use client';

import { Button, Chip, Link, addToast } from '@heroui/react';
import { useFormik } from 'formik';
import { contactSchema } from '@/lib/validations';

export function ContactSection() {
  const formik = useFormik({
    initialValues: { name: '', email: '', message: '' },
    validationSchema: contactSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
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
    },
  });

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
          <div className="space-y-6">
            <div className="glass rounded-xl p-6 border border-default-100">
              <h3 className="text-lg font-bold mb-3">📍 Ubicación</h3>
              <p className="text-foreground/70">
                Arguello, Argentina
              </p>
            </div>
            <div className="glass rounded-xl p-6 border border-default-100">
              <h3 className="text-lg font-bold mb-3">📱 Redes Sociales</h3>
              <div className="space-y-2">
                <Link
                  href="https://www.instagram.com/almaexpresion"
                  isExternal
                  className="text-foreground/70 hover:text-primary flex items-center gap-2"
                >
                  📸 @almaexpresion
                </Link>
                <p className="text-foreground/70">📘 Alma & Expresión</p>
              </div>
            </div>
            <div className="glass rounded-xl p-6 border border-default-100">
              <h3 className="text-lg font-bold mb-3">🕐 Horarios</h3>
              <p className="text-foreground/70">
                Lunes a Viernes: 17:00 - 22:00
              </p>
              <p className="text-foreground/70">Sábados: 10:00 - 14:00</p>
            </div>
          </div>

          {/* Contact form */}
          <div className="glass rounded-xl p-8 border border-default-100">
            <h3 className="text-lg font-bold mb-6">Escribinos ✉️</h3>
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* Name field */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  Nombre
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 rounded-xl bg-default-100/50 border text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-primary ${formik.touched.name && formik.errors.name
                    ? 'border-danger'
                    : 'border-default-200'
                    }`}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-danger text-xs mt-1">
                    {formik.errors.name}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  Email
                </label>
                <input
                  id="contact-email"
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

              {/* Message field */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  Mensaje
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Escribí tu consulta..."
                  rows={4}
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 rounded-xl bg-default-100/50 border text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-primary resize-none ${formik.touched.message && formik.errors.message
                    ? 'border-danger'
                    : 'border-default-200'
                    }`}
                />
                {formik.touched.message && formik.errors.message && (
                  <p className="text-danger text-xs mt-1">
                    {formik.errors.message}
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
                className="font-semibold bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-shadow"
              >
                Enviar Mensaje
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
