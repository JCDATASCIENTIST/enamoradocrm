# Enamorado Insurance CRM Project Scope

## Overview
This document defines the proposed scope for the Enamorado Insurance CRM as one unified project organized into two workstreams rather than separate Phase 1 and Phase 2 builds. The goal is to create a centralized CRM that supports client and prospect management, sales pipeline tracking, reporting, automation, commissions, renewals, and enrollment workflows in a structured and scalable way.

## Business Goals
The CRM is intended to provide a single operational system for storing client and prospect records, managing follow-up and internal notes, supporting multiple users, tracking pipeline activity, and handling key insurance operations in one place. The project is also intended to replace fragmented workflows with a more efficient custom platform that can grow over time without depending entirely on multiple disconnected tools.

## Project Structure
This CRM should be delivered as **one unified project with two workstreams**, which keeps the full vision aligned while allowing related features to be grouped for planning, development, and testing.

### Workstream A – Core CRM and Pipeline
Workstream A covers the foundational CRM features required for daily operations. It includes:

- **Client and prospect management**
  Centralized records for clients and prospects with demographic, contact, plan, and Medicare/Medicaid information.

- **Notes, issues, and follow-up tracking**
  Structured notes and activity history for calls, emails, concerns, and follow-ups on each record.

- **Filtering, printing, and CSV export**
  Tools to filter by key fields such as age, plan, Medicaid level, stage, assigned user, and follow-up status, together with printable views and CSV exports for daily operations.

- **Sales pipeline management**
  A sales pipeline with clearly defined stages: **New, Requested, In Progress, and Done**, together with stage history so users can track how each lead or opportunity progresses over time.

### Workstream B – Commissions, Renewals, and Enrollment
Workstream B extends the CRM with money-related and enrollment functionality that insurance agencies often manage outside a basic CRM. It includes:

- **Commission tracking**
  Tracking commissions by policy, carrier, and writing agent, including commission status, payment date, and reporting.

- **Renewal tracking**
  Tracking policy effective dates and renewal dates, with reminders and operational views for upcoming or overdue renewals.

- **Online enrollment workflows**
  Recording and managing enrollment activity, including integration points or operational workflows tied to external enrollment tools or carrier systems.

## Functional Requirements
The CRM should include the following business functions:

- Central storage for client and prospect records.
- Multi-user administrative access with role-based permissions.
- Search and filtering by key business criteria.
- Internal notes, issue tracking, and follow-up history.
- Printing and operational reporting, including birthday reporting.
- Sales pipeline functionality with moveable stages.
- Commission tracking and reporting.
- Renewal tracking and reminder workflows.
- Enrollment status tracking and related workflow support.
- Selected automation workflows for reminders, outreach, and notifications.

## Recommended Technical Stack
The recommended stack for this project is:

| Layer | Recommendation | Reason |
|---|---|---|
| Frontend application | Vercel-hosted web app | Better fit for a modern SaaS-style CRM application. |
| Source control | GitHub | Supports version control, collaboration, and deployment workflows. |
| Backend database and auth | Supabase | Supports relational data, authentication, storage, and access control. |
| Automation | Zapier | Appropriate for selected workflows, integrations, and reminders, with task-based billing. |
| Domain and DNS | SiteGround if the domain is purchased there | Can manage the domain and DNS records, including subdomain routing. |

## Hosting and Deployment
The recommended architecture is to use SiteGround for domain registration or DNS management and host the CRM application on a subdomain such as `crm.enamoradoinsurancecompany.com`. The application code should be maintained in GitHub, deployed through Vercel, and connected to Supabase for database, authentication, and storage services.

## Security and Compliance
Because the CRM is expected to store Medicare or Medicaid identifiers, plan information, and other sensitive client data, the system should be designed with strong privacy and security controls from the start. Supabase documents note that HIPAA-regulated use requires a signed Business Associate Agreement, HIPAA project configuration, and additional security controls such as SSL enforcement, network restrictions, and related compliance measures.

The implementation should therefore include:
- Role-based access controls.
- Database-level row security.
- Controlled handling of documents and attachments.
- Careful review of what data flows through automations or third-party services.
- Audit-friendly tracking of key record and stage changes.

## Scope Boundaries
The project scope should be treated as the functionality described in this document, with additional requests handled through a formal change process rather than assumed inclusion. This is consistent with project-scope best practices that call for clear inclusions, exclusions, and deliverables to avoid scope creep and misalignment.

## Core Deliverables
The project should ultimately deliver:
- A secure CRM web application.
- Multi-user login and role management.
- Client and prospect database management.
- Sales pipeline with the stages New, Requested, In Progress, and Done.
- Notes, issues, and follow-up tracking.
- Filtering, print views, and CSV exports.
- Commission tracking and reporting.
- Renewal tracking and reminder workflows.
- Enrollment workflow support.
- Selected automation integrations.
- Production deployment on the business subdomain.

## Recommendation
The recommended approach is to move forward with this project as one unified CRM initiative with two coordinated workstreams, so the system is planned comprehensively while still being organized for execution. This gives both the business and the implementation team a clear structure for delivery while preserving flexibility in how features are prioritized, built, and activated.
