import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class LanguageManagementService {
  constructor(private prisma: PrismaService) {}

  async getAllLanguages() {
    return this.prisma.language.findMany({
      orderBy: { isDefault: 'desc' }
    });
  }

  async createLanguage(data: {
    code: string;
    name: string;
    fontFamily?: string;
    direction?: string;
    isDefault?: boolean;
  }) {
    const newLang = await this.prisma.language.create({ data });

    // Auto-copy UIContent from Default Language to the new language
    const defaultLang = await this.prisma.language.findFirst({ where: { isDefault: true } });
    if (defaultLang && defaultLang.id !== newLang.id) {
      const defaultContent = await this.prisma.uIContent.findMany({
        where: { languageId: defaultLang.id }
      });

      if (defaultContent.length > 0) {
        await this.prisma.uIContent.createMany({
          data: defaultContent.map(c => ({
            key: c.key,
            languageId: newLang.id,
            value: c.value
          }))
        });
      }
    }

    return newLang;
  }

  async updateLanguage(id: string, data: {
    code?: string;
    name?: string;
    fontFamily?: string;
    direction?: string;
    isDefault?: boolean;
  }) {
    const lang = await this.prisma.language.findUnique({ where: { id } });
    if (!lang) throw new NotFoundException('Language not found');

    if (data.isDefault && !lang.isDefault) {
      await this.prisma.language.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      });
    }

    return this.prisma.language.update({
      where: { id },
      data
    });
  }

  async deleteLanguage(id: string) {
    const lang = await this.prisma.language.findUnique({ where: { id } });
    if (!lang) throw new NotFoundException('Language not found');
    if (lang.isDefault) throw new Error('Cannot delete default language');

    return this.prisma.language.delete({ where: { id } });
  }
}
