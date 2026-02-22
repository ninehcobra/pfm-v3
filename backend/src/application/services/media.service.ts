export interface IMediaService {
  uploadImage(file: any, folder?: string): Promise<{ url: string; publicId: string }>;
  deleteImage(publicId: string): Promise<void>;
}

export const MEDIA_SERVICE = 'MEDIA_SERVICE';
