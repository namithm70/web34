import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { SwapQuote, Token } from '@defi-app/sdk';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('quotes')
  async getSwapQuote(
    @Query('chainId') chainId: string,
    @Query('in') inTokenAddress: string,
    @Query('out') outTokenAddress: string,
    @Query('amount') amount: string,
    @Query('slippage') slippage: string = '0.5',
  ): Promise<SwapQuote> {
    return this.appService.getSwapQuote(
      parseInt(chainId),
      inTokenAddress,
      outTokenAddress,
      amount,
      parseFloat(slippage)
    );
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}