Testing Nostr relay ping and disconnect behaviour under Node.js.

# Test 1

- No ping heartbeat.
- Connected to relay.damus.io with test subscriptions.
- Disconnected internet for 800s.

# Test 2

- Ping heartbeat.
- Connected to relay.damus.io with test subscriptions.
- Disconnected internet for 250s.
- Observed pings going out with no reply.
- *Only once physical internet was reconnected do the onclose fire*.

```
Relay Information: {
  contact: 'jb55@jb55.com',
  description: 'Damus strfry relay',
  icon: 'https://damus.io/img/logo.png',
  limitation: {
    max_limit: 500,
    max_message_length: 1000000,
    max_subscriptions: 300
  },
  name: 'damus.io',
  negentropy: 1,
  pubkey: '32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245',
  software: 'git+https://github.com/hoytech/strfry.git',
  supported_nips: [
     1,  2,  4,  9, 11,
    22, 28, 40, 70, 77
  ],
  version: '1.0.4-1-g783f9ce8cc77'
}

Connecting to wss://relay.damus.io and subscribing to events...
Received event: {
  content: 'Records read time to sync notification status across devices.',
  created_at: 1752893640,
  id: '787bb8c6d5898a8b279aaa451d92130cd382a5c380b43d71d101cc5b087b41e5',
  kind: 30078,
  pubkey: 'bbf923aa9246065f88c40c7d9bf61cccc0ff3fcff065a8cb2ff4cfbb62088f1e',
  sig: '61fd3a8e0784aae0964309a8a337cf391c1571875d00c37f40810d72927fdbba5bb628e74c8935fbffbdbbafedb5298db81ea41540c160b1e6ac8cdfddedc58a',
  tags: [ [ 'd', 'seen_notifications_at' ] ],
  [Symbol(verified)]: true
}
Initial events received, waiting for new ones...
Time elapsed: 10s
Sending ping to wss://relay.damus.io
Time elapsed: 11s
Received pong from wss://relay.damus.io
Time elapsed: 20s
Sending ping to wss://relay.damus.io
Time elapsed: 21s
Received pong from wss://relay.damus.io
Time elapsed: 30s
Sending ping to wss://relay.damus.io
Time elapsed: 40s
Sending ping to wss://relay.damus.io
Time elapsed: 50s
Sending ping to wss://relay.damus.io
Time elapsed: 60s
Sending ping to wss://relay.damus.io
Time elapsed: 70s
Sending ping to wss://relay.damus.io
Time elapsed: 80s
Sending ping to wss://relay.damus.io
Time elapsed: 90s
Sending ping to wss://relay.damus.io
Time elapsed: 100s
Sending ping to wss://relay.damus.io
Time elapsed: 110s
Sending ping to wss://relay.damus.io
Time elapsed: 120s
Sending ping to wss://relay.damus.io
Time elapsed: 130s
Sending ping to wss://relay.damus.io
Time elapsed: 140s
Sending ping to wss://relay.damus.io
Time elapsed: 150s
Sending ping to wss://relay.damus.io
Time elapsed: 160s
Sending ping to wss://relay.damus.io
Time elapsed: 170s
Sending ping to wss://relay.damus.io
Time elapsed: 180s
Sending ping to wss://relay.damus.io
Time elapsed: 190s
Sending ping to wss://relay.damus.io
Time elapsed: 200s
Sending ping to wss://relay.damus.io
Time elapsed: 210s
Sending ping to wss://relay.damus.io
Time elapsed: 220s
Sending ping to wss://relay.damus.io
Time elapsed: 230s
Sending ping to wss://relay.damus.io
Time elapsed: 240s
Sending ping to wss://relay.damus.io
Time elapsed: 250s
Sending ping to wss://relay.damus.io
Time elapsed: 260s
Sending ping to wss://relay.damus.io
Time elapsed: 270s
Sending ping to wss://relay.damus.io
websocket onclose: wss://relay.damus.io
subscription onclose: wss://relay.damus.io [ 'relay connection closed' ]

WebSocket connection to wss://relay.damus.io closed. Code: 1006, Reason: 
```

# Test 3

- Tested various relays for pong replies to ping.
- Passed: relay.damus.io, nostr.wine, nos.lol, nostr.mom, relay.nostr.band
- Failed: relay.nostr.band

# Test 4 - relay_ping_test_with_close.js

- Manually disconnecting websocket if pong is not received.
- This correctly fires onclose and updates relay statuses.

```
Relay Information: {
  contact: 'jb55@jb55.com',
  description: 'Damus strfry relay',
  icon: 'https://damus.io/img/logo.png',
  limitation: {
    max_limit: 500,
    max_message_length: 1000000,
    max_subscriptions: 300
  },
  name: 'damus.io',
  negentropy: 1,
  pubkey: '32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245',
  software: 'git+https://github.com/hoytech/strfry.git',
  supported_nips: [
     1,  2,  4,  9, 11,
    22, 28, 40, 70, 77
  ],
  version: '1.0.4-1-g783f9ce8cc77'
}

Connecting to wss://relay.damus.io and subscribing to events...
Connection statuses: Map(1) { 'wss://relay.damus.io/' => true }

Sending ping to wss://relay.damus.io
Time elapsed: 1s
Received pong from wss://relay.damus.io
Received event: {
  content: '',
  created_at: 1752895122,
  id: '08f6741d6711869f31fa8df14c62b466307d482e85bb8afedb7620449f4507ad',
  kind: 30078,
  pubkey: 'df8f0a640c3ffd09e293999acfa399d0574c8501fcdabceca5072ee2057d87a5',
  sig: '66664678a0354bd70bd86b2c9fe071339e2387d3f15f84e7c956a4bf4a5e74fa00cb321b0d2280356383f6995c8c441deefb920c3373d2fdcae4c582d0784dab',
  tags: [ [ 'd', 'nostter-read' ] ],
  [Symbol(verified)]: true
}
Initial events received, waiting for new ones...
Connection statuses: Map(1) { 'wss://relay.damus.io/' => true }

Sending ping to wss://relay.damus.io
Time elapsed: 11s
Received pong from wss://relay.damus.io
Connection statuses: Map(1) { 'wss://relay.damus.io/' => true }

Sending ping to wss://relay.damus.io
Connection statuses: Map(1) { 'wss://relay.damus.io/' => true }

No pong received from wss://relay.damus.io in time. Closing connection.
websocket onclose: wss://relay.damus.io
Connection statuses: Map(1) { 'wss://relay.damus.io/' => false }
subscription onclose: wss://relay.damus.io [ 'relay connection closed' ]
Connection statuses: Map(1) { 'wss://relay.damus.io/' => false }

WebSocket connection to wss://relay.damus.io closed. Code: 1006, Reason: (empty)
```
