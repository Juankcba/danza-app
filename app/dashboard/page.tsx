'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  addToast,
} from '@heroui/react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface Payment {
  status: string;
  amount: number;
  createdAt: string;
}

interface Enrollment {
  id: string;
  status: string;
  createdAt: string;
  course: {
    name: string;
    schedule: string;
    price: number;
    instructor: { name: string };
  };
  payments: Payment[];
}

const statusColors: Record<string, 'warning' | 'success' | 'danger' | 'default'> = {
  PENDING: 'warning',
  ACTIVE: 'success',
  COMPLETED: 'default',
  CANCELLED: 'danger',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  ACTIVE: 'Activa',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      addToast({
        title: '¡Pago exitoso!',
        description: 'Tu inscripción ha sido confirmada.',
        color: 'success',
      });
    } else if (payment === 'failure') {
      addToast({
        title: 'Pago fallido',
        description: 'Hubo un problema con el pago. Intentá de nuevo.',
        color: 'danger',
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/enrollments')
        .then((res) => res.json())
        .then((data) => {
          setEnrollments(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!session?.user) return null;

  const activeCount = enrollments.filter((e) => e.status === 'ACTIVE').length;
  const pendingCount = enrollments.filter((e) => e.status === 'PENDING').length;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold">
              Hola,{' '}
              <span className="gradient-text">{session.user.name}</span> 👋
            </h1>
            <p className="text-foreground/60 mt-2">
              Acá podés ver tus inscripciones y gestionar tus pagos.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="glass border border-default-100">
              <CardBody className="text-center p-6">
                <p className="text-3xl font-bold text-primary">
                  {enrollments.length}
                </p>
                <p className="text-foreground/60 text-sm">Inscripciones</p>
              </CardBody>
            </Card>
            <Card className="glass border border-default-100">
              <CardBody className="text-center p-6">
                <p className="text-3xl font-bold text-success">
                  {activeCount}
                </p>
                <p className="text-foreground/60 text-sm">Activas</p>
              </CardBody>
            </Card>
            <Card className="glass border border-default-100">
              <CardBody className="text-center p-6">
                <p className="text-3xl font-bold text-warning">
                  {pendingCount}
                </p>
                <p className="text-foreground/60 text-sm">Pendientes</p>
              </CardBody>
            </Card>
          </div>

          {/* Enrollment CTA Banner */}
          {activeCount === 0 && (
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 p-8 text-center">
              <div className="absolute inset-0 bg-linear-to-r from-pink-500/5 to-purple-500/5 animate-pulse" />
              <div className="relative z-10">
                <p className="text-4xl mb-3">💃</p>
                <h3 className="text-2xl font-bold mb-2">
                  ¡Empezá a <span className="gradient-text">bailar</span> hoy!
                </h3>
                <p className="text-foreground/60 mb-6 max-w-md mx-auto">
                  Explorá nuestros cursos de salsa, bachata y más. Encontrá el ritmo que te mueva.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/#cursos')}
                  className="text-base font-bold px-10 py-3.5 rounded-full bg-linear-to-r from-pink-500 to-pink-600 text-white hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-pink-500/25 cursor-pointer"
                >
                  🎶 Inscribirme a un curso
                </button>
              </div>
            </div>
          )}

          {/* Enrollments table */}
          <Card className="glass border border-default-100">
            <CardHeader className="flex justify-between items-center px-6 pt-6">
              <h2 className="text-xl font-bold">Mis Inscripciones</h2>
              <button
                type="button"
                onClick={() => router.push('/#cursos')}
                className="text-sm font-semibold px-5 py-2 rounded-full bg-linear-to-r from-pink-500 to-pink-600 text-white hover:opacity-90 transition-opacity cursor-pointer"
              >
                Ver Cursos
              </button>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Spinner color="primary" />
                </div>
              ) : enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-foreground/50 text-lg mb-4">
                    No tenés inscripciones todavía
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push('/#cursos')}
                    className="text-sm font-semibold px-8 py-2.5 rounded-full bg-linear-to-r from-pink-500 to-pink-600 text-white hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Explorar Cursos
                  </button>
                </div>
              ) : (
                <Table
                  aria-label="Mis inscripciones"
                  removeWrapper
                  isStriped
                  classNames={{
                    th: 'bg-default-100/50 text-foreground/60 text-xs uppercase tracking-wider py-3',
                    td: 'py-4',
                    tr: 'hover:bg-default-100/30 transition-colors',
                  }}
                >
                  <TableHeader>
                    <TableColumn>CURSO</TableColumn>
                    <TableColumn>HORARIO</TableColumn>
                    <TableColumn>PROFESORA</TableColumn>
                    <TableColumn align="center">ESTADO</TableColumn>
                    <TableColumn align="center">PAGO</TableColumn>
                    <TableColumn align="center">ACCIONES</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold">{enrollment.course.name}</span>
                            <span className="text-xs text-foreground/40">
                              ${enrollment.course.price.toLocaleString('es-AR')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-foreground/70">
                            📅 {enrollment.course.schedule}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-foreground/70">
                            👩‍🏫 {enrollment.course.instructor.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={statusColors[enrollment.status] || 'default'}
                            variant="flat"
                            size="sm"
                            className="font-medium"
                          >
                            {statusLabels[enrollment.status] || enrollment.status}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const latestPayment = enrollment.payments?.[0];
                            const hasApproved = enrollment.payments?.some(p => p.status === 'APPROVED');
                            if (hasApproved) {
                              const approved = enrollment.payments.find(p => p.status === 'APPROVED')!;
                              return (
                                <Chip color="success" variant="flat" size="sm" className="font-medium">
                                  ✅ ${approved.amount.toLocaleString('es-AR')}
                                </Chip>
                              );
                            } else if (latestPayment) {
                              return (
                                <Chip color="warning" variant="flat" size="sm" className="font-medium">
                                  ⏳ Pendiente
                                </Chip>
                              );
                            } else {
                              return (
                                <Chip color="default" variant="flat" size="sm">
                                  Sin pago
                                </Chip>
                              );
                            }
                          })()}
                        </TableCell>
                        <TableCell>
                          {enrollment.status === 'PENDING' && !enrollment.payments?.some(p => p.status === 'APPROVED') && (
                            <Button
                              size="sm"
                              radius="full"
                              className="font-semibold text-white bg-gradient-to-r from-pink-500 to-pink-600 shadow-md shadow-pink-500/20 hover:shadow-pink-500/40 transition-all"
                              onPress={async () => {
                                try {
                                  const res = await fetch(
                                    '/api/payments/create-preference',
                                    {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({
                                        enrollmentId: enrollment.id,
                                      }),
                                    }
                                  );
                                  if (res.ok) {
                                    const { initPoint } = await res.json();
                                    if (initPoint) window.location.href = initPoint;
                                  } else {
                                    addToast({
                                      title: 'Error al crear pago',
                                      description: 'Intentá de nuevo más tarde.',
                                      color: 'danger',
                                    });
                                  }
                                } catch {
                                  addToast({
                                    title: 'Error de conexión',
                                    color: 'danger',
                                  });
                                }
                              }}
                            >
                              💳 Pagar
                            </Button>
                          )}
                          {enrollment.status === 'ACTIVE' && (
                            <Chip color="success" variant="flat" size="sm" className="font-medium">
                              ✓ Inscripto
                            </Chip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Delete account */}
        <div className="mt-12 pt-8 border-t border-default-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-danger">Eliminar cuenta</h3>
              <p className="text-xs text-foreground/50 mt-1">
                Se eliminarán todos tus datos, inscripciones y pagos de forma permanente.
              </p>
            </div>
            <Button
              color="danger"
              variant="flat"
              size="sm"
              radius="full"
              onPress={async () => {
                const confirmed = window.confirm(
                  '¿Estás seguro/a? Esta acción no se puede deshacer. Se eliminarán todos tus datos.'
                );
                if (!confirmed) return;
                try {
                  const res = await fetch('/api/account', { method: 'DELETE' });
                  if (res.ok) {
                    addToast({
                      title: 'Cuenta eliminada',
                      description: 'Tu cuenta fue eliminada exitosamente.',
                      color: 'success',
                    });
                    const { signOut } = await import('next-auth/react');
                    signOut({ callbackUrl: '/' });
                  } else {
                    addToast({
                      title: 'Error',
                      description: 'No se pudo eliminar la cuenta.',
                      color: 'danger',
                    });
                  }
                } catch {
                  addToast({
                    title: 'Error',
                    description: 'Error al conectar con el servidor.',
                    color: 'danger',
                  });
                }
              }}
            >
              Eliminar mi cuenta
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
