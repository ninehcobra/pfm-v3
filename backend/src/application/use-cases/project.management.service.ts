import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { IMediaService, MEDIA_SERVICE } from '../services/media.service';

@Injectable()
export class ProjectManagementService {
  constructor(
    private prisma: PrismaService,
    @Inject(MEDIA_SERVICE) private mediaService: IMediaService
  ) {}

  async createProject(data: {
    image?: string;
    imagePublicId?: string;
    link?: string;
    techStack: string[];
    translations: { languageCode: string; title: string; description: string }[];
  }) {
    // 1. Find language IDs
    const langCodes = data.translations.map(t => t.languageCode);
    const languages = await this.prisma.language.findMany({
      where: { code: { in: langCodes } }
    });

    const langMap = new Map(languages.map(l => [l.code, l.id]));

    return this.prisma.project.create({
      data: {
        image: data.image,
        imagePublicId: data.imagePublicId,
        link: data.link,
        techStack: data.techStack,
        translations: {
          create: data.translations.map(t => ({
            languageId: langMap.get(t.languageCode)!,
            title: t.title,
            description: t.description,
          }))
        }
      },
      include: { translations: true }
    });
  }

  async updateProject(id: string, data: {
    image?: string;
    imagePublicId?: string;
    link?: string;
    techStack?: string[];
    translations: { languageCode: string; title: string; description: string }[];
  }) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');

    const languages = await this.prisma.language.findMany({
      where: { code: { in: data.translations.map(t => t.languageCode) } }
    });
    const langMap = new Map(languages.map(l => [l.code, l.id]));

    // 4. Handle image cleanup if replaced
    if (data.image && project.imagePublicId && data.imagePublicId !== project.imagePublicId) {
      await this.mediaService.deleteImage(project.imagePublicId);
    }

    // Update main project data and upsert translations
    await this.prisma.project.update({
      where: { id },
      data: {
        image: data.image,
        imagePublicId: data.imagePublicId,
        link: data.link,
        techStack: data.techStack,
      }
    });

    for (const t of data.translations) {
      const languageId = langMap.get(t.languageCode);
      if (languageId) {
        await this.prisma.projectTranslation.upsert({
          where: { projectId_languageId: { projectId: id, languageId } },
          update: { title: t.title, description: t.description },
          create: { projectId: id, languageId, title: t.title, description: t.description }
        });
      }
    }

    return this.prisma.project.findUnique({
      where: { id },
      include: { translations: true }
    });
  }

  async deleteProject(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (project?.imagePublicId) {
      await this.mediaService.deleteImage(project.imagePublicId);
    }
    return this.prisma.project.delete({ where: { id } });
  }

  async getAllProjects() {
    return this.prisma.project.findMany({
      include: {
        translations: {
          include: { language: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
