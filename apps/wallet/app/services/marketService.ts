import { Http, HttpClientFactory } from "@signumjs/http";
import { MarketData } from "@/types/marketData";
import { TickerSymbol } from "@/types/tickerSymbol";
import { withError } from "@axtp/core/common/withError";

interface FiatMarketData {
  ask: string;
  bid: string;
  code: string;
  codein: string;
  create_date: string;
  high: string;
  low: string;
  name: string;
  pctChange: string;
  timestamp: string;
}

export class MarketService {
  private readonly cryptoMarketClient: Http;
  private readonly fiatMarketClient: Http;

  constructor() {
    this.cryptoMarketClient = HttpClientFactory.createHttpClient(
      "https://api.coingecko.com"
    );
    this.fiatMarketClient = HttpClientFactory.createHttpClient(
      "https://economia.awesomeapi.com.br/"
    );
  }

  public getSignaMarket(tickerSymbol: TickerSymbol) {
    return this.getCoingeckoCrossMarket("signum", tickerSymbol);
  }

  public getUsdBrlMarket() {
    return withError<MarketData | null>(async () => {
      const { response } = await this.fiatMarketClient.get(`last/USD-BRL`);
      if (!response) return null;
      if (!response["USDBRL"]) return null;
      const data: FiatMarketData = response["USDBRL"];

      const convert = (vstr: string) => parseFloat(parseFloat(vstr).toFixed(2));

      return {
        current_price: convert(data.ask), // we take the higher value here
        high_24h: convert(data.high),
        low_24h: convert(data.low),
        last_updated: data.create_date,
        price_change_percentage_24h: convert(data.pctChange),
      };
    });
  }

  public getCoingeckoCrossMarket(
    from: TickerSymbol | string,
    to: TickerSymbol | string,
    apikey: string = "CG-QoMgGZi4yScFwoRcjXNhx6qB"
  ) {
    return withError<MarketData | null>(async () => {
      const { response } = await this.cryptoMarketClient.get(
        `api/v3/coins/markets?vs_currency=${to}&ids=${from}&order=market_cap_desc&per_page=100&page=1&sparkline=false&x_cg_demo_api_key=${apikey}`
      );
      if (!response) return null;
      if (!response.length) return null;
      return <MarketData>response[0];
    });
  }
}
