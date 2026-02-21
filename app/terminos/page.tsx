import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Términos y Condiciones',
};

export default function TerminosPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-8 gradient-text">
                Términos y Condiciones
            </h1>
            <p className="text-foreground/60 text-sm mb-8">
                Última actualización: Febrero 2026
            </p>

            <div className="space-y-6 text-foreground/80 leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                        1. Aceptación de los términos
                    </h2>
                    <p>
                        Al crear una cuenta y utilizar la plataforma de{' '}
                        <strong>Alma & Expresión</strong>, aceptás los presentes términos y
                        condiciones. Si no estás de acuerdo, te pedimos que no utilices el
                        servicio.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                        2. Descripción del servicio
                    </h2>
                    <p>
                        Alma & Expresión es una escuela de danzas y ritmos caribeños ubicada
                        en San Miguel de Tucumán, Argentina. A través de esta plataforma
                        ofrecemos:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Inscripción online a cursos de baile</li>
                        <li>Procesamiento de pagos mediante MercadoPago</li>
                        <li>Gestión de inscripciones y seguimiento de clases</li>
                        <li>Comunicación por email sobre cursos y pagos</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                        3. Registro y cuenta
                    </h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>
                            Debés proporcionar información veraz al crear tu cuenta.
                        </li>
                        <li>
                            Sos responsable de mantener la seguridad de tus credenciales de
                            acceso.
                        </li>
                        <li>
                            Podés registrarte con email y contraseña o a través de Google
                            OAuth.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                        4. Pagos y reembolsos
                    </h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>
                            Los pagos se procesan de forma segura a través de MercadoPago.
                        </li>
                        <li>
                            Los precios de los cursos están expresados en pesos argentinos
                            (ARS).
                        </li>
                        <li>
                            Las solicitudes de reembolso se evaluarán caso por caso
                            contactando a{' '}
                            <a
                                href="mailto:almaexpresionacademia@gmail.com"
                                className="text-primary hover:underline"
                            >
                                almaexpresionacademia@gmail.com
                            </a>
                            .
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                        5. Cancelación
                    </h2>
                    <p>
                        Podés cancelar tu inscripción a un curso contactándonos por email.
                        Las cancelaciones están sujetas a la política de reembolso vigente.
                        Podés eliminar tu cuenta en cualquier momento.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                        6. Propiedad intelectual
                    </h2>
                    <p>
                        Todo el contenido de esta plataforma, incluyendo textos, imágenes,
                        logos y diseño, es propiedad de Alma & Expresión y está protegido por
                        las leyes de propiedad intelectual.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                        7. Contacto
                    </h2>
                    <p>
                        Para consultas sobre estos términos, escribinos a{' '}
                        <a
                            href="mailto:almaexpresionacademia@gmail.com"
                            className="text-primary hover:underline"
                        >
                            almaexpresionacademia@gmail.com
                        </a>
                    </p>
                </section>
            </div>
        </main>
    );
}
