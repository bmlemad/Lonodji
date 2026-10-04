#!/bin/bash
# Contrôle local complet : démarre le site construit (next start) sur le port 3100,
# lance scripts/qa/controle.py (liens, ancres, console, axe, visuel), puis l'arrête.
# Avant cela, scripts/qa/documents.py lit les PDF publiés (messageries personnelles, kit d'adhésion).
# Prérequis : npm run build ; python3 avec playwright ; npm i -D axe-core.
set -u
cd "$(dirname "$0")/../.."
python3 scripts/qa/documents.py || DOCS=1
PORT="${PORT:-3100}"
pkill -f "next-serve[r]" 2>/dev/null; sleep 1
npx next start -H 127.0.0.1 -p "$PORT" > .next/qa-serveur.log 2>&1 &
PID=$!
READY=0
for i in $(seq 1 20); do
  if curl --fail --silent --max-time 2 -o /dev/null "http://127.0.0.1:$PORT/"; then READY=1; break; fi
  kill -0 "$PID" 2>/dev/null || break
  sleep 1
done
if [ "$READY" != 1 ]; then
  printf '%s\n' "QA : serveur local injoignable ; consulter .next/qa-serveur.log." >&2
  kill "$PID" 2>/dev/null; pkill -f "next-serve[r]" 2>/dev/null
  exit 1
fi
python3 scripts/qa/controle.py "http://127.0.0.1:$PORT" --visuel "$@"
CODE=$?
python3 scripts/qa/parcours-revue.py "http://127.0.0.1:$PORT" || CODE=1
python3 scripts/qa/navigation.py "http://127.0.0.1:$PORT" || CODE=1
python3 scripts/qa/mobile.py "http://127.0.0.1:$PORT" || CODE=1
python3 scripts/qa/fenetres-mobile.py "http://127.0.0.1:$PORT" || CODE=1
python3 scripts/qa/formulaires.py "http://127.0.0.1:$PORT" || CODE=1
python3 scripts/qa/recherche-mobile.py "http://127.0.0.1:$PORT" || CODE=1
kill $PID 2>/dev/null; pkill -f "next-serve[r]" 2>/dev/null; wait $PID 2>/dev/null
[ "${DOCS:-0}" = 1 ] && CODE=1
exit $CODE
