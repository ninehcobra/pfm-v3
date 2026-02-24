import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { SystemLogLevel } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      totalBlogs,
      totalProjects,
      totalExperiences,
      totalContacts,
      totalSubscribers,
      visits24h,
      errors24h,
      recentActivity,
      blogViews,
      topBlogs,
      recentComments,
    ] = await Promise.all([
      this.prisma.blog.count(),
      this.prisma.project.count(),
      this.prisma.experience.count(),
      this.prisma.contact.count(),
      this.prisma.subscriber.count(),
      this.prisma.systemLog.count({
        where: {
          path: { contains: '/portfolio' },
          createdAt: { gte: last24h },
        },
      }),
      this.prisma.systemLog.count({
        where: {
          level: SystemLogLevel.ERROR,
          createdAt: { gte: last24h },
        },
      }),
      this.prisma.systemLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          action: true,
          message: true,
          level: true,
          createdAt: true,
        },
      }),
      this.prisma.blog.aggregate({
        _sum: { views: true },
      }),
      this.prisma.blog.findMany({
        take: 3,
        orderBy: { views: 'desc' },
        include: { translations: true },
      }),
      this.prisma.comment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { fullName: true, avatar: true } },
          blog: { include: { translations: true } },
        },
      }),
    ]);

    // System Health Check (Mock for now, but real DB check)
    const dbHealthy = await this.checkDbHealth();

    return {
      overview: {
        totalBlogs,
        totalProjects,
        totalExperiences,
        totalContacts,
        totalSubscribers,
        visits24h,
        errors24h,
        totalBlogViews: blogViews._sum?.views || 0,
      },
      recentActivity,
      topBlogs: topBlogs.map((b) => ({
        id: b.id,
        title: b.translations?.[0]?.title || 'Untitled',
        views: b.views,
        slug: b.slug,
      })),
      recentComments: recentComments.map((c) => ({
        id: c.id,
        content: c.content,
        author: c.author?.fullName || 'Anonymous',
        blogTitle: c.blog?.translations?.[0]?.title || 'Untitled',
        createdAt: c.createdAt,
      })),
      systemHealth: [
        { name: 'API Server', status: 'Healthy', latency: '24ms' },
        {
          name: 'PostgreSQL Database',
          status: dbHealthy ? 'Connected' : 'Error',
          latency: '5ms',
        },
        { name: 'Frontend Edge', status: 'Active', latency: '15ms' },
      ],
    };
  }

  private async checkDbHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
