# LS delegated token authority

An optional `tokenAuthority` lets an existing issuer supply a dedicated LS client's token without copying app credentials or adding a second OAuth issuer. The original credential/token-store path is unchanged when this option is absent.

```js
const client = new LsClient({
  env: "prod",
  tokenAuthority: {
    async getAccessToken({ broker, env }) {
      return existingIssuer.getAccessToken({ broker, env });
    },
  },
  fetch: existingCoordinatedTransport,
});
```

The trusted composition root supplies the issuer and transport. `tokenAuthority` must implement `getAccessToken`; direct appKey/appSecretKey must be absent. Invalid explicit configurations fail rather than falling back. Calls preserve the provider method receiver. The returned token must have a nonempty accessToken (at most8192 characters, no CR/LF), Bearer tokenType and an integer expiresAt more than60seconds in the future. The SDK projects only these three fields and does not persist the delegated token in its local token store. Provider errors are replaced by a fixed AUTH_ERROR without the private message or cause.

In delegated mode, forced refresh, clearToken, revokeToken and direct token/revoke requests are rejected. An invalid-token market response is returned once; the SDK does not clear a token, ask for a forced refresh, issue OAuth or replay the request. Renewal/invalidation/revocation and authentication singleflight belong to the existing issuer, whose policy may stop the caller instead of renewing. This option does not implement a new issuer or global coordinator.

The issuer/client/transport must be dedicated and scoped by the deployment. This option does not authorize orders, prove credential identity across producers, impose broker-wide quotas, move an existing cache to external storage, or change HTTP retry policies. Callers that require zero market retries must still configure the SDK HTTP retry policy and their shared transport accordingly. Existing order guards remain separate.

Validation uses synthetic tokens and HTTP; no real credentials, OAuth requests, provider quota claims or production migration are included. Legacy credential-backed clients retain their prior invalid-token recovery behavior.
