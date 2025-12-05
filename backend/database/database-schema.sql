-- Database Schema for SEO Backend (Sprint 1)
-- For testing purposes, you don't have to run this...
-- Ensure the correct database is selected
CREATE DATABASE IF NOT EXISTS seo_intelligence;
USE seo_intelligence;

-- Drop existing tables to allow clean rebuild
DROP TABLE IF EXISTS seo_metrics;
DROP TABLE IF EXISTS competitors;

-- Competitor Table
CREATE TABLE competitors (
                             id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                             name VARCHAR(255) NOT NULL,
                             domain VARCHAR(255) NOT NULL UNIQUE,
                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEO Metrics Table
CREATE TABLE seo_metrics (
                             id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                             competitor_id INT UNSIGNED NOT NULL,
                             metric_date DATE NOT NULL,

                             num_pages_with_target_keyword INT,
                             avg_title_length DOUBLE,
                             percent_pages_with_h1_keyword DOUBLE,
                             total_backlinks INT,
                             referring_domains INT,
                             avg_position_for_main_keywords DOUBLE,
                             total_clicks INT,
                             total_impressions INT,

                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                             FOREIGN KEY (competitor_id)
                                 REFERENCES competitors(id)
                                 ON DELETE CASCADE
);

-- Optional initial check
SELECT * FROM competitors;
SELECT * FROM seo_metrics;
