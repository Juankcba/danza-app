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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
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
  payments: { amount: number; status: string }[];
}

interface Instructor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image?: string;
  _count: { courses: number };
  createdAt: string;
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

const tableClassNames = {
  wrapper: 'bg-transparent shadow-none p-0',
  th: 'bg-default-100/50 text-foreground/60 text-xs uppercase',
  td: 'py-3',
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [newInstructor, setNewInstructor] = useState({ name: '', specialty: '', bio: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user && (session.user as any).role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const fetchData = useCallback(async () => {
    try {
      const [coursesRes, enrollmentsRes, inquiriesRes, instructorsRes] = await Promise.all([
        fetch('/api/courses?all=true'),
        fetch('/api/enrollments'),
        fetch('/api/contact'),
        fetch('/api/instructors'),
      ]);
      const coursesData = await coursesRes.json();
      const enrollmentsData = await enrollmentsRes.json();
      const inquiriesData = await inquiriesRes.json();
      const instructorsData = await instructorsRes.json();
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
      setInquiries(Array.isArray(inquiriesData) ? inquiriesData : []);
      setInstructors(Array.isArray(instructorsData) ? instructorsData : []);
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

  const handleDeleteCourse = async (courseId: string) => {
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

  const handleTogglePublish = async (course: Course) => {
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !course.active }),
      });
      if (res.ok) {
        addToast({
          title: course.active ? 'Curso despublicado' : 'Curso publicado',
          color: 'success',
        });
        fetchData();
      }
    } catch {
      addToast({ title: 'Error al actualizar', color: 'danger' });
    }
  };

  const handleCloneCourse = async (course: Course) => {
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${course.name} (copia)`,
          description: course.description,
          level: course.level,
          duration: course.duration,
          schedule: course.schedule,
          price: course.price,
          capacity: course.capacity,
          instructorId: course.instructor.id,
          active: false,
        }),
      });
      if (res.ok) {
        addToast({ title: 'Curso clonado como borrador', color: 'success' });
        fetchData();
      }
    } catch {
      addToast({ title: 'Error al clonar', color: 'danger' });
    }
  };

  const handleCreateInstructor = async () => {
    if (!newInstructor.name || !newInstructor.specialty || !newInstructor.bio) {
      addToast({ title: 'Completá todos los campos', color: 'warning' });
      return;
    }
    try {
      const res = await fetch('/api/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInstructor),
      });
      if (res.ok) {
        addToast({ title: 'Instructor creado', color: 'success' });
        setNewInstructor({ name: '', specialty: '', bio: '' });
        fetchData();
      } else {
        const data = await res.json();
        addToast({ title: 'Error', description: data.error, color: 'danger' });
      }
    } catch {
      addToast({ title: 'Error de conexión', color: 'danger' });
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Cursos', value: courses.length, emoji: '📚' },
            { label: 'Instructores', value: instructors.length, emoji: '💃' },
            { label: 'Alumnos', value: totalStudents, emoji: '👥' },
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
            {/* ───── Courses Tab ───── */}
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
                    <Table aria-label="Cursos" isStriped classNames={tableClassNames}>
                      <TableHeader>
                        <TableColumn width="25%">NOMBRE</TableColumn>
                        <TableColumn width="12%" align="center">NIVEL</TableColumn>
                        <TableColumn width="22%">HORARIO</TableColumn>
                        <TableColumn width="10%" align="center">PRECIO</TableColumn>
                        <TableColumn width="10%" align="center">ALUMNOS</TableColumn>
                        <TableColumn width="10%" align="center">ESTADO</TableColumn>
                        <TableColumn width="11%" align="center">ACCIONES</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.name}</TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Chip size="sm" variant="flat" color={levelColor[course.level] || 'default'}>
                                  {levelLabel[course.level] || course.level}
                                </Chip>
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground/70 text-sm">{course.schedule}</TableCell>
                            <TableCell className="font-semibold text-center">
                              ${course.price.toLocaleString('es-AR')}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Chip size="sm" variant="flat">{course._count.enrollments}</Chip>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Chip
                                  size="sm"
                                  variant="dot"
                                  color={course.active ? 'success' : 'default'}
                                >
                                  {course.active ? 'Publicado' : 'Borrador'}
                                </Chip>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Dropdown>
                                  <DropdownTrigger>
                                    <Button size="sm" variant="flat" radius="full" isIconOnly>
                                      ⋯
                                    </Button>
                                  </DropdownTrigger>
                                  <DropdownMenu aria-label="Acciones del curso">
                                    <DropdownItem
                                      key="edit"
                                      onPress={() => router.push(`/admin/cursos/nuevo?edit=${course.id}`)}
                                    >
                                      ✏️ Editar
                                    </DropdownItem>
                                    <DropdownItem
                                      key="publish"
                                      onPress={() => handleTogglePublish(course)}
                                    >
                                      {course.active ? '📝 Despublicar' : '🚀 Publicar'}
                                    </DropdownItem>
                                    <DropdownItem
                                      key="clone"
                                      onPress={() => handleCloneCourse(course)}
                                    >
                                      📋 Clonar
                                    </DropdownItem>
                                    <DropdownItem
                                      key="delete"
                                      className="text-danger"
                                      color="danger"
                                      onPress={() => handleDeleteCourse(course.id)}
                                    >
                                      🗑️ Eliminar
                                    </DropdownItem>
                                  </DropdownMenu>
                                </Dropdown>
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

            {/* ───── Enrollments Tab ───── */}
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
                    <Table aria-label="Inscripciones" isStriped classNames={tableClassNames}>
                      <TableHeader>
                        <TableColumn width="18%">ALUMNO</TableColumn>
                        <TableColumn width="22%">EMAIL</TableColumn>
                        <TableColumn width="18%">CURSO</TableColumn>
                        <TableColumn width="12%" align="center">ESTADO</TableColumn>
                        <TableColumn width="15%" align="center">PAGO</TableColumn>
                        <TableColumn width="15%" align="center">FECHA</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {enrollments.map((enrollment) => (
                          <TableRow key={enrollment.id}>
                            <TableCell className="font-medium">{enrollment.user.name}</TableCell>
                            <TableCell className="text-foreground/70 text-sm">{enrollment.user.email}</TableCell>
                            <TableCell>{enrollment.course.name}</TableCell>
                            <TableCell>
                              <div className="flex justify-center">
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
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                {enrollment.payments?.length > 0 ? (
                                  <Chip
                                    size="sm"
                                    variant="flat"
                                    color={
                                      enrollment.payments.some(p => p.status === 'APPROVED')
                                        ? 'success'
                                        : enrollment.payments[0].status === 'REJECTED'
                                          ? 'danger'
                                          : 'warning'
                                    }
                                  >
                                    {enrollment.payments.some(p => p.status === 'APPROVED')
                                      ? `✅ $${enrollment.payments[0].amount.toLocaleString('es-AR')}`
                                      : enrollment.payments[0].status === 'REJECTED'
                                        ? '❌ Rechazado'
                                        : `⏳ $${enrollment.payments[0].amount.toLocaleString('es-AR')}`
                                    }
                                  </Chip>
                                ) : (
                                  <span className="text-foreground/40 text-sm">Sin pago</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground/70 text-center text-sm">
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

            {/* ───── Instructors Tab ───── */}
            <Tab
              key="instructors"
              title={
                <div className="flex items-center gap-2">
                  <span>💃</span>
                  <span>Instructores</span>
                  <Chip size="sm" variant="flat">{instructors.length}</Chip>
                </div>
              }
            >
              <Card className="glass border border-default-100 mt-6">
                <CardBody className="p-0">
                  <div className="px-6 py-4">
                    <h2 className="text-lg font-bold">Gestión de Instructores</h2>
                  </div>
                  <Divider />

                  {/* Inline create form */}
                  <div className="px-6 py-4 bg-default-50/50">
                    <p className="text-sm font-medium text-foreground/80 mb-3">Agregar instructor</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        placeholder="Nombre"
                        value={newInstructor.name}
                        onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                        className="px-4 py-2.5 rounded-xl bg-default-100/50 border border-default-200 text-foreground placeholder:text-foreground/40 outline-none focus:border-primary text-sm"
                      />
                      <input
                        placeholder="Especialidad (ej: Salsa, Bachata)"
                        value={newInstructor.specialty}
                        onChange={(e) => setNewInstructor({ ...newInstructor, specialty: e.target.value })}
                        className="px-4 py-2.5 rounded-xl bg-default-100/50 border border-default-200 text-foreground placeholder:text-foreground/40 outline-none focus:border-primary text-sm"
                      />
                      <input
                        placeholder="Biografía breve"
                        value={newInstructor.bio}
                        onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })}
                        className="px-4 py-2.5 rounded-xl bg-default-100/50 border border-default-200 text-foreground placeholder:text-foreground/40 outline-none focus:border-primary text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCreateInstructor}
                      className="mt-3 text-sm font-semibold px-6 py-2 rounded-full bg-linear-to-r from-pink-500 to-pink-600 text-white hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      + Agregar
                    </button>
                  </div>
                  <Divider />

                  {instructors.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-4xl mb-3">💃</p>
                      <p className="text-foreground/60">No hay instructores todavía</p>
                    </div>
                  ) : (
                    <Table aria-label="Instructores" isStriped classNames={tableClassNames}>
                      <TableHeader>
                        <TableColumn width="25%">NOMBRE</TableColumn>
                        <TableColumn width="20%" align="center">ESPECIALIDAD</TableColumn>
                        <TableColumn width="40%">BIOGRAFÍA</TableColumn>
                        <TableColumn width="15%" align="center">CURSOS</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {instructors.map((inst) => (
                          <TableRow key={inst.id}>
                            <TableCell className="font-medium">{inst.name}</TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Chip size="sm" variant="flat" color="secondary">
                                  {inst.specialty}
                                </Chip>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <p className="truncate text-foreground/80 text-sm">{inst.bio}</p>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Chip size="sm" variant="flat">{inst._count.courses}</Chip>
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

            {/* ───── Inquiries Tab ───── */}
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
                    <Table aria-label="Consultas" isStriped classNames={tableClassNames}>
                      <TableHeader>
                        <TableColumn width="15%">NOMBRE</TableColumn>
                        <TableColumn width="20%">EMAIL</TableColumn>
                        <TableColumn width="35%">MENSAJE</TableColumn>
                        <TableColumn width="15%" align="center">FECHA</TableColumn>
                        <TableColumn width="15%" align="center">ESTADO</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {inquiries.map((inquiry) => (
                          <TableRow key={inquiry.id}>
                            <TableCell className="font-medium">{inquiry.name}</TableCell>
                            <TableCell className="text-foreground/70 text-sm">{inquiry.email}</TableCell>
                            <TableCell className="max-w-xs">
                              <p className="truncate text-foreground/80 text-sm">{inquiry.message}</p>
                            </TableCell>
                            <TableCell className="text-foreground/70 text-center text-sm">
                              {new Date(inquiry.createdAt).toLocaleDateString('es-AR')}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Chip size="sm" variant="flat" color={inquiry.read ? 'default' : 'warning'}>
                                  {inquiry.read ? 'Leído' : 'Nuevo'}
                                </Chip>
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
          </Tabs>
        </div>
      </main>
    </div>
  );
}
