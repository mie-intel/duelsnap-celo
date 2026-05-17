#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SC_ENV="$SCRIPT_DIR/.env"
APPS_ENV="$SCRIPT_DIR/../apps/.env.local"
CHAIN_ID=42220
RPC="https://forno.celo.org"
EXPLORER_URL="https://api.celoscan.io/api"
BLOCK_EXPLORER_URL="https://celoscan.io"

if [[ ! -f "$SC_ENV" ]]; then
  echo "ERROR: sc/.env not found" >&2
  exit 1
fi
set -a; source "$SC_ENV"; set +a

if [[ -z "${DEPLOYER_PRIVATE_KEY:-}" ]]; then
  echo "ERROR: DEPLOYER_PRIVATE_KEY not in sc/.env" >&2
  exit 1
fi

echo "==> Deploying DuelSnap to Celo Mainnet (chain $CHAIN_ID)..."

DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol \
  --rpc-url "$RPC" \
  --broadcast \
  --private-key "$DEPLOYER_PRIVATE_KEY" \
  --legacy \
  -vvv \
  2>&1)

echo "$DEPLOY_OUTPUT"

extract() { echo "$DEPLOY_OUTPUT" | grep "$1" | awk '{print $NF}'; }

QUESTION_POOL=$(extract "QuestionPool proxy")
CASUAL_POOL=$(extract "CasualPool proxy")
GAME_SESSION=$(extract "GameSession proxy")

if [[ -z "$QUESTION_POOL" ]]; then
  echo "ERROR: Could not parse addresses from deploy output"
  exit 1
fi

echo ""
echo "==> Deployed addresses:"
echo "  QuestionPool:  $QUESTION_POOL"
echo "  CasualPool:    $CASUAL_POOL"
echo "  GameSession:   $GAME_SESSION"

update_env() {
  local file="$1" key="$2" val="$3"
  if grep -q "^$key=" "$file"; then
    sed -i "s|^$key=.*|$key=$val|" "$file"
  else
    echo "$key=$val" >> "$file"
  fi
}

echo ""
echo "==> Updating env files..."
for file in "$SC_ENV" "$APPS_ENV"; do
  [[ -f "$file" ]] || continue
  update_env "$file" "NEXT_PUBLIC_QUESTION_POOL_ADDRESS" "$QUESTION_POOL"
  update_env "$file" "NEXT_PUBLIC_CASUAL_POOL_ADDRESS"   "$CASUAL_POOL"
  update_env "$file" "NEXT_PUBLIC_GAME_SESSION_ADDRESS"  "$GAME_SESSION"
  update_env "$file" "NEXT_PUBLIC_CHAIN_ID"              "$CHAIN_ID"
  echo "    updated: $file"
done

# Get impl addresses for verification
impl_slot="0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
get_impl() {
  cast storage "$1" "$impl_slot" --rpc-url "$RPC" 2>/dev/null \
    | awk '{ printf "0x%s\n", substr($0, length($0)-39) }'
}

QUESTION_POOL_IMPL=$(get_impl "$QUESTION_POOL")
CASUAL_POOL_IMPL=$(get_impl "$CASUAL_POOL")
GAME_SESSION_IMPL=$(get_impl "$GAME_SESSION")

echo ""
echo "==> Attempting CeloScan verification (needs CELOSCAN_API_KEY)..."

verify_celoscan() {
  local addr="$1" contract="$2"
  echo "  $contract ($addr)"
  forge verify-contract "$addr" "$contract" \
    --chain-id "$CHAIN_ID" \
    --verifier etherscan \
    --verifier-url "$EXPLORER_URL" \
    --etherscan-api-key "${CELOSCAN_API_KEY:-placeholder}" \
    --watch \
    2>&1 | tail -3 || true
}

verify_celoscan "$QUESTION_POOL_IMPL" "src/QuestionPool.sol:QuestionPool"
verify_celoscan "$CASUAL_POOL_IMPL"   "src/CasualPool.sol:CasualPool"
verify_celoscan "$GAME_SESSION_IMPL"  "src/GameSession.sol:GameSession"

echo ""
echo "==> Impl addresses (for manual verification at celoscan.io):"
echo "  QuestionPool: $QUESTION_POOL_IMPL"
echo "  CasualPool:   $CASUAL_POOL_IMPL"
echo "  GameSession:  $GAME_SESSION_IMPL"

echo ""
echo "==> Clearing Redis..."
node -e "
require('dotenv').config({ path: '$APPS_ENV' });
const { Redis } = require('@upstash/redis');
const r = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
r.flushall().then(() => { console.log('    Redis cleared'); process.exit(0); }).catch(e => { console.error('    Redis clear failed:', e.message); process.exit(0); });
" 2>/dev/null || echo "    (skip)"

echo ""
echo "==> Done! Re-seed questions:"
echo "    cd ../apps && pnpm tsx scripts/seed-questions.ts"
