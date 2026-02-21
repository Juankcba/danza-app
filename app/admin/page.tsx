'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Textarea,
  Tabs,
  Tab,
  addToast,
} from '@heroui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { courseSchema } from '@/lib/validations';
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

interface Enrollment {
  id: string;
  status: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  course: { name: string; price: number };
  payment?: { status: string; amount: number };
}

const levelOptions = [
  { key: 'PRINCIPIANTE', label: 'Principiante' },
  { key: 'INTERMEDIO', label: 'Intermedio' },
  { key: 'AVANZADO', label: 'Avanzado' },
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user && (session.user as any).role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const fetchData = useCallback(async () => {
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/enrollments'),
      ]);
      const coursesData = await coursesRes.json();
      const enrollmentsData = await enrollmentsRes.json();
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!session?.user || (session.user as any).role !== 'ADMIN') return null;

  const totalRevenue = enrollments
    .filter((e) => e.payment?.status === 'APPROVED')
    .reduce((sum, e) => sum + (e.payment?.amount || 0), 0);

  const openCreateModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      addToast({ title: 'Curso eliminado', color: 'success' });
      fetchData();
    } catch {
      addToast({ title: 'Error al eliminar', color: 'danger' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                Panel de <span className="gradient-text">Administración</span>
              </h1>
              <p className="text-foreground/60 mt-1">
                Gestioná cursos, inscripciones y pagos.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="glass border border-default-100">
              <CardBody className="text-center p-6">
                <p className="text-3xl font-bold text-primary">
                  {courses.length}
                </p>
                <p className="text-foreground/60 text-sm">Cursos</p>
              </CardBody>
            </Card>
            <Card className="glass border border-default-100">
              <CardBody className="text-center p-6">
                <p className="text-3xl font-bold text-secondary">
                  {enrollments.length}
                </p>
                <p className="text-foreground/60 text-sm">Inscripciones</p>
              </CardBody>
            </Card>
            <Card className="glass border border-default-100">
              <CardBody className="text-center p-6">
                <p className="text-3xl font-bold text-success">
                  {enrollments.filter((e) => e.status === 'ACTIVE').length}
                </p>
                <p className="text-foreground/60 text-sm">Activas</p>
              </CardBody>
            </Card>
            <Card className="glass border border-default-100">
              <CardBody className="text-center p-6">
                <p className="text-3xl font-bold gradient-text">
                  ${totalRevenue.toLocaleString('es-AR')}
                </p>
                <p className="text-foreground/60 text-sm">Ingresos</p>
              </CardBody>
            </Card>
          </div>

          <Tabs
            aria-label="Admin Tabs"
            color="primary"
            variant="underlined"
            classNames={{
              tabList: 'gap-6',
            }}
          >
            {/* Courses Tab */}
            <Tab key="courses" title="Cursos">
              <Card className="glass border border-default-100 mt-4">
                <CardHeader className="flex justify-between items-center px-6 pt-6">
                  <h2 className="text-xl font-bold">Cursos</h2>
                  <Button
                    color="primary"
                    variant="shadow"
                    size="sm"
                    onPress={openCreateModal}
                  >
                    + Nuevo Curso
                  </Button>
                </CardHeader>
                <CardBody>
                  <Table aria-label="Cursos" removeWrapper>
                    <TableHeader>
                      <TableColumn>NOMBRE</TableColumn>
                      <TableColumn>NIVEL</TableColumn>
                      <TableColumn>HORARIO</TableColumn>
                      <TableColumn>PRECIO</TableColumn>
                      <TableColumn>CUPOS</TableColumn>
                      <TableColumn>ACCIONES</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">
                            {course.name}
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="sm"
                              variant="flat"
                              color={
                                course.level === 'PRINCIPIANTE'
                                  ? 'success'
                                  : course.level === 'INTERMEDIO'
                                    ? 'warning'
                                    : 'danger'
                              }
                            >
                              {course.level}
                            </Chip>
                          </TableCell>
                          <TableCell className="text-foreground/70">
                            {course.schedule}
                          </TableCell>
                          <TableCell>
                            ${course.price.toLocaleString('es-AR')}
                          </TableCell>
                          <TableCell>
                            {course._count.enrollments}/{course.capacity}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                onPress={() => openEditModal(course)}
                              >
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="flat"
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
                </CardBody>
              </Card>
            </Tab>

            {/* Enrollments Tab */}
            <Tab key="enrollments" title="Inscripciones">
              <Card className="glass border border-default-100 mt-4">
                <CardHeader className="px-6 pt-6">
                  <h2 className="text-xl font-bold">Inscripciones</h2>
                </CardHeader>
                <CardBody>
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
                          <TableCell className="font-medium">
                            {enrollment.user.name}
                          </TableCell>
                          <TableCell className="text-foreground/70">
                            {enrollment.user.email}
                          </TableCell>
                          <TableCell>
                            {enrollment.course.name}
                          </TableCell>
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
                              {enrollment.status}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            {enrollment.payment ? (
                              <Chip
                                size="sm"
                                variant="flat"
                                color={
                                  enrollment.payment.status === 'APPROVED'
                                    ? 'success'
                                    : 'warning'
                                }
                              >
                                ${enrollment.payment.amount.toLocaleString(
                                  'es-AR'
                                )}
                              </Chip>
                            ) : (
                              <span className="text-foreground/40 text-sm">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-foreground/70">
                            {new Date(enrollment.createdAt).toLocaleDateString(
                              'es-AR'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </main>

      {/* Course Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        backdrop="blur"
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>
            {editingCourse ? 'Editar Curso' : 'Nuevo Curso'}
          </ModalHeader>
          <Formik
            initialValues={{
              name: editingCourse?.name || '',
              description: editingCourse?.description || '',
              level: editingCourse?.level || 'PRINCIPIANTE',
              duration: editingCourse?.duration || '',
              schedule: editingCourse?.schedule || '',
              price: editingCourse?.price || 0,
              capacity: editingCourse?.capacity || 15,
              instructorId: editingCourse?.instructor?.id || '',
            }}
            validationSchema={courseSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const url = editingCourse
                  ? `/api/courses/${editingCourse.id}`
                  : '/api/courses';
                const method = editingCourse ? 'PUT' : 'POST';

                const res = await fetch(url, {
                  method,
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...values,
                    price: Number(values.price),
                    capacity: Number(values.capacity),
                  }),
                });

                if (res.ok) {
                  addToast({
                    title: editingCourse
                      ? 'Curso actualizado'
                      : 'Curso creado',
                    color: 'success',
                  });
                  setIsModalOpen(false);
                  fetchData();
                } else {
                  const data = await res.json();
                  addToast({
                    title: 'Error',
                    description: data.error,
                    color: 'danger',
                  });
                }
              } catch {
                addToast({ title: 'Error de conexión', color: 'danger' });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, errors, touched, setFieldValue, values }) => (
              <Form>
                <ModalBody className="space-y-4">
                  <div>
                    <Field
                      as={Input}
                      name="name"
                      label="Nombre del curso"
                      variant="bordered"
                      isInvalid={touched.name && !!errors.name}
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-danger text-xs mt-1"
                    />
                  </div>

                  <div>
                    <Field
                      as={Textarea}
                      name="description"
                      label="Descripción"
                      variant="bordered"
                      minRows={3}
                      isInvalid={touched.description && !!errors.description}
                    />
                    <ErrorMessage
                      name="description"
                      component="p"
                      className="text-danger text-xs mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Select
                        label="Nivel"
                        variant="bordered"
                        selectedKeys={[values.level]}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0];
                          if (selected) setFieldValue('level', selected);
                        }}
                        isInvalid={touched.level && !!errors.level}
                      >
                        {levelOptions.map((opt) => (
                          <SelectItem key={opt.key}>{opt.label}</SelectItem>
                        ))}
                      </Select>
                      <ErrorMessage
                        name="level"
                        component="p"
                        className="text-danger text-xs mt-1"
                      />
                    </div>

                    <div>
                      <Field
                        as={Input}
                        name="duration"
                        label="Duración"
                        placeholder="ej: 3 meses"
                        variant="bordered"
                        isInvalid={touched.duration && !!errors.duration}
                      />
                      <ErrorMessage
                        name="duration"
                        component="p"
                        className="text-danger text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Field
                      as={Input}
                      name="schedule"
                      label="Horario"
                      placeholder="ej: Lunes y Miércoles 18:00 - 19:30"
                      variant="bordered"
                      isInvalid={touched.schedule && !!errors.schedule}
                    />
                    <ErrorMessage
                      name="schedule"
                      component="p"
                      className="text-danger text-xs mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Field
                        as={Input}
                        name="price"
                        type="number"
                        label="Precio (ARS)"
                        variant="bordered"
                        isInvalid={touched.price && !!errors.price}
                      />
                      <ErrorMessage
                        name="price"
                        component="p"
                        className="text-danger text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Field
                        as={Input}
                        name="capacity"
                        type="number"
                        label="Capacidad"
                        variant="bordered"
                        isInvalid={touched.capacity && !!errors.capacity}
                      />
                      <ErrorMessage
                        name="capacity"
                        component="p"
                        className="text-danger text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Field
                      as={Input}
                      name="instructorId"
                      label="ID Instructor"
                      placeholder="ID del instructor en la base de datos"
                      variant="bordered"
                      isInvalid={touched.instructorId && !!errors.instructorId}
                    />
                    <ErrorMessage
                      name="instructorId"
                      component="p"
                      className="text-danger text-xs mt-1"
                    />
                  </div>
                </ModalBody>

                <ModalFooter>
                  <Button
                    variant="light"
                    onPress={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    variant="shadow"
                    isLoading={isSubmitting}
                  >
                    {editingCourse ? 'Guardar Cambios' : 'Crear Curso'}
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </div>
  );
}
