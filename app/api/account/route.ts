import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function DELETE() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const userId = (session.user as any).id;

        // Delete all related data in order (respecting foreign keys)
        await prisma.payment.deleteMany({ where: { userId } });
        await prisma.enrollment.deleteMany({ where: { userId } });
        await prisma.account.deleteMany({ where: { userId } });
        await prisma.user.delete({ where: { id: userId } });

        return NextResponse.json({ message: 'Cuenta eliminada exitosamente' });
    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json(
            { error: 'Error al eliminar la cuenta' },
            { status: 500 }
        );
    }
}
