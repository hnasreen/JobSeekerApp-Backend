### Job Seeker Application:

This is a full-stack Job Seeking Application where employers can post job vacancies, manage job posts, and review applications. Job seekers can explore available job listings, view detailed job descriptions, and apply directly by uploading their resume.

The app ensures role-based access, allowing only employers to post, edit, delete, or expire jobs, while job seekers can apply for jobs, view their applications, and delete them if necessary.

## Features

# For Employers:

**Post Job Vacancies:** Employers can create and manage job postings.
**Access Applications:** Employers can view applications submitted by job seekers.
**Edit & Delete Jobs**: Employers can edit job details or delete job postings.
**Expire Job Posts:** Expire job listings after a certain time or when filled.

# For Job Seekers:

**View Job Listings:** Job seekers can browse all available jobs posted by employers.
**Apply for Jobs:** Upload a resume (stored on Cloudinary) and apply to jobs.
**Manage Applications:** Job seekers can view and delete their job applications.

# Technology Stack

**Frontend:** React.js
**Backend:** Node.js, Express.js
**Database:** MongoDB
**File Storage:** Cloudinary (for resumes)
**Authentication:** JWT (JSON Web Tokens) stored in localStorage for user authentication and authorization.

# Authentication & Authorization

The application uses JWT for authentication. The token is stored in the browser's localStorage and is used to authenticate API requests. The app has a middleware that authenticates the user and authorizes access based on their role (Employer or Job Seeker).

## Frontend Github Source Code Link:

https://github.com/hnasreen/JobSeekingApp-Frontend