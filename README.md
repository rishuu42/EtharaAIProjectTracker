# Ethara | Project & Task Management System

Ethara is a premium project management application built with Next.js, Prisma, and PostgreSQL (compatible). It features role-based access control, real-time dashboard stats, and a modern glassmorphism design.

## 🚀 Key Features
- **Authentication**: Secure Login/Signup with JWT.
- **Project Management**: Create projects and assign team members.
- **Task Tracking**: Assign tasks, set due dates, and track status (Todo, In Progress, Done).
- **Premium Dashboard**: Visual summary of project and task progress.
- **RBAC**: Admin and Member roles for access control.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14 (App Router), Vanilla CSS (Premium Design System).
- **Backend**: Next.js API Routes.
- **Database**: Prisma ORM with PostgreSQL.
- **Auth**: JWT + Bcryptjs.

## 🚀 Deployment
This project is deployed using a hybrid cloud architecture:
- **Web Application**: Hosted on **Vercel** for high-performance frontend delivery.
- **Database**: Hosted on **Railway** using a managed PostgreSQL instance.

*Note: The project was originally intended for full deployment on Railway, but was moved to Vercel for web hosting to leverage the free tier while maintaining the database on Railway's robust infrastructure.*


## 🛠️ Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key"
   ```

3. **Initialize Database**:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

4. **Run Dev Server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment (Railway)

1. Connect your GitHub repo to [Railway](https://railway.app/).
2. Add a **PostgreSQL** service in Railway.
3. Set `DATABASE_URL` in Railway variables to your Postgres connection string.
4. Update `prisma/schema.prisma` provider to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
5. Railway will automatically build and deploy.

## 📝 Demo Access
- **Admin**: `admin@ethara.ai` / `admin123`
