# Security API Reference

키움증권과 LS증권의 공식 Open API 문서를 AI 코딩 참고용 Markdown 레퍼런스로 생성하는 저장소입니다.

## 사용법

```bash
npm run generate:docs
npm run validate:docs
npm run generate:manifest
npm run validate:manifest
npm run examples:mock
```

Markdown 레퍼런스는 `docs/`에, SDK용 JSON manifest는 `data/generated/`에, 원본 JSON 스냅샷은 `data/raw/`에 저장됩니다.

## SDK 확장 계획

문서 레퍼런스를 공통 증권사 API SDK로 확장하기 위한 방향성은 [docs/sdk-architecture-plan.md](docs/sdk-architecture-plan.md)에 정리되어 있습니다.

초기 SDK 구현은 `data/generated/kiwoom-manifest.json`과 `data/generated/ls-manifest.json`을 기준으로 API ID/TR 코드, 엔드포인트, 헤더, 요청/응답 필드, 인증 필요 여부를 조회하도록 설계합니다.

```js
import { createMetadataRegistry } from "security-api-reference/metadata";

const registry = await createMetadataRegistry();
const endpoint = registry.getEndpoint("kiwoom", "ka10001", { env: "mock" });
const requestFields = registry.getRequestFields("ls", "t1101");
```

Core SDK 유틸리티는 `security-api-reference/core`에서 사용할 수 있습니다.

```js
import { HttpClient, MemoryTokenStore, BrokerError } from "security-api-reference/core";

const http = new HttpClient({ defaultTimeoutMs: 10_000 });
const tokens = new MemoryTokenStore();
```

키움 REST API는 API ID 기반으로 호출할 수 있습니다.

```js
import { KiwoomClient } from "security-api-reference";

const kiwoom = new KiwoomClient({
  appKey: process.env.KIWOOM_APP_KEY,
  secretKey: process.env.KIWOOM_SECRET_KEY,
  env: "mock"
});

const result = await kiwoom.request("ka10001", {
  stk_cd: "005930"
});
```

LS증권 OPEN API는 TR 코드 기반으로 호출할 수 있습니다.

```js
import { LsClient } from "security-api-reference";

const ls = new LsClient({
  appKey: process.env.LS_APP_KEY,
  appSecretKey: process.env.LS_APP_SECRET_KEY,
  macAddress: process.env.LS_MAC_ADDRESS
});

const result = await ls.request("t1101", {
  t1101InBlock: { shcode: "005930" }
});
```

증권사별 문서상 지원 기능은 Capability Layer에서 조회할 수 있습니다.

```js
import { getCapabilities } from "security-api-reference";

const caps = getCapabilities("ls");

caps.supports("quote.domesticStock"); // true
caps.findApis("quote.domesticStock.currentPrice");
```

국내주식 시세 조회 도메인 서비스는 현재가, 호가, 복수 현재가 조회를 제공합니다.
계좌 조회 도메인 서비스는 예수금/주문가능금액, 잔고/평가손익 조회를 제공합니다.

```js
import { AccountService, KiwoomClient, QuoteService } from "security-api-reference";

const clients = {
  kiwoom: new KiwoomClient({
    appKey: process.env.KIWOOM_APP_KEY,
    secretKey: process.env.KIWOOM_SECRET_KEY,
    env: "mock"
  })
};

const quote = new QuoteService(clients);
const account = new AccountService(clients);

const price = await quote.getDomesticStockCurrentPrice("kiwoom", "005930");
const orderBook = await quote.getDomesticStockOrderBook("kiwoom", "005930");
const prices = await quote.getDomesticStockMultiCurrentPrice("kiwoom", ["005930", "000660"]);
const cash = await account.getDomesticStockCash("kiwoom");
const balance = await account.getDomesticStockBalance("kiwoom");
```

실제 API 키 없이 호출 흐름을 확인하려면 [examples](examples/README.md)를 사용합니다.

## 공식 출처

- 키움 REST API: https://openapi.kiwoom.com/guide/apiguide?dummyVal=0
- LS증권 OPEN API: https://openapi.ls-sec.co.kr/apiservice?group_id=ffd2def7-a118-40f7-a0ab-cd4c6a538a90&api_id=33bd887a-6652-4209-88cd-5324bc7c5e36
