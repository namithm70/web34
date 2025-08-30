import { Controller, Get, Query, Param } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { Token } from '@defi-app/sdk';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  async getTokens(
    @Query('chainId') chainId?: string,
    @Query('search') search?: string,
  ): Promise<Token[]> {
    return this.tokensService.getTokens(chainId, search);
  }

  @Get(':address')
  async getToken(
    @Param('address') address: string,
    @Query('chainId') chainId: string,
  ): Promise<Token | null> {
    return this.tokensService.getToken(address, chainId);
  }

  @Get('popular')
  async getPopularTokens(@Query('chainId') chainId: string): Promise<Token[]> {
    return this.tokensService.getPopularTokens(chainId);
  }
}
