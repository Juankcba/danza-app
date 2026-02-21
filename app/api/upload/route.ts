import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { image, folder } = await request.json();

        if (!image) {
            return NextResponse.json(
                { error: 'No se proporcionó una imagen' },
                { status: 400 }
            );
        }

        // Validate base64 image
        if (!image.startsWith('data:image/')) {
            return NextResponse.json(
                { error: 'Formato de imagen inválido' },
                { status: 400 }
            );
        }

        const result = await uploadImage(image, folder || 'alma-expresion');

        if (!result.success) {
            return NextResponse.json(
                { error: 'Error al subir la imagen' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            url: result.url,
            publicId: result.publicId,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
