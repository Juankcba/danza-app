'use client';

import { Card, CardBody, Chip } from '@heroui/react';

export function AboutSection() {
  return (
    <section id="nosotros" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Chip color="primary" variant="flat" className="mb-4">
            Nosotros
          </Chip>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Sobre <span className="gradient-text">Alma & Expresión</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <p className="text-lg text-foreground/70 leading-relaxed">
              Somos una escuela de danzas y ritmos caribeños fundada por{' '}
              <strong className="text-primary">Magui Arias</strong> hace 14
              años. Nuestra misión es transmitir la alegría y la pasión del
              baile a todas las personas, sin importar su edad o nivel.
            </p>
            <p className="text-lg text-foreground/70 leading-relaxed">
              En Alma & Expresión creemos que el baile es una forma de
              expresión única que conecta cuerpo, mente y alma. Cada clase es
              una oportunidad para descubrirte y disfrutar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '💃', title: 'Salsa', desc: 'Cubana y en línea' },
              { icon: '🎵', title: 'Bachata', desc: 'Sensual y tradicional' },
              { icon: '🥁', title: 'Merengue', desc: 'Ritmo y energía' },
              { icon: '🌟', title: 'Estilo', desc: 'Femenino y urbano' },
            ].map((item) => (
              <Card
                key={item.title}
                className="glass border border-default-100 hover:border-primary/30 transition-all"
              >
                <CardBody className="text-center p-6">
                  <span className="text-3xl mb-2 block">{item.icon}</span>
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <p className="text-sm text-foreground/60">{item.desc}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
