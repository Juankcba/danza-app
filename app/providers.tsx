'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <NextThemesProvider attribute="class" defaultTheme="dark">
                <HeroUIProvider>
                    {children}
                    <ToastProvider placement="top-right" />
                </HeroUIProvider>
            </NextThemesProvider>
        </SessionProvider>
    );
}
