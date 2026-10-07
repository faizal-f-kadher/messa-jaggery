# Saves the hero's Unsplash photos into assets/img/stock and points index.html at the local copies.
# Run from the messa-site folder:   powershell -ExecutionPolicy Bypass -File tools\save-unsplash-photos.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$dir  = Join-Path $root "assets\img\stock"
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$photos = @{
  "photo-1663597675816-9b5d68952f42" = @{ file = "kerala-hills.jpg"; query = "auto=format&fit=crop&q=80&w=2000" }
}

$html = Get-Content (Join-Path $root "index.html") -Raw
foreach ($id in $photos.Keys) {
  $p = $photos[$id]
  $out = Join-Path $dir $p.file
  Invoke-WebRequest -Uri ("https://images.unsplash.com/" + $id + "?" + $p.query) -OutFile $out
  Write-Host "Saved $($p.file)"
  # Replace every Unsplash URL for this photo (src and srcset) with the local file
  $html = [regex]::Replace($html, "https://images\.unsplash\.com/" + $id + "\?[^`" ,]*( \d+w)?", "assets/img/stock/" + $p.file + '$1')
}
Set-Content -Path (Join-Path $root "index.html") -Value $html -NoNewline -Encoding UTF8
Write-Host "index.html now uses the local copies."
