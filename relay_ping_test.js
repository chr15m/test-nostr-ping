#!/usr/bin/env node
import { fileURLToPath } from 'url';
import path from 'path';
import { SimplePool, useWebSocketImplementation } from 'nostr-tools/pool';
import WebSocket from 'ws';

useWebSocketImplementation(WebSocket);

export async function getRelayInfo(relayUrl) {
  // Convert wss:// to https:// or ws:// to http://
  const httpUrl = relayUrl.replace(/^ws/, 'http');

  try {
    const response = await fetch(httpUrl, {
      headers: {
        'Accept': 'application/nostr+json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Relay Information:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch relay information:', error);
  }
}

const __filename = fileURLToPath(import.meta.url);

// This allows the script to be used as a module or run directly
if (path.resolve(process.argv[1]) === __filename) {
  (async () => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      process.stdout.write(`Time elapsed: ${elapsed}s\r`);
    }, 1000);

    let relayUrl = process.argv[2];
    if (!relayUrl) {
      clearInterval(timer);
      console.error('Please provide a relay URL.');
      console.log('Usage: ./relay_fetch_example.js <relay_url>');
      process.exit(1);
    }

    // Add wss:// if no protocol is specified
    if (!relayUrl.startsWith('ws://') && !relayUrl.startsWith('wss://')) {
      relayUrl = `wss://${relayUrl}`;
    }

    await getRelayInfo(relayUrl);

    const pool = new SimplePool();
    const relays = [relayUrl];

    console.log(`\nConnecting to ${relayUrl} and subscribing to events...`);

    const relay = await pool.ensureRelay(relayUrl);
    const ws = relay.ws; // Accessing private property of AbstractRelay
    let pingTimeout;

    if (ws) {
      ws.on('pong', () => {
        console.log(`\nReceived pong from ${relayUrl}`);
      });

      ws.on('close', (code, reason) => {
        console.log(`\nWebSocket connection to ${relayUrl} closed. Code: ${code}, Reason: ${reason.toString()}`);
      });

      const sendPing = () => {
        if (ws.readyState === WebSocket.OPEN) {
          console.log(`\nSending ping to ${relayUrl}`);
          ws.ping();
          pingTimeout = setTimeout(sendPing, 10000);
        }
      };
      sendPing();
    }

    relay.onclose = () => {
      console.log(`websocket onclose: ${relayUrl}`);
      if (pingTimeout) {
        clearTimeout(pingTimeout);
      }
    };

    pool.subscribeMany(
      relays,
      [
        {
          kinds: [30078],
          limit: 1,
        },
      ],
      {
        onevent(event) {
          console.log('Received event:', event);
        },
        oneose() {
          console.log('Initial events received, waiting for new ones...');
        },
        onclose(reasons) {
          clearInterval(timer);
          console.log(`subscription onclose: ${relayUrl}`, reasons);
        },
      }
    );
  })();
}
