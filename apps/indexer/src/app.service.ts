import { Injectable } from '@nestjs/common';
import { SwapQuote, Token } from '@defi-app/sdk';

@Injectable()
export class AppService {
  // Mock token data for quotes
  private readonly tokens: Token[] = [
    {
      chainId: 56,
      address: '0x55d398326f99059fF775485246999027B3197955',
      symbol: 'USDT',
      decimals: 18,
      name: 'Tether USD',
    },
    {
      chainId: 56,
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      symbol: 'USDC',
      decimals: 18,
      name: 'USD Coin',
    },
    {
      chainId: 56,
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      symbol: 'WBNB',
      decimals: 18,
      name: 'Wrapped BNB',
    },
  ];

  getHello(): string {
    return 'DeFi Indexer API - Welcome!';
  }

  async getSwapQuote(
    chainId: number,
    inTokenAddress: string,
    outTokenAddress: string,
    amount: string,
    slippage: number,
  ): Promise<SwapQuote> {
    // Find tokens
    const inToken = this.tokens.find(t =>
      t.address.toLowerCase() === inTokenAddress.toLowerCase() && t.chainId === chainId
    );
    const outToken = this.tokens.find(t =>
      t.address.toLowerCase() === outTokenAddress.toLowerCase() && t.chainId === chainId
    );

    if (!inToken || !outToken) {
      throw new Error('Token not found');
    }

    // Mock quote calculation
    const inputAmount = parseFloat(amount);
    const mockPrice = 1; // Mock exchange rate
    const outputAmount = inputAmount * mockPrice * (1 - 0.005); // 0.5% trading fee
    const priceImpact = Math.random() * 2; // Random price impact 0-2%

    const quote: SwapQuote = {
      route: [inToken, outToken],
      inAmount: amount,
      outAmount: outputAmount.toString(),
      minReceived: (outputAmount * (1 - slippage / 100)).toString(),
      priceImpact: priceImpact,
      feeBps: 30, // 0.3%
      gasEstimate: '200000',
    };

    return quote;
  }
}
