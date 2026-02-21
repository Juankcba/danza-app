'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Course {
  id: string;
  name: string;
  price: number;
  schedule: string;
  instructor: { name: string };
}

interface EnrollmentDialogProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export function EnrollmentDialog({ course, isOpen, onClose }: EnrollmentDialogProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleEnroll = async () => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create enrollment
      const enrollRes = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (!enrollRes.ok) {
        const data = await enrollRes.json();
        setError(data.error || 'Error al inscribirse');
        setLoading(false);
        return;
      }

      const enrollment = await enrollRes.json();

      // Step 2: Create MercadoPago preference
      const payRes = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId: enrollment.id }),
      });

      if (payRes.ok) {
        const { initPoint } = await payRes.json();
        if (initPoint) {
          window.location.href = initPoint;
          return;
        }
      }

      // If no payment URL, show success without payment
      setSuccess(true);
    } catch {
      setError('Error de conexión. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="md">
      <ModalContent>
        {success ? (
          <>
            <ModalHeader className="flex flex-col gap-1">
              ✅ ¡Inscripción exitosa!
            </ModalHeader>
            <ModalBody>
              <p className="text-foreground/70">
                Te inscribiste en <strong>{course.name}</strong>. Revisá tu
                dashboard para más detalles.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => router.push('/dashboard')}
              >
                Ir al Dashboard
              </Button>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Inscribirme en {course.name}
            </ModalHeader>
            <ModalBody>
              <div className="space-y-3">
                <div className="glass rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Curso</span>
                    <span className="font-semibold">{course.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Horario</span>
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Profesora</span>
                    <span>{course.instructor.name}</span>
                  </div>
                  <div className="flex justify-between border-t border-default-100 pt-2 mt-2">
                    <span className="text-foreground/60 font-semibold">
                      Total
                    </span>
                    <span className="text-xl font-bold text-primary">
                      ${course.price.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                {!session?.user && (
                  <p className="text-sm text-warning">
                    ⚠️ Necesitás iniciar sesión para inscribirte.
                  </p>
                )}

                {error && (
                  <p className="text-sm text-danger">{error}</p>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                variant="shadow"
                onPress={handleEnroll}
                isLoading={loading}
                className="font-semibold"
              >
                {session?.user ? 'Pagar con MercadoPago' : 'Iniciar Sesión'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
