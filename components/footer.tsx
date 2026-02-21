'use client';

import { Link, Divider } from '@heroui/react';

export function Footer() {
  return (
    <footer className="bg-default-50/80 border-t border-default-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">
              Alma & Expresión
            </h3>
            <p className="text-foreground/60 text-sm leading-relaxed">
              Escuela de ritmos caribeños con 14 años de experiencia. Salsa,
              bachata, merengue y más.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <div className="flex flex-col gap-2">
              <Link href="#cursos" className="text-foreground/60 text-sm hover:text-primary">
                Cursos
              </Link>
              <Link href="#instructores" className="text-foreground/60 text-sm hover:text-primary">
                Instructores
              </Link>
              <Link href="#nosotros" className="text-foreground/60 text-sm hover:text-primary">
                Nosotros
              </Link>
              <Link href="#contacto" className="text-foreground/60 text-sm hover:text-primary">
                Contacto
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Redes</h4>
            <div className="flex flex-col gap-2">
              <Link
                href="https://www.instagram.com/almaexpresion"
                isExternal
                className="text-foreground/60 text-sm hover:text-primary"
              >
                Instagram
              </Link>
              <Link
                href="https://facebook.com/almayexpresion"
                isExternal
                className="text-foreground/60 text-sm hover:text-primary"
              >
                Facebook
              </Link>
            </div>
          </div>
        </div>

        <Divider className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-foreground/40 text-sm">
            © {new Date().getFullYear()} Alma & Expresión. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/privacidad" className="text-foreground/40 text-xs hover:text-primary">
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="text-foreground/40 text-xs hover:text-primary">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
