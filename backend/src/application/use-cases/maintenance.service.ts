import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async clearLogs() {
    this.logger.log('Clearing system logs...');
    await this.prisma.systemLog.deleteMany({});
    return { message: 'System logs cleared successfully' };
  }

  async runSeed() {
    this.logger.log('Running database seed...');
    try {
      const { stdout, stderr } = await execPromise('npx prisma db seed');
      this.logger.log(`Seed output: ${stdout}`);
      if (stderr) this.logger.error(`Seed error output: ${stderr}`);
      return { message: 'Database seeded successfully', output: stdout };
    } catch (error: any) {
      this.logger.error('Failed to run seed:', error);
      throw new Error(`Seed failed: ${error?.message || 'Unknown error'}`);
    }
  }

  async resetAll() {
    this.logger.warn('Resetting all non-user data...');
    await this.prisma.$transaction([
      this.prisma.systemLog.deleteMany({}),
      this.prisma.contact.deleteMany({}),
      this.prisma.subscriber.deleteMany({}),
      this.prisma.comment.deleteMany({}),
      this.prisma.reaction.deleteMany({}),
      this.prisma.blogTranslation.deleteMany({}),
      this.prisma.blog.deleteMany({}),
      this.prisma.tag.deleteMany({}),
      this.prisma.projectTranslation.deleteMany({}),
      this.prisma.project.deleteMany({}),
      this.prisma.experienceTranslation.deleteMany({}),
      this.prisma.experience.deleteMany({}),
      this.prisma.uIContent.deleteMany({}),
    ]);
    
    return this.runSeed();
  }
}
