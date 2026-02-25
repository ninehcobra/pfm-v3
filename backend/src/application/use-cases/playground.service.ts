import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class PlaygroundService {
  constructor(private readonly prisma: PrismaService) {}

  async saveScore(data: {
    gameKey: string;
    score: number;
    userId?: string;
    playerName?: string;
  }) {
    return await this.prisma.gameScore.create({
      data: {
        gameKey: data.gameKey,
        score: data.score,
        userId: data.userId || null,
        playerName: data.playerName || 'Anonymous',
      },
      include: {
        user: {
          select: {
            fullName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async getLeaderboard(gameKey: string, limit: number = 10) {
    const scores = await this.prisma.gameScore.findMany({
      where: { gameKey },
      orderBy: [
        { score: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        user: {
          select: {
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    const uniqueScores = [];
    const seenUsers = new Set<string>();
    const seenGuests = new Set<string>();

    for (const s of scores) {
      if (s.userId) {
        if (!seenUsers.has(s.userId)) {
          uniqueScores.push(s);
          seenUsers.add(s.userId);
        }
      } else {
        const guestKey = s.playerName || 'Anonymous';
        if (!seenGuests.has(guestKey)) {
          uniqueScores.push(s);
          seenGuests.add(guestKey);
        }
      }
      if (uniqueScores.length >= limit) break;
    }

    return uniqueScores;
  }

  async getUserHistory(userId: string, gameKey: string, limit: number = 5) {
    return await this.prisma.gameScore.findMany({
      where: {
        userId,
        gameKey,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getUserBest(userId: string, gameKey: string) {
    return await this.prisma.gameScore.findFirst({
      where: {
        userId,
        gameKey,
      },
      orderBy: { score: 'desc' },
    });
  }
}
