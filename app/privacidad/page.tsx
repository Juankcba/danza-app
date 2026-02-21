import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidad',
};

export default function PrivacidadPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-8 gradient-text">
                Política de Privacidad
            </h1>
            <p className="text-foreground/60 text-sm mb-8">
                Última actualización: Febrero 2026
            </p>

            <div className="space-y-6 text-foreground/80 leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                        1. Información que recopilamos
                    </h2>
                    <p>
                        En <strong>Alma & Expresión</strong> recopilamos la siguiente
                        información cuando usás nuestra plataforma:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Nombre completo</li>
                        <li>Dirección de correo electrónico</li>
                        <li>Número de teléfono (opcional)</li>
                        <li>Información de pago procesada por MercadoPago</li>
                        <li>Datos proporcionados a través de Google OAuth (si elegís iniciar sesión con Google)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                        2. Cómo usamos tu información
                    </h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Gestionar tu cuenta y autenticación</li>
                        <li>Procesar inscripciones a cursos</li>
                        <li>Procesar pagos a través de MercadoPago</li>
                        <li>Enviar confirmaciones de inscripción y pagos por email</li>
                        <li>Enviar recordatorios de clase y pagos</li>
                        <li>Mejorar nuestros servicios</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                        3. Protección de datos
                    </h2>
                    <p>
                        Implementamos medidas de seguridad razonables para proteger tu
                        información personal. Las contraseñas se almacenan de forma
                        encriptada y los pagos son procesados de forma segura a través de
                        MercadoPago. No almacenamos datos de tarjetas de crédito.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                        4. Compartir información
                    </h2>
                    <p>
                        No vendemos ni compartimos tu información personal con terceros,
                        excepto con los proveedores necesarios para el funcionamiento del
                        servicio:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>MercadoPago (procesamiento de pagos)</li>
                        <li>Google (autenticación OAuth)</li>
                        <li>MongoDB Atlas (almacenamiento de datos)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                        5. Tus derechos
                    </h2>
                    <p>Tenés derecho a:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Acceder a tus datos personales</li>
                        <li>Solicitar la corrección de datos incorrectos</li>
                        <li>Solicitar la eliminación de tu cuenta y datos</li>
                        <li>Retirar tu consentimiento para el procesamiento de datos</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                        6. Contacto
                    </h2>
                    <p>
                        Para consultas sobre privacidad, escribinos a{' '}
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
