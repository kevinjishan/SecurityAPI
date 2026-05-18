import assert from "node:assert/strict";
import test from "node:test";

import { MemoryTokenStore, TokenStore } from "../../src/core/index.mjs";

test("stores and returns unexpired tokens", () => {
  const store = new MemoryTokenStore({ now: () => 1_000, expirationSkewMs: 0 });
  const token = store.set("kiwoom:mock", {
    accessToken: "abc",
    tokenType: "Bearer",
    expiresAt: 2_000,
    raw: { token: "abc" },
  });

  assert.equal(TokenStore, MemoryTokenStore);
  assert.deepEqual(token, {
    accessToken: "abc",
    tokenType: "Bearer",
    expiresAt: 2_000,
    raw: { token: "abc" },
  });
  assert.equal(store.get("kiwoom:mock")?.accessToken, "abc");
  assert.equal(store.has("kiwoom:mock"), true);
});

test("removes expired tokens on read", () => {
  let now = 1_000;
  const store = new MemoryTokenStore({ now: () => now, expirationSkewMs: 100 });
  store.set("ls:prod", { accessToken: "abc", expiresAt: 1_050 });

  assert.equal(store.get("ls:prod"), null);
  assert.equal(store.peek("ls:prod"), null);
});

test("keeps tokens without finite expiration", () => {
  const store = new MemoryTokenStore({ now: () => 10_000 });
  store.set("kiwoom:prod", { accessToken: "abc" });

  assert.equal(store.get("kiwoom:prod")?.expiresAt, null);
});

test("deletes and clears tokens", () => {
  const store = new MemoryTokenStore();
  store.set("a", { accessToken: "a" });
  store.set("b", { accessToken: "b" });

  assert.equal(store.delete("a"), true);
  assert.equal(store.get("a"), null);

  store.clear();
  assert.equal(store.get("b"), null);
});

test("validates keys and token payloads", () => {
  const store = new MemoryTokenStore();

  assert.throws(() => store.set("", { accessToken: "abc" }), /key is required/);
  assert.throws(() => store.set("x", {}), /accessToken is required/);
  assert.throws(() => store.set("x", null), /Token object is required/);
});
