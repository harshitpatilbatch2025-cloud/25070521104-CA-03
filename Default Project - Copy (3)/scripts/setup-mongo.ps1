# Installs a user-local MongoDB Community Server build (no admin rights needed).
# Downloads the official Windows archive (~620 MB) into %USERPROFILE%\.scamshield.

$ErrorActionPreference = 'Stop'
$version = '7.0.14'
$base = Join-Path $env:USERPROFILE '.scamshield'
$zip = Join-Path $base 'mongodb.zip'
$target = Join-Path $base 'mongodb'

$existing = Get-ChildItem -Path $target -Recurse -Filter mongod.exe -ErrorAction SilentlyContinue |
  Select-Object -First 1
if ($existing) {
  Write-Host "MongoDB is already installed at $($existing.FullName)" -ForegroundColor Green
  exit 0
}

New-Item -ItemType Directory -Force -Path $base | Out-Null
$url = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-$version.zip"

if (-not (Test-Path $zip)) {
  Write-Host "Downloading MongoDB $version (this can take a few minutes)…"
  curl.exe -L --fail --show-error -o $zip $url
  if ($LASTEXITCODE -ne 0) { throw 'Download failed.' }
}

Write-Host 'Extracting…'
New-Item -ItemType Directory -Force -Path $target | Out-Null
tar.exe -xf $zip -C $target
if ($LASTEXITCODE -ne 0) { throw 'Extraction failed.' }

Remove-Item $zip -Force -ErrorAction SilentlyContinue
$mongod = Get-ChildItem -Path $target -Recurse -Filter mongod.exe | Select-Object -First 1
Write-Host "MongoDB installed: $($mongod.FullName)" -ForegroundColor Green
Write-Host "Next: npm run db:start"
