import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class ExperienceManagementService {
  constructor(private prisma: PrismaService) {}

  async createExperience(data: {
    period: string;
    translations: { languageCode: string; company: string; role: string; description: string }[];
  }) {
    const langCodes = data.translations.map(t => t.languageCode);
    const languages = await this.prisma.language.findMany({
      where: { code: { in: langCodes } }
    });
    const langMap = new Map(languages.map(l => [l.code, l.id]));

    return this.prisma.experience.create({
      data: {
        period: data.period,
        translations: {
          create: data.translations.map(t => ({
            languageId: langMap.get(t.languageCode)!,
            company: t.company,
            role: t.role,
            description: t.description,
          }))
        }
      },
      include: { translations: true }
    });
  }

  async updateExperience(id: string, data: {
    period?: string;
    translations: { languageCode: string; company: string; role: string; description: string }[];
  }) {
    const exp = await this.prisma.experience.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException('Experience not found');

    const languages = await this.prisma.language.findMany({
      where: { code: { in: data.translations.map(t => t.languageCode) } }
    });
    const langMap = new Map(languages.map(l => [l.code, l.id]));

    await this.prisma.experience.update({
      where: { id },
      data: { period: data.period }
    });

    for (const t of data.translations) {
      const languageId = langMap.get(t.languageCode);
      if (languageId) {
        await this.prisma.experienceTranslation.upsert({
          where: { experienceId_languageId: { experienceId: id, languageId } },
          update: { company: t.company, role: t.role, description: t.description },
          create: { experienceId: id, languageId, company: t.company, role: t.role, description: t.description }
        });
      }
    }

    return this.prisma.experience.findUnique({
      where: { id },
      include: { translations: true }
    });
  }

  async deleteExperience(id: string) {
    return this.prisma.experience.delete({ where: { id } });
  }

  async getAllExperiences() {
    return this.prisma.experience.findMany({
      include: {
        translations: {
          include: { language: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
