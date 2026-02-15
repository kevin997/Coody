#!/bin/bash
# Install all required Piston runtimes for Coody assessment code execution
# Usage: ./scripts/install-piston-runtimes.sh [PISTON_URL]
# Default: https://piston.csl-brands.com

PISTON_URL="${1:-https://piston.csl-brands.com}"

echo "🔧 Installing Piston runtimes on: $PISTON_URL"
echo ""

# Define required packages
declare -a PACKAGES=(
  "python:3.12.0"
  "node:20.11.1"
  "java:15.0.2"
  "gcc:10.2.0"
  "typescript:5.0.3"
)

install_package() {
  local lang="$1"
  local version="$2"
  echo -n "  📦 Installing $lang $version... "
  
  response=$(curl -s --max-time 300 -X POST "$PISTON_URL/api/v2/packages" \
    -H 'Content-Type: application/json' \
    -d "{\"language\":\"$lang\",\"version\":\"$version\"}" 2>&1)
  
  if echo "$response" | grep -q "error\|does not exist"; then
    echo "❌ Failed: $response"
    return 1
  else
    echo "✅"
    return 0
  fi
}

# Check connectivity
echo "🔍 Checking Piston connectivity..."
runtimes=$(curl -s --max-time 10 "$PISTON_URL/api/v2/runtimes" 2>&1)
if [ $? -ne 0 ] || [ -z "$runtimes" ]; then
  echo "❌ Cannot reach Piston at $PISTON_URL"
  exit 1
fi
echo "✅ Piston is reachable"
echo ""

# Show currently installed runtimes
echo "📋 Currently installed runtimes:"
echo "$runtimes" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if not data:
        print('  (none)')
    for r in data:
        print(f\"  - {r['language']} {r['version']}\")
except:
    print('  (none)')
" 2>/dev/null || echo "  (could not parse)"
echo ""

# Install packages
echo "📥 Installing required packages..."
failed=0
for pkg in "${PACKAGES[@]}"; do
  IFS=':' read -r lang version <<< "$pkg"
  
  # Check if already installed
  if echo "$runtimes" | grep -q "\"$lang\"" 2>/dev/null || \
     echo "$runtimes" | python3 -c "
import sys, json
data = json.load(sys.stdin)
langs = [r['language'] for r in data]
aliases = [a for r in data for a in r.get('aliases', [])]
sys.exit(0 if '$lang' in langs or '$lang' in aliases else 1)
" 2>/dev/null; then
    echo "  ⏭️  $lang $version (already installed)"
  else
    install_package "$lang" "$version"
    if [ $? -ne 0 ]; then
      ((failed++))
    fi
  fi
done

echo ""

# Verify installations
echo "🔍 Verifying installed runtimes..."
final_runtimes=$(curl -s "$PISTON_URL/api/v2/runtimes")
echo "$final_runtimes" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f'  Total runtimes: {len(data)}')
for r in data:
    print(f\"  ✅ {r['language']} {r['version']}\")
" 2>/dev/null

echo ""

# Quick smoke test
echo "🧪 Running smoke tests..."

all_passed=true

PISTON_URL="$PISTON_URL" python3 << 'SMOKE_EOF'
import json, urllib.request, sys, os

PISTON_URL = os.environ.get("PISTON_URL", "http://localhost:2000")

tests = [
    ("python", "3.12.0", "main.py", 'print("ok")'),
    ("javascript", "20.11.1", "main.js", 'console.log("ok")'),
    ("typescript", "5.0.3", "main.ts", 'console.log("ok")'),
    ("java", "15.0.2", "Main.java", 'public class Main { public static void main(String[] args) { System.out.println("ok"); }}'),
    ("c", "10.2.0", "main.c", '#include <stdio.h>\nint main() { printf("ok\\n"); return 0; }'),
]

failed = 0
for lang, version, filename, code in tests:
    print(f"  🔬 {lang}... ", end="", flush=True)
    try:
        payload = json.dumps({
            "language": lang,
            "version": version,
            "files": [{"name": filename, "content": code}]
        }).encode()
        req = urllib.request.Request(
            f"{PISTON_URL}/api/v2/execute",
            data=payload,
            headers={"Content-Type": "application/json"}
        )
        resp = urllib.request.urlopen(req, timeout=30)
        data = json.loads(resp.read())
        stdout = data.get("run", {}).get("stdout", "").strip()
        if stdout == "ok":
            print("✅ passed")
        else:
            stderr = data.get("run", {}).get("stderr", "")
            print(f"❌ failed (got: {stdout!r}, stderr: {stderr!r})")
            failed += 1
    except Exception as e:
        print(f"❌ error: {e}")
        failed += 1

sys.exit(failed)
SMOKE_EOF
smoke_result=$?

echo ""
if [ $smoke_result -eq 0 ] && [ $failed -eq 0 ]; then
  echo "🎉 All runtimes installed and verified!"
  exit 0
else
  echo "⚠️  Some issues detected. Check output above."
  exit 1
fi
