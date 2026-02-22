import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './auth.module';
import { UserPersistenceModule } from './infrastructure/prisma/user-persistence.module';
import { BlogController } from './presentation/controllers/blog.controller';
import { AuthController } from './presentation/controllers/auth.controller';
import { BlogService } from './application/use-cases/blog.service';
import { BLOG_REPOSITORY } from './domain/repositories/blog.repository.interface';
import { BlogRepository } from './infrastructure/prisma/blog.repository';
import { PortfolioController } from './presentation/controllers/portfolio.controller';
import { PortfolioService } from './application/use-cases/portfolio.service';
import { ProjectManagementController } from './presentation/controllers/project.management.controller';
import { ProjectManagementService } from './application/use-cases/project.management.service';
import { ExperienceManagementController } from './presentation/controllers/experience.management.controller';
import { ExperienceManagementService } from './application/use-cases/experience.management.service';
import { UIContentManagementController } from './presentation/controllers/uicontent.management.controller';
import { UIContentManagementService } from './application/use-cases/uicontent.management.service';
import { LanguageManagementController } from './presentation/controllers/language.management.controller';
import { LanguageManagementService } from './application/use-cases/language.management.service';
import { UploadController } from './presentation/controllers/upload.controller';
import { ProfileController } from './presentation/controllers/profile.controller';
import { MEDIA_SERVICE } from './application/services/media.service';
import { CloudinaryService } from './infrastructure/cloudinary/cloudinary.service';

@Module({
  imports: [PrismaModule, AuthModule, UserPersistenceModule],
  controllers: [AppController, AuthController, BlogController, PortfolioController, ProjectManagementController, ExperienceManagementController, UIContentManagementController, LanguageManagementController, UploadController, ProfileController],
  providers: [
    AppService,
    BlogService,
    PortfolioService,
    ProjectManagementService,
    ExperienceManagementService,
    UIContentManagementService,
    LanguageManagementService,
    {
      provide: MEDIA_SERVICE,
      useClass: CloudinaryService,
    },
    {
      provide: BLOG_REPOSITORY,
      useClass: BlogRepository,
    },
  ],
})
export class AppModule {}
