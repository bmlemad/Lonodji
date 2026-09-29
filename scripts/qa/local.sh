#!/bin/bash
# Contrôle local complet : démarre le site construit (next start) sur le port 3100,
# lance scripts/qa/controle.py (liens, ancres, console, axe, visuel), puis l'arrête.
# Prérequis : npm run build ; python3 avec playwright ; npm i -D axe-core.
set -u
cd "$(dirname "$0")/../.."
PORT="${PORT:-3100}"
pkill -f "next-serve[r]" 2>/dev/null; sleep 1
npx next start -p "$PORT" > .next/qa-serveur.log 2>&1 &
PID=$!
for i in $(seq 1 40); do curl -s -o /dev/null "http://127.0.0.1:$PORT/" && break; sleep 1; done
python3 scripts/qa/controle.py "http://127.0.0.1:$PORT" --visuel "$@"
CODE=$?
kill $PID 2>/dev/null; pkill -f "next-serve[r]" 2>/dev/null; wait $PID 2>/dev/null
exit $CODE
