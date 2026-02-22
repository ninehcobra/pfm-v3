import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getPortfolio(locale: string) {
    const language = await this.prisma.language.findUnique({
      where: { code: locale },
    });

    if (!language) {
      // Fallback to default if locale not found
      const defaultLang = await this.prisma.language.findFirst({
        where: { isDefault: true },
      });
      if (!defaultLang) throw new NotFoundException('Language not found');
      return this.getLocalizedContent(defaultLang);
    }

    return this.getLocalizedContent(language);
  }

  private async getLocalizedContent(language: any) {
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
    const content = {};
    uiContent.forEach((item) => {
      const keys = item.key.split('.');
      let current = content;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (i === keys.length - 1) {
          current[key] = item.value;
        } else {
          current[key] = current[key] || {};
          current = current[key];
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
        title: p.translations[0]?.title || '',
        description: p.translations[0]?.description || '',
      })),
      experience: experiences.map((e) => ({
        id: e.id,
        period: e.period,
        company: e.translations[0]?.company || '',
        role: e.translations[0]?.role || '',
        description: e.translations[0]?.description || '',
      })),
    };
  }

  async getAvailableLanguages() {
    return this.prisma.language.findMany({
      select: {
        code: true,
        name: true,
      },
    });
  }
}
