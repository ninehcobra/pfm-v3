import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { PlaygroundService } from '../../application/use-cases/playground.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../guards/optional-jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Playground')
@Controller('playground')
export class PlaygroundController {
  constructor(private readonly playgroundService: PlaygroundService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post('score')
  @ApiOperation({ summary: 'Save game score' })
  async saveScore(
    @Body() body: { gameKey: string; score: number; playerName?: string },
    @Req() req: { user?: { id: string } },
  ) {
    const userId = req.user?.id;
    return await this.playgroundService.saveScore({
      ...body,
      userId,
    });
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get game leaderboard' })
  async getLeaderboard(
    @Query('gameKey') gameKey: string,
    @Query('limit') limit?: number,
  ) {
    return this.playgroundService.getLeaderboard(gameKey, limit || 10);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('history')
  @ApiOperation({ summary: 'Get user game history' })
  async getUserHistory(
    @Req() req: { user: { id: string } },
    @Query('gameKey') gameKey: string,
    @Query('limit') limit?: number,
  ) {
    return await this.playgroundService.getUserHistory(
      req.user.id,
      gameKey,
      limit || 5,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('personal-best')
  @ApiOperation({ summary: 'Get user personal best score' })
  async getUserBest(
    @Req() req: { user: { id: string } },
    @Query('gameKey') gameKey: string,
  ) {
    return await this.playgroundService.getUserBest(req.user.id, gameKey);
  }
}
