'use client';

import { Card, CardBody, Avatar, Chip } from '@heroui/react';
import { useEffect, useState } from 'react';

interface Instructor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image?: string;
}

export function InstructorsSection() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    // For now, use static data. Can be replaced with API call later.
    setInstructors([
      {
        id: '1',
        name: 'Magui Arias',
        specialty: 'Ritmos Caribeños',
        bio: 'Fundadora y profesora de Alma & Expresión con 14 años de experiencia enseñando salsa, bachata, merengue y ritmos caribeños. Su pasión es compartir la alegría del baile con todos sus alumnos.',
        image: undefined,
      },
    ]);
  }, []);

  return (
    <section id="instructores" className="py-24 px-6 bg-default-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Chip color="secondary" variant="flat" className="mb-4">
            Equipo
          </Chip>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nuestros <span className="gradient-text">Instructores</span>
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
            Profesionales apasionados con años de experiencia en ritmos
            caribeños.
          </p>
        </div>

        <div className="flex justify-center">
          {instructors.map((instructor) => (
            <Card
              key={instructor.id}
              className="glass border border-default-100 max-w-lg w-full hover:border-secondary/30 transition-all duration-300"
            >
              <CardBody className="flex flex-col items-center text-center gap-4 p-8">
                <Avatar
                  name={instructor.name}
                  src={instructor.image}
                  className="w-28 h-28 text-large"
                  isBordered
                  color="secondary"
                />
                <div>
                  <h3 className="text-2xl font-bold">{instructor.name}</h3>
                  <Chip color="primary" variant="flat" size="sm" className="mt-2">
                    {instructor.specialty}
                  </Chip>
                </div>
                <p className="text-foreground/60 leading-relaxed">
                  {instructor.bio}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
