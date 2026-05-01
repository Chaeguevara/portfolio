#!/bin/bash
# Post-stop hook: verify build after Claude finishes a response
# Runs npm run build and reports result

cd "$(dirname "$0")/../.." || exit 0

BUILD_OUTPUT=$(npm run build 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo '{"additionalContext": "✅ Build verification passed."}'
  exit 0
else
  # Extract error lines
  ERRORS=$(echo "$BUILD_OUTPUT" | grep -E "error TS|Error:" | head -5)
  jq -n --arg errors "$ERRORS" '{
    "additionalContext": ("❌ Build FAILED:\n" + $errors)
  }'
  exit 2
fi
