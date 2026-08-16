CREATE DATABASE IF NOT EXISTS creatorhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE creatorhub;

CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT uk_categories_user_name UNIQUE (user_id, category_name)
);

CREATE TABLE content_ideas (
    idea_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    hook TEXT,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL,
    planned_date DATE,
    CONSTRAINT fk_content_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_content_user_status (user_id, status),
    INDEX idx_content_user_planned (user_id, planned_date)
);

CREATE TABLE videos (
    video_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    views BIGINT NOT NULL DEFAULT 0,
    likes BIGINT NOT NULL DEFAULT 0,
    comments BIGINT NOT NULL DEFAULT 0,
    shares BIGINT NOT NULL DEFAULT 0,
    watch_time DOUBLE NOT NULL DEFAULT 0,
    ctr DOUBLE NOT NULL DEFAULT 0,
    CONSTRAINT fk_videos_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT chk_videos_views CHECK (views >= 0),
    CONSTRAINT chk_videos_likes CHECK (likes >= 0),
    CONSTRAINT chk_videos_comments CHECK (comments >= 0),
    CONSTRAINT chk_videos_shares CHECK (shares >= 0),
    CONSTRAINT chk_videos_watch_time CHECK (watch_time >= 0),
    CONSTRAINT chk_videos_ctr CHECK (ctr >= 0)
);

CREATE TABLE analytics (
    analytics_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    video_id BIGINT NOT NULL UNIQUE,
    engagement_rate DOUBLE NOT NULL DEFAULT 0,
    like_rate DOUBLE NOT NULL DEFAULT 0,
    comment_rate DOUBLE NOT NULL DEFAULT 0,
    score DOUBLE NOT NULL DEFAULT 0,
    CONSTRAINT fk_analytics_video FOREIGN KEY (video_id) REFERENCES videos(video_id) ON DELETE CASCADE
);

CREATE TABLE calendar_events (
    event_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    content_id BIGINT,
    event_date DATETIME NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    CONSTRAINT fk_calendar_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_calendar_content FOREIGN KEY (content_id) REFERENCES content_ideas(idea_id) ON DELETE SET NULL,
    INDEX idx_calendar_user_date (user_id, event_date)
);

CREATE TABLE seo_data (
    seo_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    content_id BIGINT NOT NULL,
    keywords TEXT,
    hashtags TEXT,
    description TEXT,
    CONSTRAINT fk_seo_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_seo_content FOREIGN KEY (content_id) REFERENCES content_ideas(idea_id) ON DELETE CASCADE,
    CONSTRAINT uk_seo_content UNIQUE (content_id)
);

CREATE TABLE reports (
    report_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    report_month DATE NOT NULL,
    total_views BIGINT NOT NULL DEFAULT 0,
    average_engagement DOUBLE NOT NULL DEFAULT 0,
    CONSTRAINT fk_reports_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_reports_user_month (user_id, report_month)
);
