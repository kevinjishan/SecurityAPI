import test from "node:test";
import assert from "node:assert/strict";

import { getCapabilities } from "../../src/capabilities/index.mjs";
import { CAPABILITY_DEFINITIONS } from "../../src/capabilities/definitions.mjs";
import { CANDLE_CAPABILITY_IDS } from "../../src/services/candleSupport.mjs";

test("every candle interval capability id is defined", () => {
  for (const capabilityId of Object.values(CANDLE_CAPABILITY_IDS)) {
    assert.ok(
      Object.hasOwn(CAPABILITY_DEFINITIONS, capabilityId),
      `${capabilityId} missing from CAPABILITY_DEFINITIONS`,
    );
  }
});

test("all domestic brokers advertise weekly candles", () => {
  for (const broker of ["kiwoom", "ls", "db", "kis"]) {
    assert.equal(
      getCapabilities(broker).supports("marketData.domesticStock.weeklyCandles"),
      true,
      `${broker} should support weekly candles`,
    );
  }
});
