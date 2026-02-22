import { 
  Controller, 
  Get, 
  Put, 
  Body, 
  UseGuards, 
  Req, 
  Inject,
  NotFoundException
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { USER_REPOSITORY, IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IMediaService, MEDIA_SERVICE } from '../../application/services/media.service';
import { UserDto } from '../../application/dto/user.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    @Inject(MEDIA_SERVICE) private mediaService: IMediaService,
  ) {}

  @Get()
  async getProfile(@Req() req: any) {
    const user = await this.userRepository.findById(req.user.sub);
    if (!user) throw new NotFoundException('User not found');
    return new UserDto(user);
  }

  @Put()
  async updateProfile(@Req() req: any, @Body() data: any) {
    const userId = req.user.sub;
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Handle avatar cleanup
    if (data.avatar && user.avatarPublicId && data.avatarPublicId !== user.avatarPublicId) {
      await this.mediaService.deleteImage(user.avatarPublicId);
    }

    const updatedUser = await this.userRepository.update(userId, {
      fullName: data.fullName,
      avatar: data.avatar,
      avatarPublicId: data.avatarPublicId,
    });

    return new UserDto(updatedUser);
  }
}
