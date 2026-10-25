$ErrorActionPreference = 'Stop'
$studioNodeCommand = Get-Command node -ErrorAction SilentlyContinue
$studioNodePath = if ($studioNodeCommand) { $studioNodeCommand.Source } else { Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' }
if (-not (Test-Path -LiteralPath $studioNodePath)) { throw 'Node.js 실행 파일을 찾지 못했습니다. Node.js 22 이상을 설치한 뒤 다시 실행하세요.' }
& $studioNodePath (Join-Path $PSScriptRoot 'server.mjs')
