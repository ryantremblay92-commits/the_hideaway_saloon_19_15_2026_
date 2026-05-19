import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export default cloudinary;

export interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
}

export async function uploadToCloudinary(
    fileUri: string,
    folder: string = 'elegancia'
): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            fileUri,
            {
                folder,
                resource_type: 'auto',
            },
            (error: any, result: any) => {
                if (error) return reject(error);
                resolve(result as CloudinaryUploadResult);
            }
        );
    });
}

export async function deleteFromCloudinary(publicId: string) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error: any, result: any) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}
