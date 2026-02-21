'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from '@heroui/react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const menuItems = [
  { label: 'Inicio', href: '#' },
  { label: 'Cursos', href: '#cursos' },
  { label: 'Instructores', href: '#instructores' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        base: 'bg-background/70 backdrop-blur-lg border-b border-default-100',
        wrapper: 'max-w-7xl',
      }}
      maxWidth="full"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Alma & Expresión"
              width={36}
              height={41}
              className="rounded-full"
            />
            <span className="text-lg font-bold gradient-text hidden sm:inline">
              Alma & Expresión
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.href}>
            <Link
              href={item.href}
              className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium"
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {session?.user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={session.user.name || ''}
                size="sm"
                src={session.user.image || undefined}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Menú de usuario" items={[
              { key: 'profile' },
              { key: 'dashboard' },
              ...((session.user as any).role === 'ADMIN' ? [{ key: 'admin' }] : []),
              { key: 'logout' },
            ]}>
              {(item) => {
                if (item.key === 'profile') {
                  return (
                    <DropdownItem key="profile" className="h-14 gap-2" textValue="Perfil">
                      <p className="font-semibold">{session.user?.name}</p>
                      <p className="text-sm text-default-500">{session.user?.email}</p>
                    </DropdownItem>
                  );
                }
                if (item.key === 'dashboard') {
                  return (
                    <DropdownItem key="dashboard" onPress={() => router.push('/dashboard')}>
                      Mi Panel
                    </DropdownItem>
                  );
                }
                if (item.key === 'admin') {
                  return (
                    <DropdownItem key="admin" onPress={() => router.push('/admin')}>
                      Administración
                    </DropdownItem>
                  );
                }
                return (
                  <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
                    Cerrar Sesión
                  </DropdownItem>
                );
              }}
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Button
              as={Link}
              href="/login"
              color="primary"
              variant="flat"
              radius="full"
              className="font-semibold bg-gradient-to-r from-pink-500 to-pink-600 text-white"
            >
              Ingresar
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu className="bg-background/95 backdrop-blur-lg">
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link
              href={item.href}
              className="w-full text-foreground/80 hover:text-primary"
              size="lg"
              onPress={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        {!session?.user && (
          <NavbarMenuItem>
            <Button
              as={Link}
              href="/login"
              color="primary"
              variant="flat"
              fullWidth
              className="mt-4"
            >
              Ingresar
            </Button>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
