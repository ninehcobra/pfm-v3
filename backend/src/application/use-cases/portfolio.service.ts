import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Language } from '@prisma/client';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getPortfolio(locale: string) {
    const language = (await this.prisma.language.findUnique({
      where: { code: locale },
    })) as Language | null;

    if (!language) {
      // Fallback to default if locale not found
      const defaultLang = (await this.prisma.language.findFirst({
        where: { isDefault: true },
      })) as Language | null;
      if (!defaultLang) throw new NotFoundException('Language not found');
      return await this.getLocalizedContent(defaultLang);
    }

    return await this.getLocalizedContent(language);
  }

  private async getLocalizedContent(language: Language) {
    const [uiContent, projects, experiences] = await Promise.all([
      this.prisma.uIContent.findMany({
        where: { languageId: language.id },
      }),
      this.prisma.project.findMany({
        include: {
          translations: {
            where: { languageId: language.id },
          },
        },
        orderBy: { order: 'asc' },
      }),
      this.prisma.experience.findMany({
        include: {
          translations: {
            where: { languageId: language.id },
          },
        },
        orderBy: { order: 'asc' },
      }),
    ]);

    // Format UI Content into a nested object like the dictionary
    const content: Record<string, any> = {};
    uiContent.forEach((item) => {
      const keys = item.key.split('.');
      let current = content;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (i === keys.length - 1) {
          current[key] = item.value;
        } else {
          current[key] = (current[key] as Record<string, any>) || {};
          current = current[key] as Record<string, any>;
        }
      }
    });

    return {
      language: {
        code: language.code,
        name: language.name,
        fontFamily: language.fontFamily,
        direction: language.direction,
      },
      content,
      projects: projects.map((p) => ({
        id: p.id,
        image: p.image,
        link: p.link,
        techStack: p.techStack,
        title: (p.translations[0] as any)?.title || '',
        description: (p.translations[0] as any)?.description || '',
      })),
      experience: experiences.map((e) => ({
        id: e.id,
        period: e.period,
        company: (e.translations[0] as any)?.company || '',
        role: (e.translations[0] as any)?.role || '',
        description: (e.translations[0] as any)?.description || '',
      })),
    };
  }

  async getAvailableLanguages() {
    return await this.prisma.language.findMany({
      select: {
        code: true,
        name: true,
      },
    });
  }
}
