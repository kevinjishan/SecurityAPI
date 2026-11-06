# Shared realtime usage policy

`resolveRealtimeUsagePolicy(registry.getUsagePolicy("ls"), {at: Date.now(), localMaxSessions: 1, localMaxSubscriptions: 1, localMessageGapMs: 1000})` interprets official LS metadata and explicit local bounds. It performs no network request, token issuance, queueing or automatic enforcement.

The account/appkey limit of three sessions has an effective announcement from 2026-10-31 08:00 KST. The subscription ceiling of 200 per session was announced as a final target, while the later first-stage notice says subscription enforcement is still planned. The result preserves this distinction; it does not mark the 200 ceiling as active. Different TR/instrument pairs count separately.

The host must coordinate every known producer for the same actual scope, include outside active sessions, retain uncertain session/subscription reservations across crashes, and bind auth to the existing shared authority. A returned socket.send is not a server ACK. Do not release a session/subscription reservation merely because a local close or unsubscribe was requested.

Message registration/removal rates, current IP accounting and token issuance frequency remain unknown. The mandatory positive local message gap is an application bound; it is not a verified provider quota. Missing/ambiguous/effective-in-the-future official policy fails closed. Local caps cannot exceed published session or announced subscription ceilings.

Sources: [first-stage notice](https://openapi.ls-sec.co.kr/community/10000000-0000-0011-0000-000000000001/posts/03f7e4d4-cdb3-4276-a7b6-0f27ca5ebfb5), [final-policy announcement](https://openapi.ls-sec.co.kr/community/10000000-0000-0011-0000-000000000001/posts/043f99f1-271c-4d00-93e4-21b1fbff8de0). Existing metadata is a dated snapshot. Current source retrieval and runtime scope inventory remain host evidence, not a guarantee from this helper.
