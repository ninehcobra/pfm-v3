import { Controller, Get, Query } from '@nestjs/common';
import { PortfolioService } from '../../application/use-cases/portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  async getPortfolio(@Query('locale') locale: string = 'en') {
    return this.portfolioService.getPortfolio(locale);
  }

  @Get('languages')
  async getLanguages() {
    return this.portfolioService.getAvailableLanguages();
  }
}
