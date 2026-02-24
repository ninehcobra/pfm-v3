export interface IMediaService {
  uploadImage(
    file: { buffer: Buffer; mimetype: string },
    folder?: string,
  ): Promise<{ url: string; publicId: string }>;
  deleteImage(publicId: string): Promise<void>;
}

export const MEDIA_SERVICE = 'MEDIA_SERVICE';
