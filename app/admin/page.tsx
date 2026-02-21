'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
  Divider,
  addToast,
} from '@heroui/react';
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

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 rounded-xl bg-default-100/50 border text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-primary ${hasError ? 'border-danger' : 'border-default-200'
  }`;

const selectClass =
  'w-full px-4 py-3 rounded-xl bg-default-100/50 border border-default-200 text-foreground outline-none transition-colors focus:border-primary appearance-none cursor-pointer';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editingCourse?.name || '',
      description: editingCourse?.description || '',
      level: editingCourse?.level || 'PRINCIPIANTE',
      duration: editingCourse?.duration || '',
      schedule: editingCourse?.schedule || '',
      price: editingCourse?.price || 0,
      capacity: editingCourse?.capacity || 15,
      instructorId: editingCourse?.instructor?.id || '',
    },
    validationSchema: courseSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
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
            title: editingCourse ? 'Curso actualizado' : 'Curso creado',
            color: 'success',
          });
          setIsDrawerOpen(false);
          setEditingCourse(null);
          resetForm();
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
    },
  });

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

  const openCreate = () => {
    setEditingCourse(null);
    formik.resetForm();
    setIsDrawerOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este curso?')) return;
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
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">
              Panel de <span className="gradient-text">Administración</span>
            </h1>
            <p className="text-foreground/60 mt-1">
              Gestioná cursos, inscripciones y pagos.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Cursos', value: courses.length, color: 'text-pink-500' },
              { label: 'Inscripciones', value: enrollments.length, color: 'text-secondary' },
              { label: 'Activas', value: enrollments.filter((e) => e.status === 'ACTIVE').length, color: 'text-success' },
              { label: 'Ingresos', value: `$${totalRevenue.toLocaleString('es-AR')}`, color: 'text-warning' },
            ].map((stat) => (
              <Card key={stat.label} className="glass border border-default-100">
                <CardBody className="text-center py-6">
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-foreground/60 text-sm mt-1">{stat.label}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs
            aria-label="Admin Tabs"
            color="primary"
            variant="solid"
            radius="full"
            size="lg"
            classNames={{
              tabList: 'bg-default-100/50 p-1',
              tab: 'px-6 py-2',
              cursor: 'bg-gradient-to-r from-pink-500 to-pink-600',
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
                    <Button
                      color="primary"
                      variant="flat"
                      size="sm"
                      radius="full"
                      className="font-semibold bg-gradient-to-r from-pink-500 to-pink-600 text-white"
                      onPress={openCreate}
                    >
                      + Nuevo Curso
                    </Button>
                  </div>
                  <Divider />
                  {courses.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-4xl mb-3">📚</p>
                      <p className="text-foreground/60">No hay cursos creados todavía</p>
                      <Button
                        color="primary"
                        variant="flat"
                        size="sm"
                        radius="full"
                        className="mt-4 font-semibold bg-gradient-to-r from-pink-500 to-pink-600 text-white"
                        onPress={openCreate}
                      >
                        Crear el primer curso
                      </Button>
                    </div>
                  ) : (
                    <Table aria-label="Cursos" removeWrapper>
                      <TableHeader>
                        <TableColumn>NOMBRE</TableColumn>
                        <TableColumn>NIVEL</TableColumn>
                        <TableColumn>HORARIO</TableColumn>
                        <TableColumn>PRECIO</TableColumn>
                        <TableColumn>CUPOS</TableColumn>
                        <TableColumn align="center">ACCIONES</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => (
                          <TableRow key={course.id} className="cursor-pointer hover:bg-default-100/50">
                            <TableCell className="font-medium">{course.name}</TableCell>
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
                            <TableCell className="text-foreground/70">{course.schedule}</TableCell>
                            <TableCell className="font-medium">${course.price.toLocaleString('es-AR')}</TableCell>
                            <TableCell>
                              <Chip size="sm" variant="flat" color={course._count.enrollments >= course.capacity ? 'danger' : 'default'}>
                                {course._count.enrollments}/{course.capacity}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2 justify-center">
                                <Button size="sm" variant="flat" color="primary" radius="full" onPress={() => openEdit(course)}>
                                  Editar
                                </Button>
                                <Button size="sm" variant="flat" color="danger" radius="full" onPress={() => handleDelete(course.id)}>
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
                    <h2 className="text-lg font-bold">Inscripciones de Alumnos</h2>
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
          </Tabs>
        </div>
      </main>

      {/* Course Drawer (side modal) */}
      <Modal
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingCourse(null);
          formik.resetForm();
        }}
        backdrop="blur"
        size="lg"
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">
              {editingCourse ? 'Editar Curso' : 'Nuevo Curso'}
            </h2>
            <p className="text-sm text-foreground/60 font-normal">
              {editingCourse
                ? 'Modificá los datos del curso'
                : 'Completá los datos para crear un nuevo curso'}
            </p>
          </ModalHeader>

          <form onSubmit={formik.handleSubmit}>
            <ModalBody className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="course-name" className="block text-sm font-medium text-foreground/80 mb-2">
                  Nombre del curso
                </label>
                <input
                  id="course-name"
                  name="name"
                  placeholder="ej: Salsa Nivel 1"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputClass(!!formik.touched.name && !!formik.errors.name)}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-danger text-xs mt-1">{formik.errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="course-desc" className="block text-sm font-medium text-foreground/80 mb-2">
                  Descripción
                </label>
                <textarea
                  id="course-desc"
                  name="description"
                  rows={3}
                  placeholder="Describí el contenido del curso..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`${inputClass(!!formik.touched.description && !!formik.errors.description)} resize-none`}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-danger text-xs mt-1">{formik.errors.description}</p>
                )}
              </div>

              {/* Level + Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="course-level" className="block text-sm font-medium text-foreground/80 mb-2">
                    Nivel
                  </label>
                  <select
                    id="course-level"
                    name="level"
                    value={formik.values.level}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={selectClass}
                  >
                    {levelOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="course-duration" className="block text-sm font-medium text-foreground/80 mb-2">
                    Duración
                  </label>
                  <input
                    id="course-duration"
                    name="duration"
                    placeholder="ej: 3 meses"
                    value={formik.values.duration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClass(!!formik.touched.duration && !!formik.errors.duration)}
                  />
                  {formik.touched.duration && formik.errors.duration && (
                    <p className="text-danger text-xs mt-1">{formik.errors.duration}</p>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label htmlFor="course-schedule" className="block text-sm font-medium text-foreground/80 mb-2">
                  Horario
                </label>
                <input
                  id="course-schedule"
                  name="schedule"
                  placeholder="ej: Lunes y Miércoles 18:00 - 19:30"
                  value={formik.values.schedule}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputClass(!!formik.touched.schedule && !!formik.errors.schedule)}
                />
                {formik.touched.schedule && formik.errors.schedule && (
                  <p className="text-danger text-xs mt-1">{formik.errors.schedule}</p>
                )}
              </div>

              {/* Price + Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="course-price" className="block text-sm font-medium text-foreground/80 mb-2">
                    Precio (ARS)
                  </label>
                  <input
                    id="course-price"
                    name="price"
                    type="number"
                    placeholder="ej: 5000"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClass(!!formik.touched.price && !!formik.errors.price)}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <p className="text-danger text-xs mt-1">{formik.errors.price}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="course-capacity" className="block text-sm font-medium text-foreground/80 mb-2">
                    Capacidad
                  </label>
                  <input
                    id="course-capacity"
                    name="capacity"
                    type="number"
                    placeholder="ej: 15"
                    value={formik.values.capacity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClass(!!formik.touched.capacity && !!formik.errors.capacity)}
                  />
                  {formik.touched.capacity && formik.errors.capacity && (
                    <p className="text-danger text-xs mt-1">{formik.errors.capacity}</p>
                  )}
                </div>
              </div>

              {/* Instructor ID */}
              <div>
                <label htmlFor="course-instructor" className="block text-sm font-medium text-foreground/80 mb-2">
                  ID Instructor
                </label>
                <input
                  id="course-instructor"
                  name="instructorId"
                  placeholder="ID del instructor en la base de datos"
                  value={formik.values.instructorId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputClass(!!formik.touched.instructorId && !!formik.errors.instructorId)}
                />
                {formik.touched.instructorId && formik.errors.instructorId && (
                  <p className="text-danger text-xs mt-1">{formik.errors.instructorId}</p>
                )}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="flat"
                radius="full"
                onPress={() => {
                  setIsDrawerOpen(false);
                  setEditingCourse(null);
                  formik.resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="flat"
                radius="full"
                isLoading={formik.isSubmitting}
                className="font-semibold bg-gradient-to-r from-pink-500 to-pink-600 text-white"
              >
                {editingCourse ? 'Guardar Cambios' : 'Crear Curso'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}
