import { withError } from "./withError";
import { Http, HttpClientFactory } from "@signumjs/http";
import { MarketData } from "@/types/marketData";
import { TickerSymbol } from "@/types/tickerSymbol";

export class MarketService {
  private readonly httpClient: Http;

  constructor() {
    this.httpClient = HttpClientFactory.createHttpClient(
      "https://api.coingecko.com"
    );
  }

  public getSignaMarket(tickerSymbol: TickerSymbol) {
    return this.getCrossMarket("signum", tickerSymbol);
  }

  public getUsdBrlMarket() {
    return this.getCrossMarket("usd", "brl");
  }

  public getCrossMarket(
    from: TickerSymbol | string,
    to: TickerSymbol | string
  ) {
    return withError<MarketData | null>(async () => {
      const { response } = await this.httpClient.get(
        `api/v3/coins/markets?vs_currency=${to}&ids=${from}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      );
      if (!response) return null;
      if (!response.length) return null;
      return <MarketData>response[0];
    });
  }
}
