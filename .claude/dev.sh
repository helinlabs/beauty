#!/bin/sh
# Wrapper so Preview-started commands can find node/npm even when the MCP
# spawns them without a user shell profile.
export PATH="$HOME/.local/node/bin:$PATH"
exec "$HOME/.local/node/bin/npm" run dev
