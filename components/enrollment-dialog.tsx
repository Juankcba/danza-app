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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="opaque"
      size="md"
      placement="center"
      classNames={{
        backdrop: 'bg-black/70 backdrop-blur-sm',
        base: 'border border-default-100 bg-content1 shadow-2xl',
        header: 'border-b border-default-100',
        footer: 'border-t border-default-100',
      }}
    >
      <ModalContent>
        {success ? (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <span className="text-2xl">✅</span>
              <span className="text-lg font-bold">¡Inscripción exitosa!</span>
            </ModalHeader>
            <ModalBody className="py-6">
              <p className="text-foreground/70">
                Te inscribiste en <strong>{course.name}</strong>. Revisá tu
                dashboard para más detalles.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                variant="shadow"
                className="font-semibold"
                onPress={() => router.push('/dashboard')}
              >
                Ir al Dashboard
              </Button>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalHeader className="flex flex-col gap-1 pb-4">
              <span className="text-lg font-bold">Inscribirme en {course.name}</span>
              <span className="text-sm text-foreground/50 font-normal">Revisá los datos antes de continuar</span>
            </ModalHeader>
            <ModalBody className="py-4">
              <div className="space-y-4">
                <div className="rounded-xl bg-default-100/50 border border-default-200 p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/50">Curso</span>
                    <span className="font-semibold">{course.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/50">Horario</span>
                    <span className="text-sm">{course.schedule}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/50">Profesora</span>
                    <span className="text-sm">{course.instructor.name}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-default-200 pt-3 mt-3">
                    <span className="text-foreground/70 font-semibold">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
                      ${course.price.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                {!session?.user && (
                  <div className="flex items-center gap-2 rounded-lg bg-warning-50/10 border border-warning/20 p-3">
                    <span className="text-warning text-lg">⚠️</span>
                    <p className="text-sm text-warning">
                      Necesitás iniciar sesión para inscribirte.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-danger-50/10 border border-danger/20 p-3">
                    <p className="text-sm text-danger">{error}</p>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="gap-2 pt-4">
              <Button variant="flat" onPress={onClose} className="font-medium">
                Cancelar
              </Button>
              <Button
                color="primary"
                variant="shadow"
                onPress={handleEnroll}
                isLoading={loading}
                className="font-semibold bg-gradient-to-r from-pink-500 to-pink-600"
              >
                {session?.user ? '💳 Pagar con MercadoPago' : '🔐 Iniciar Sesión'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
