# Easy Screen Recorder

A one-page screen recorder built for people who aren't good with tech. Big buttons,
plain words, and recordings **never leave the computer** — there is no server, no
upload, no account.

**Live app:** https://coffee-discord.github.io/easy-screen-recorder/

## What it does

- Records the **entire screen** (or a window, if that's what gets picked)
- Toggle for **computer sound** (system audio) and **microphone** (with a live level meter)
- Saves as **.mp4** (H.264 + AAC) — plays everywhere
- Save location: **Downloads** by default, or pick a folder once and it remembers
- 3-2-1 countdown, big timer, instant replay after saving
- Installable as a desktop app (Chrome/Edge "Install" → icon in Start menu), works offline

## Requirements

Chrome or Microsoft Edge on Windows (Edge is preinstalled on every Windows 10/11 PC).
System-audio capture also works on macOS 14.2+ with a current Chrome. The page detects
unsupported browsers and explains what to do in plain language.

## How it works

`getDisplayMedia` + `getUserMedia` → Web Audio mixes system + mic into one track →
`MediaRecorder` writes MP4 directly (no transcoding, no wasm). File System Access API
handles the custom save folder. A tiny service worker makes it installable/offline.
One HTML file, no build step, no dependencies.

## Development

```
node dev-server.js   # serves on http://localhost:8123
```

The dev server also accepts `POST /__test/save?name=x.mp4` so automated tests can
write recorded blobs to `test-output/` for inspection with ffprobe.

## Deploying

Push to `main` — GitHub Pages serves the repo root. The service worker fetches the
page network-first, so users get updates on their next visit with no cache confusion.
