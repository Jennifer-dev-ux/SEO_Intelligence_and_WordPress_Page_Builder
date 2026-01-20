# SEO Intelligence & AI-Assisted WordPress Content Platform

## Project Overview
This project is an SEO intelligence and content generation platform developed during HackCamp in collaboration with an industry client (TilePlan UK). The goal of the project was to design and implement a system that collects competitor SEO data, generates actionable insights, and produces SEO-optimised content that can be published to WordPress.

The platform demonstrates how automation, data analysis, AI-driven insights, and content generation can be combined into a scalable SEO workflow suitable for real business use.

---

## Problem Statement
SEO teams often rely on fragmented tools for competitor analysis, keyword tracking, insight generation, and content creation. This leads to manual work, inconsistent data, and slow content delivery.

This project addresses that problem by providing:
- Centralised storage of competitor SEO metrics
- Automated data ingestion via workflows
- AI-assisted analysis of SEO performance
- Structured generation of WordPress-ready SEO content

---

## Key Features
- Automated ingestion of competitor SEO metrics
- Time-based tracking of keyword and SERP performance
- AI-generated insights including strengths, weaknesses, keyword gaps, and content opportunities
- SERP keyword ranking comparison against competitors
- SEO page generation with structured outputs (slug, title, meta description, H1, outlines, internal links)
- RESTful APIs supporting frontend dashboards and automation tools
- Optional publishing of generated content to WordPress via REST API

---

## System Architecture
The platform is built using a modular, service-based architecture:

1. Automation workflows collect SEO and SERP data from external providers  
2. Backend APIs validate, de-duplicate, and store data in a relational database  
3. AI processes generate structured insights and SEO content recommendations  
4. Generated SEO pages are stored in a WordPress-ready schema  
5. APIs expose data for frontend visualisation and optional publishing to WordPress  

This architecture allows each part of the system (automation, AI, backend, frontend, publishing) to operate independently while remaining fully integrated.

---

## Tech Stack
- **Backend:** PHP (REST APIs)
- **Database:** MySQL
- **Automation:** n8n
- **AI Processing:** Structured AI-generated insights and content outputs
- **Frontend / CMS Integration:** WordPress REST API
- **Hosting:** Linux server environment (Poseidon)
- **Development Methodology:** Agile Scrum with time-boxed sprints

---

## API Overview
The backend exposes multiple REST endpoints to support the full workflow, including:
- Competitor data ingestion and retrieval
- SEO metrics tracking and filtering
- AI insight storage and querying
- SEO page generation and retrieval
- WordPress publishing integration

All APIs use JSON request and response bodies and are designed for easy integration with automation tools and frontend applications.

---

## Team Collaboration
The project was developed using Agile Scrum practices across multiple short sprints. Responsibilities were split across backend, frontend, automation, and AI roles, with regular integration and testing to ensure a cohesive final system.

---

## Project Status
The system is fully implemented and integration-ready.  
All core features have been developed and tested, and the platform can be connected to live external services (such as WordPress) with appropriate credentials.

This repository represents a complete end-to-end SEO intelligence and content generation solution.
