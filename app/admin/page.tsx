'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardBody,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Tabs,
  Tab,
  Divider,
  addToast,
} from '@heroui/react';
import { Header } from '@/components/header';

interface Course {
  id: string;
  name: string;
  description: string;
  level: string;
  duration: string;
  schedule: string;
  price: number;
  capacity: number;
  active: boolean;
  instructor: { id: string; name: string };
  _count: { enrollments: number };
}

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Enrollment {
  id: string;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  course: { name: string };
  payment?: { amount: number; status: string };
}

const levelLabel: Record<string, string> = {
  PRINCIPIANTE: 'Principiante',
  INTERMEDIO: 'Intermedio',
  AVANZADO: 'Avanzado',
};

const levelColor: Record<string, 'success' | 'warning' | 'danger'> = {
  PRINCIPIANTE: 'success',
  INTERMEDIO: 'warning',
  AVANZADO: 'danger',
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user && (session.user as any).role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const fetchData = useCallback(async () => {
    try {
      const [coursesRes, enrollmentsRes, inquiriesRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/enrollments'),
        fetch('/api/contact'),
      ]);
      const coursesData = await coursesRes.json();
      const enrollmentsData = await enrollmentsRes.json();
      const inquiriesData = await inquiriesRes.json();
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
      setInquiries(Array.isArray(inquiriesData) ? inquiriesData : []);
    } catch {
      console.error('Error fetching admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user && (session.user as any).role === 'ADMIN') {
      fetchData();
    }
  }, [session, fetchData]);

  const handleDelete = async (courseId: string) => {
    if (!confirm('¿Estás seguro de que querés eliminar este curso?')) return;
    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
      if (res.ok) {
        addToast({ title: 'Curso eliminado', color: 'success' });
        fetchData();
      }
    } catch {
      addToast({ title: 'Error al eliminar', color: 'danger' });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  const totalStudents = enrollments.length;
  const activeStudents = enrollments.filter((e) => e.status === 'ACTIVE').length;
  const unreadInquiries = inquiries.filter((i) => !i.read).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Cursos', value: courses.length, emoji: '📚' },
            { label: 'Alumnos', value: totalStudents, emoji: '👥' },
            { label: 'Activos', value: activeStudents, emoji: '✅' },
            { label: 'Consultas', value: unreadInquiries, emoji: '✉️' },
          ].map((stat) => (
            <Card key={stat.label} className="glass border border-default-100">
              <CardBody className="flex flex-row items-center gap-3 py-4">
                <span className="text-2xl">{stat.emoji}</span>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-foreground/60 text-sm">{stat.label}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="w-full">
          <Tabs
            aria-label="Admin sections"
            variant="solid"
            radius="full"
            classNames={{
              cursor: 'bg-linear-to-r from-pink-500 to-pink-600',
              tabContent: 'group-data-[selected=true]:text-white',
            }}
          >
            {/* Courses Tab */}
            <Tab
              key="courses"
              title={
                <div className="flex items-center gap-2">
                  <span>📚</span>
                  <span>Cursos</span>
                  <Chip size="sm" variant="flat">{courses.length}</Chip>
                </div>
              }
            >
              <Card className="glass border border-default-100 mt-6">
                <CardBody className="p-0">
                  <div className="flex justify-between items-center px-6 py-4">
                    <h2 className="text-lg font-bold">Gestión de Cursos</h2>
                    <button
                      type="button"
                      onClick={() => router.push('/admin/cursos/nuevo')}
                      className="text-sm font-semibold px-6 py-2 rounded-full bg-linear-to-r from-pink-500 to-pink-600 text-white hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      + Nuevo Curso
                    </button>
                  </div>
                  <Divider />
                  {courses.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-4xl mb-3">📚</p>
                      <p className="text-foreground/60">No hay cursos creados todavía</p>
                      <button
                        type="button"
                        onClick={() => router.push('/admin/cursos/nuevo')}
                        className="mt-4 text-sm font-semibold px-6 py-2 rounded-full bg-linear-to-r from-pink-500 to-pink-600 text-white hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        Crear el primer curso
                      </button>
                    </div>
                  ) : (
                    <Table aria-label="Cursos" removeWrapper>
                      <TableHeader>
                        <TableColumn>NOMBRE</TableColumn>
                        <TableColumn>NIVEL</TableColumn>
                        <TableColumn>HORARIO</TableColumn>
                        <TableColumn>PRECIO</TableColumn>
                        <TableColumn>ALUMNOS</TableColumn>
                        <TableColumn>ACCIONES</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.name}</TableCell>
                            <TableCell>
                              <Chip size="sm" variant="flat" color={levelColor[course.level] || 'default'}>
                                {levelLabel[course.level] || course.level}
                              </Chip>
                            </TableCell>
                            <TableCell className="text-foreground/70">{course.schedule}</TableCell>
                            <TableCell className="font-semibold">
                              ${course.price.toLocaleString('es-AR')}
                            </TableCell>
                            <TableCell>
                              <Chip size="sm" variant="flat">
                                {course._count.enrollments}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="flat"
                                  radius="full"
                                  color="danger"
                                  onPress={() => handleDelete(course.id)}
                                >
                                  Eliminar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardBody>
              </Card>
            </Tab>

            {/* Enrollments Tab */}
            <Tab
              key="enrollments"
              title={
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span>Inscripciones</span>
                  <Chip size="sm" variant="flat">{enrollments.length}</Chip>
                </div>
              }
            >
              <Card className="glass border border-default-100 mt-6">
                <CardBody className="p-0">
                  <div className="px-6 py-4">
                    <h2 className="text-lg font-bold">Inscripciones</h2>
                  </div>
                  <Divider />
                  {enrollments.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-4xl mb-3">👥</p>
                      <p className="text-foreground/60">No hay inscripciones todavía</p>
                    </div>
                  ) : (
                    <Table aria-label="Inscripciones" removeWrapper>
                      <TableHeader>
                        <TableColumn>ALUMNO</TableColumn>
                        <TableColumn>EMAIL</TableColumn>
                        <TableColumn>CURSO</TableColumn>
                        <TableColumn>ESTADO</TableColumn>
                        <TableColumn>PAGO</TableColumn>
                        <TableColumn>FECHA</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {enrollments.map((enrollment) => (
                          <TableRow key={enrollment.id}>
                            <TableCell className="font-medium">{enrollment.user.name}</TableCell>
                            <TableCell className="text-foreground/70">{enrollment.user.email}</TableCell>
                            <TableCell>{enrollment.course.name}</TableCell>
                            <TableCell>
                              <Chip
                                size="sm"
                                variant="flat"
                                color={
                                  enrollment.status === 'ACTIVE'
                                    ? 'success'
                                    : enrollment.status === 'PENDING'
                                      ? 'warning'
                                      : 'default'
                                }
                              >
                                {enrollment.status === 'ACTIVE' ? 'Activa' : enrollment.status === 'PENDING' ? 'Pendiente' : enrollment.status}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              {enrollment.payment ? (
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  color={enrollment.payment.status === 'APPROVED' ? 'success' : 'warning'}
                                >
                                  ${enrollment.payment.amount.toLocaleString('es-AR')}
                                </Chip>
                              ) : (
                                <span className="text-foreground/40 text-sm">Sin pago</span>
                              )}
                            </TableCell>
                            <TableCell className="text-foreground/70">
                              {new Date(enrollment.createdAt).toLocaleDateString('es-AR')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardBody>
              </Card>
            </Tab>

            {/* Inquiries Tab */}
            <Tab
              key="inquiries"
              title={
                <div className="flex items-center gap-2">
                  <span>✉️</span>
                  <span>Consultas</span>
                  <Chip size="sm" variant="flat" color={unreadInquiries > 0 ? 'danger' : 'default'}>
                    {unreadInquiries > 0 ? unreadInquiries : inquiries.length}
                  </Chip>
                </div>
              }
            >
              <Card className="glass border border-default-100 mt-6">
                <CardBody className="p-0">
                  <div className="px-6 py-4">
                    <h2 className="text-lg font-bold">Consultas Recibidas</h2>
                  </div>
                  <Divider />
                  {inquiries.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-4xl mb-3">✉️</p>
                      <p className="text-foreground/60">No hay consultas todavía</p>
                    </div>
                  ) : (
                    <Table aria-label="Consultas" removeWrapper>
                      <TableHeader>
                        <TableColumn>NOMBRE</TableColumn>
                        <TableColumn>EMAIL</TableColumn>
                        <TableColumn>MENSAJE</TableColumn>
                        <TableColumn>FECHA</TableColumn>
                        <TableColumn>ESTADO</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {inquiries.map((inquiry) => (
                          <TableRow key={inquiry.id}>
                            <TableCell className="font-medium">{inquiry.name}</TableCell>
                            <TableCell className="text-foreground/70">{inquiry.email}</TableCell>
                            <TableCell className="max-w-xs">
                              <p className="truncate text-foreground/80">{inquiry.message}</p>
                            </TableCell>
                            <TableCell className="text-foreground/70">
                              {new Date(inquiry.createdAt).toLocaleDateString('es-AR')}
                            </TableCell>
                            <TableCell>
                              <Chip size="sm" variant="flat" color={inquiry.read ? 'default' : 'warning'}>
                                {inquiry.read ? 'Leído' : 'Nuevo'}
                              </Chip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
