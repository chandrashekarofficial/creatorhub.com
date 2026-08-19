# CreatorHub

> A full-stack content management and analytics platform for creators to organize content ideas, manage videos, optimize SEO, and monitor performance.

## Overview

CreatorHub is a web-based content management and analytics system built with **Java, Spring Boot, MySQL, HTML, CSS, and JavaScript**.

The application brings common creator workflows into one dashboard, including content planning, video management, SEO organization, analytics, and performance reporting.

The project was developed as a practical full-stack application to demonstrate backend API development, database management, authentication, frontend integration, and CRUD operations.

## Features

* 🔐 User authentication and authorization
* 💡 Content idea management
* 🎬 Video management
* 📊 Video analytics and performance tracking
* 📅 Content planning and scheduling
* 🔎 SEO data management
* 📈 Dashboard statistics and visualizations
* 📝 Performance reports
* 👤 User-specific data access
* 🛡️ Secure API endpoints with Spring Security
* 🗄️ MySQL database persistence

## Screenshots

### Dashboard

![CreatorHub Dashboard](screenshots/dashboard.png)

### Content Ideas

![CreatorHub Content Ideas](screenshots/content-ideas.png)

### Video Management

![CreatorHub Video Management](screenshots/videos.png)

### SEO Assistant

![CreatorHub SEO Assistant](screenshots/seo-assistant.png)

> Screenshots are stored in the `screenshots/` directory.

## Tech Stack

### Backend

* Java 17
* Spring Boot 3.5.x
* Spring Security
* Spring Data JPA
* Hibernate
* REST APIs
* Maven

### Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap
* Chart.js

### Database

* MySQL 8

### Development Tools

* Git
* GitHub
* Visual Studio Code
* IntelliJ IDEA / Eclipse compatible Spring Boot project

## System Architecture

```text
┌─────────────────────────────┐
│        Frontend UI          │
│     HTML / CSS / JS         │
└──────────────┬──────────────┘
               │ REST API
               ▼
┌─────────────────────────────┐
│      Spring Boot API        │
│ Controllers → Services      │
│        → Repositories       │
└──────────────┬──────────────┘
               │ JPA / Hibernate
               ▼
┌─────────────────────────────┐
│        MySQL Database       │
└─────────────────────────────┘
```

## Main Modules

### Authentication

Handles user authentication and authorization using Spring Security and JWT-based authentication.

### Content Management

Allows users to create, edit, delete, and manage content ideas.

### Video Management

Provides CRUD operations for videos and keeps video data associated with the authenticated user.

### Analytics

Stores and retrieves video performance information and presents useful statistics through the dashboard.

### Calendar

Allows creators to organize planned content and publishing activities.

### SEO Assistant

Manages SEO-related information such as keywords, hashtags, and optimized descriptions for content.

### Reports

Provides performance-oriented information that can be used to evaluate content results.

## Database

CreatorHub uses MySQL for persistent storage.

Main entities include:

* Users
* Content Ideas
* Videos
* Analytics
* Calendar Events
* SEO Data
* Reports
* Categories

The database schema is available in:

```text
schema.sql
```

## Project Structure

```text
creatorhub/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/creatorhub/
│       │       ├── config/
│       │       ├── controller/
│       │       ├── dto/
│       │       ├── entity/
│       │       ├── repository/
│       │       ├── security/
│       │       └── service/
│       │
│       └── resources/
│           ├── static/
│           │   ├── css/
│           │   ├── js/
│           │   ├── index.html
│           │   └── favicon.svg
│           └── application.properties
│
├── schema.sql
├── pom.xml
├── README.md
└── .gitignore
```

## Requirements

Before running the project, install:

* Java 17 or later
* Maven 3.9+
* MySQL 8
* Git

## Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd creatorhub
```

### 2. Create the database

Open MySQL and create the database:

```sql
CREATE DATABASE creatorhub;
```

Then load the provided schema:

```sql
SOURCE schema.sql;
```

### 3. Configure the database

Open:

```text
src/main/resources/application.properties
```

Configure your local MySQL username and password.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/creatorhub?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Do not commit real passwords, API keys, or JWT secrets to GitHub.

### 4. Build the application

```bash
mvn clean package
```

### 5. Run the application

Using Maven:

```bash
mvn spring-boot:run
```

Or using the packaged JAR:

```bash
java -jar target/creatorhub-0.0.1-SNAPSHOT.jar
```

### 6. Open the application

Visit:

```text
http://localhost:8080
```

## API

The application exposes REST APIs for the major modules.

Examples:

```text
/api/auth
/api/content
/api/videos
/api/seo
/api/calendar
/api/reports
```

Authentication is required for protected endpoints.

## Testing

The project can be built with:

```bash
mvn clean package
```

The Maven build verifies that the application compiles successfully and packages the Spring Boot application into an executable JAR.

## Future Enhancements

* YouTube API integration
* Automated analytics synchronization
* Advanced content performance charts
* AI-assisted content recommendations
* Automated SEO suggestions
* Social media platform integrations
* Scheduled publishing
* Email notifications
* Expanded reporting and export options

## Learning Outcomes

This project provided practical experience with:

* Java backend development
* Spring Boot application architecture
* REST API development
* Spring Security
* JWT authentication
* JPA/Hibernate
* MySQL database design
* CRUD operations
* Frontend-backend integration
* Git and GitHub
* Application deployment and debugging

## Author

**Chandrashekar**

BCA Student | Full-Stack Development Enthusiast

---

⭐ If you find this project useful, consider giving the repository a star.
