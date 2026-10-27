# Starts a local MongoDB server for ScamShield (no admin rights required).
# Uses, in order: MONGOD_PATH env var, `mongod` on PATH, or the copy installed
# under %USERPROFILE%\.scamshield by scripts/setup-mongo.ps1.

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$port = 27017

$existing = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host "MongoDB is already listening on port $port. Nothing to do."
  exit 0
}

$mongod = $env:MONGOD_PATH
if (-not $mongod) {
  $command = Get-Command mongod -ErrorAction SilentlyContinue
  if ($command) { $mongod = $command.Source }
}
if (-not $mongod) {
  $candidate = Get-ChildItem -Path (Join-Path $env:USERPROFILE '.scamshield\mongodb') -Recurse -Filter mongod.exe -ErrorAction SilentlyContinue |
    Select-Object -First 1
  if ($candidate) { $mongod = $candidate.FullName }
}

if (-not $mongod -or -not (Test-Path $mongod)) {
  Write-Host "mongod was not found." -ForegroundColor Yellow
  Write-Host "Run 'npm run db:setup' once to download a user-local MongoDB build," -ForegroundColor Yellow
  Write-Host "or install MongoDB Community Server and add it to your PATH." -ForegroundColor Yellow
  exit 1
}

$dbPath = Join-Path $root '.data\db'
$logPath = Join-Path $root '.data\mongod.log'
New-Item -ItemType Directory -Force -Path $dbPath | Out-Null

Write-Host "Starting MongoDB..."
Write-Host "  binary : $mongod"
Write-Host "  dbPath : $dbPath"
Write-Host "  log    : $logPath"

$process = Start-Process -FilePath $mongod `
  -ArgumentList @('--dbpath', "`"$dbPath`"", '--bind_ip', '127.0.0.1', '--port', "$port", '--logpath', "`"$logPath`"", '--logappend') `
  -WindowStyle Hidden -PassThru

for ($i = 0; $i -lt 40; $i++) {
  Start-Sleep -Milliseconds 500
  $listening = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  if ($listening) {
    Write-Host "MongoDB is ready on mongodb://127.0.0.1:$port" -ForegroundColor Green
    Write-Host "Connect MongoDB Compass to: mongodb://127.0.0.1:27017" -ForegroundColor Green
    Write-Host "Database name: scamshield"
    exit 0
  }
  if ($process.HasExited) { break }
}

Write-Host "MongoDB did not start. Check the log at $logPath" -ForegroundColor Red
exit 1
