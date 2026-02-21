'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Progress,
} from '@heroui/react';
import { EnrollmentDialog } from './enrollment-dialog';

interface Course {
  id: string;
  name: string;
  description: string;
  level: string;
  duration: string;
  schedule: string;
  price: number;
  image?: string;
  capacity: number;
  instructor: { name: string };
  _count: { enrollments: number };
}

const levelColorMap: Record<string, 'success' | 'warning' | 'danger'> = {
  PRINCIPIANTE: 'success',
  INTERMEDIO: 'warning',
  AVANZADO: 'danger',
};

const levelLabelMap: Record<string, string> = {
  PRINCIPIANTE: 'Principiante',
  INTERMEDIO: 'Intermedio',
  AVANZADO: 'Avanzado',
};

export function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="cursos" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <Chip color="primary" variant="flat" className="mb-4">
            Nuestros Cursos
          </Chip>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Encontrá tu <span className="gradient-text">ritmo</span>
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
            Clases para todas las edades y niveles. Desde principiantes hasta
            avanzados.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Progress
              isIndeterminate
              color="primary"
              className="max-w-md"
              aria-label="Cargando cursos"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <Card
                key={course.id}
                className="glass border border-default-100 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardHeader className="flex-col items-start gap-2 pb-0">
                  <div className="flex justify-between w-full items-center">
                    <Chip
                      color={levelColorMap[course.level] || 'default'}
                      variant="flat"
                      size="sm"
                    >
                      {levelLabelMap[course.level] || course.level}
                    </Chip>
                    <span className="text-2xl font-bold text-primary">
                      ${course.price.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{course.name}</h3>
                </CardHeader>

                <CardBody className="gap-3">
                  <p className="text-sm text-foreground/60 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-foreground/70">
                      <span>📅 {course.schedule}</span>
                    </div>
                    <div className="flex justify-between text-foreground/70">
                      <span>⏱️ {course.duration}</span>
                    </div>
                    <div className="flex justify-between text-foreground/70">
                      <span>👩‍🏫 {course.instructor.name}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground/60">Cupos</span>
                      <span className="text-foreground/80">
                        {course._count.enrollments}/{course.capacity}
                      </span>
                    </div>
                    <Progress
                      value={(course._count.enrollments / course.capacity) * 100}
                      color={
                        course._count.enrollments >= course.capacity
                          ? 'danger'
                          : 'primary'
                      }
                      size="sm"
                      className="max-w-full"
                    />
                  </div>
                </CardBody>

                <CardFooter className="pt-0 pb-4 px-4">
                  <Button
                    fullWidth
                    isDisabled={course._count.enrollments >= course.capacity}
                    onPress={() => setSelectedCourse(course)}
                    className={`font-bold text-white text-base py-6 rounded-xl transition-all ${course._count.enrollments >= course.capacity
                        ? 'bg-default-300 text-default-500'
                        : 'bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                  >
                    {course._count.enrollments >= course.capacity
                      ? '🚫 Cupo Completo'
                      : '✨ Inscribirme'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {courses.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-foreground/50 text-lg">
              No hay cursos disponibles en este momento.
            </p>
          </div>
        )}
      </div>

      {selectedCourse && (
        <EnrollmentDialog
          course={selectedCourse}
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </section>
  );
}
