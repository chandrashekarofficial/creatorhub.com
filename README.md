# CreatorHub YouTube Analytics

YouTube-only public creator analytics dashboard with an original dark CreatorHub style.

## Run

Requirements: Java 17, Maven 3.9+, YouTube Data API v3 enabled.

In PowerShell:

```powershell
$env:YOUTUBE_API_KEY="YOUR_API_KEY"
mvn clean package
mvn spring-boot:run
```

Open http://localhost:8080

The API key is intentionally read from the environment and is NOT stored in the project.

## Public data

This project shows public channel/video information only: subscribers, lifetime views, video count, recent video views, likes and comments.

Private YouTube Studio analytics such as revenue, RPM, audience demographics and traffic sources require separate authorized access and are not exposed by this public endpoint.
