import { spawnSync } from "node:child_process";

const scripts = [
  "auth-only.mjs",
  "kiwoom-domestic-quote.mjs",
  "ls-domestic-quote.mjs",
  "ls-overseas-quote.mjs",
  "ls-overseas-realtime.mjs",
  "account-readonly.mjs",
  "technical-market-signals.mjs",
];

for (const script of scripts) {
  const result = spawnSync(process.execPath, [
    new URL(script, import.meta.url).pathname,
    "--validate-only",
    "--json",
  ], {
    cwd: new URL("../..", import.meta.url),
    encoding: "utf8",
    env: {
      ...process.env,
      SECURITY_API_LIVE_READONLY: "false",
      SECURITY_API_ALLOW_LIVE_ORDER: "false",
    },
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("Live read-only examples validate-only run passed.");
