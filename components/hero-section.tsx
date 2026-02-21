'use client';

import { Button } from '@heroui/react';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/10" />

      {/* Animated circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Alma & Expresión"
            width={160}
            height={182}
            className="drop-shadow-2xl"
            priority
          />
        </div>

        <div className="inline-block mb-6">
          <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            ✨ 14 años enseñando ritmos caribeños
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span className="gradient-text">Alma &</span>
          <br />
          <span className="text-foreground">Expresión</span>
        </h1>

        <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Descubrí la pasión del baile con nuestras clases de{' '}
          <span className="text-primary font-semibold">salsa</span>,{' '}
          <span className="text-secondary font-semibold">bachata</span>,{' '}
          <span className="text-primary font-semibold">merengue</span> y más
          ritmos caribeños
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            radius="full"
            onPress={() => document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-bold text-base px-10 bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-shadow"
          >
            🔥 Ver Cursos
          </Button>
          <Button
            size="lg"
            radius="full"
            variant="bordered"
            onPress={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-semibold text-base px-10 border-pink-500/50 text-foreground hover:bg-pink-500/10 transition-colors"
          >
            Contactanos
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-16">
          {[
            { number: '500+', label: 'Alumnos' },
            { number: '14', label: 'Años' },
            { number: '9', label: 'Cursos' },
            { number: '100%', label: 'Pasión' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold gradient-text">{stat.number}</p>
              <p className="text-sm text-foreground/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
