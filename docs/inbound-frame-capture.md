# Inbound frame capture barrier

Optional Node >=20 `WebSocketBrokerClient` integration for a host-owned durable sink. Existing clients without `onInboundFrame` keep their synchronous message dispatch and reconnect behavior.

```js
const socketClient = new WebSocketBrokerClient({
  brokerClient: quotaControlledBrokerClient,
  autoReconnect: false,
  onInboundFrame: frame => privacyAwareDurableSink.accept(frame),
  captureMaxPending: 64,
  captureMaxBytes: 65536,
  captureTimeoutMs: 5000,
});
```

The application supplies both objects above. No persistence, quota-controlled client, live authorization or privacy classification is implicitly created by this configuration. A broker client may acquire a token during connect; the host must bind that operation and every subscription to its shared authority/budget before connecting.

## Ordering and identity

Each supported text message gets an immutable `{broker,id,sessionId,sequence,receivedAt,raw}` at the socket message callback. `receivedAt` comes from Date.now (or an explicitly trusted test `captureClock`) once, before queuing; it is never refreshed on delayed delivery. Sequence numbers identify delivered messages within one UUID session, including control/ACK frames.

The sink callback is serialized in receive order and awaited before JSON parsing and message/ACK/realtime events. Resolving the callback means the host accepted that frame; the SDK cannot independently certify an fsync, receipt identity or a database commit. The host must do that before resolving. A host that calls a classification helper inside its sink may parse an envelope there before persistence; that is distinct from later SDK/domain dispatch.

All inbound text frames, including control and potentially private responses, enter this hook. It is not a public-data filter. Use a privacy-aware host admission/filter and never blindly archive or log frame contents or subscription requests. The SDK does not persist raw data or error cause text.

Text is preserved exactly as delivered by the WebSocket API. The byte bound measures UTF8 encoding. This is not a claim about original TLS/wire bytes; binary/object frames are rejected in capture mode. The legacy path remains unchanged.

## Bounds and stopping

- Pending frames include the active callback: default64, configurable1..256. Frame byte bound: default65536, configurable1..1048576. Sink timeout: default5000ms, configurable1..30000ms.
- Invalid receive clocks, queue/byte overflow, sink failure/timeout or socket error close and latch the session. No subsequent queued frame dispatches. Exceptions are reported by a generic error with a finite `details.code`; private sink/socket diagnostic text is not copied.
- Closing while a callback is pending prevents its later dispatch. Closing from a message listener also suppresses the later ACK/realtime phase. Existing synchronous event listener semantics otherwise apply; returned event-listener promises are not a transaction or durable-consumer ACK.
- Capture mode requires explicit `autoReconnect:false`. Automatic reconnect, manual reconnect, or a second connection/authentication attempt on the same capture instance are forbidden. Concurrent first connects share one attempt. Closing during endpoint/token resolution prevents a later socket opening; already-started token work itself is not cancelled by this hook.
- A new instance represents a new host-authorized session. It does not prove upstream continuity or authorize reuse of an old budget. The host must record disconnection/gap status, backfill/reseed decisions and a new durable receive context.

`inspectCapture()` exposes safe counters/state; it contains neither raw frames nor tokens. `waitForCaptureIdle({timeoutMs})` observes bounded completion and returns `idle:false` if callbacks remain active. Sink timeout is not cancellation: an underlying callback may still commit later. `outcomeUnknown` remains latched even after a late callback settles, and no late dispatch occurs. Idle does not mean the session is healthy or gap-free.

Frames waiting in process memory are not durable until the host sink accepts them. This feature does not provide zero-loss transport, upstream gap recovery, a live execution admission, production latency/retention SLO or physical power-loss certification.

## Protocol envelope classification

`classifyInboundFrame(raw)` is a pure protocol helper returning CONTROL with no control payload, DATA with standard normalized envelopes, or UNRECOGNIZED. It is not privacy or execution admission. DATA can include account/private stream identifiers. Compare payload identifiers and keys with the authorized capability and reject private fields before storage. The input callback `frame.id` is the connection endpoint selection, not a verified payload TR/type or symbol.
