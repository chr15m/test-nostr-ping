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
    let relayUrl = process.argv[2];
    if (!relayUrl) {
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
      }
    );
  })();
}
