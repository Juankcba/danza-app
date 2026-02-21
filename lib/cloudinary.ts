import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
    fileBase64: string,
    folder: string = 'alma-expresion'
) {
    try {
        const result = await cloudinary.uploader.upload(fileBase64, {
            folder,
            resource_type: 'image',
            transformation: [
                { width: 800, height: 800, crop: 'limit', quality: 'auto', format: 'webp' },
            ],
        });
        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return { success: false, error };
    }
}

export async function deleteImage(publicId: string) {
    try {
        await cloudinary.uploader.destroy(publicId);
        return { success: true };
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return { success: false, error };
    }
}

export { cloudinary };
