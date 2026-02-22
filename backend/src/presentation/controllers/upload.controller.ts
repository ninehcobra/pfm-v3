import { 
  Controller, 
  Post, 
  Delete,
  Param,
  UseInterceptors, 
  UploadedFile, 
  Inject, 
  UseGuards,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from '../guards/permissions.decorator';
import { IMediaService, MEDIA_SERVICE } from '../../application/services/media.service';

@Controller('upload')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UploadController {
  constructor(
    @Inject(MEDIA_SERVICE) private mediaService: IMediaService
  ) {}

  @Post('image')
  @Permissions('system:config')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    return this.mediaService.uploadImage(file);
  }

  @Delete('image/:publicId')
  @Permissions('system:config')
  async deleteImage(@Param('publicId') publicId: string) {
    return this.mediaService.deleteImage(publicId);
  }
}
