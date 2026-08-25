$ErrorActionPreference="Stop"
if(-not $env:YOUTUBE_API_KEY){Write-Host 'Set the key first: $env:YOUTUBE_API_KEY="YOUR_KEY"' -ForegroundColor Yellow;exit 1}
mvn clean package
if($LASTEXITCODE -eq 0){mvn spring-boot:run}
