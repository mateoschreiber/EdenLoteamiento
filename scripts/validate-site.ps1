$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$publicRoot = Join-Path $projectRoot "public"
$indexPath = Join-Path $publicRoot "index.html"
$workerPath = Join-Path $projectRoot "src/index.js"
$requiredFiles = @(
    "index.html",
    "404.html",
    "robots.txt",
    "sitemap.xml",
    "site.webmanifest",
    "assets/css/styles.20260722b.css",
    "assets/img/og-eden-loteamiento.jpg"
)
$errors = [System.Collections.Generic.List[string]]::new()

foreach ($relativePath in $requiredFiles) {
    if (-not (Test-Path -LiteralPath (Join-Path $publicRoot $relativePath))) {
        $errors.Add("Falta archivo público: $relativePath")
    }
}

if (Test-Path -LiteralPath $indexPath) {
    $html = Get-Content -Raw -LiteralPath $indexPath
    $checks = @(
        @{ Name = "canonical correcto"; Valid = $html -match '<link rel="canonical" href="https://edenloteamientos\.com/">' },
        @{ Name = "un solo H1"; Valid = ([regex]::Matches($html, '<h1(?:\s|>)', 'IgnoreCase').Count -eq 1) },
        @{ Name = "keyword en H1"; Valid = $html -match '<h1>Terrenos en María Auxiliadora' },
        @{ Name = "sin example.com"; Valid = $html -notmatch 'example\.com' },
        @{ Name = "unidad m²"; Valid = $html -match '560 m²' },
        @{ Name = "servicios"; Valid = $html -match 'acceso a agua' -and $html -match 'energía eléctrica' -and $html -match 'caminos' },
        @{ Name = "sin correo"; Valid = $html -notmatch 'mailto:|alemateo07@gmail\.com|"email"' },
        @{ Name = "sin fotos pendientes"; Valid = $html -notmatch 'Solicitá fotos|fotos actuales' },
        @{ Name = "OG local"; Valid = $html -match 'https://edenloteamientos\.com/assets/img/og-eden-loteamiento\.jpg' },
        @{ Name = "CSS existente"; Valid = $html -match '/assets/css/styles\.20260722b\.css' },
        @{ Name = "JS integrado"; Valid = $html -match '<script id="site-script">' -and $html -notmatch '<script[^>]+src=' }
    )

    foreach ($check in $checks) {
        if (-not $check.Valid) { $errors.Add("Falla: $($check.Name)") }
    }

    $jsonLdMatches = [regex]::Matches($html, '<script type="application/ld\+json">\s*(.*?)\s*</script>', 'Singleline')
    if ($jsonLdMatches.Count -eq 0) {
        $errors.Add("Faltan datos estructurados JSON-LD")
    } else {
        foreach ($match in $jsonLdMatches) {
            try { $match.Groups[1].Value | ConvertFrom-Json | Out-Null }
            catch { $errors.Add("Bloque JSON-LD inválido") }
        }
    }

    $localReferences = [regex]::Matches($html, '(?:href|src)="(/[^"#?]+)')
    foreach ($reference in $localReferences) {
        $relativePath = $reference.Groups[1].Value.TrimStart('/')
        if ($relativePath -and -not (Test-Path -LiteralPath (Join-Path $publicRoot $relativePath))) {
            $errors.Add("Referencia local inexistente: /$relativePath")
        }
    }
}

$notFoundPath = Join-Path $publicRoot "404.html"
if (Test-Path -LiteralPath $notFoundPath) {
    $notFoundHtml = Get-Content -Raw -LiteralPath $notFoundPath
    if ($notFoundHtml -notmatch '<meta name="robots" content="noindex,follow">') { $errors.Add("404.html debe declarar noindex,follow") }
    if ($notFoundHtml -notmatch '/assets/css/styles\.20260722b\.css') { $errors.Add("404.html usa CSS obsoleto") }
}

if (Test-Path -LiteralPath $workerPath) {
    $worker = Get-Content -Raw -LiteralPath $workerPath
    if ($worker -notmatch 'max-age=0, must-revalidate, no-transform') { $errors.Add("HTML sin protección no-transform contra inyección automática") }
    if ($worker -match "unsafe-inline") { $errors.Add("CSP permite unsafe-inline") }
    if ($worker -match 'static\.cloudflareinsights\.com') { $errors.Add("CSP conserva dependencia del beacon automático") }
    if (Test-Path -LiteralPath $indexPath) {
        $inlineScript = [regex]::Match($html, '<script id="site-script">(.*?)</script>', 'Singleline').Groups[1].Value
        $sha256 = [Security.Cryptography.SHA256]::Create()
        try { $scriptHash = [Convert]::ToBase64String($sha256.ComputeHash([Text.Encoding]::UTF8.GetBytes($inlineScript))) }
        finally { $sha256.Dispose() }
        if ($worker -notmatch [regex]::Escape("'sha256-$scriptHash'")) { $errors.Add("Hash CSP del script integrado desactualizado") }
    }
}

foreach ($relativePath in @("README.md", "wrangler.jsonc", ".env", "db.sqlite3")) {
    if (Test-Path -LiteralPath (Join-Path $publicRoot $relativePath)) { $errors.Add("Archivo interno dentro de public/: $relativePath") }
}

try { [xml](Get-Content -Raw -LiteralPath (Join-Path $publicRoot "sitemap.xml")) | Out-Null }
catch { $errors.Add("sitemap.xml inválido") }
try { Get-Content -Raw -LiteralPath (Join-Path $publicRoot "site.webmanifest") | ConvertFrom-Json | Out-Null }
catch { $errors.Add("site.webmanifest inválido") }

if ($errors.Count -gt 0) {
    $errors | ForEach-Object { Write-Error $_ }
    exit 1
}

Write-Output "Validación completada: $($requiredFiles.Count) archivos, referencias, SEO, servicios y CSP correctos."
