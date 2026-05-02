# Railway Deployment Guide - Project HQ

Complete step-by-step guide to deploy Project HQ (Backend + Frontend + MySQL) to Railway for free.

## Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Railway Account** - Sign up at https://railway.app (free tier available)
3. **Git installed** - For version control

## Step 1: Prepare Your GitHub Repository

### 1.1 Initialize Git (if not done)
```bash
cd c:\Users\manji\Desktop\project_hq
git init
git add .
git commit -m "Initial commit: Project HQ full-stack app"
```

### 1.2 Push to GitHub
```bash
# Create a new repository on GitHub (without README)
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/project-hq.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up Railway Project

### 2.1 Create Railway Project
1. Go to https://railway.app
2. Click **"Create a New Project"** or **"New Project"**
3. Select **"Deploy from GitHub"**
4. Authorize Railway to access your GitHub account
5. Select the `project-hq` repository

---

## Step 3: Deploy Backend Service

### 3.1 Create Backend Service
1. In your Railway project, click **"New Service"** → **"GitHub Repo"**
2. Select your `project-hq` repository again
3. Click **"Deploy"**

### 3.2 Configure Backend Root Directory
1. In the Railway dashboard, go to your **Backend service**
2. Click on the service name to open settings
3. Go to **Settings** → **Service**
4. Set **Root Directory** to `backend`
5. Save changes

### 3.3 Add MySQL Database
1. In your Railway project, click **"New Service"** → **"Database"** → **"MySQL"**
2. Railway will create and provision MySQL automatically
3. The MySQL service will generate connection credentials

### 3.4 Link MySQL to Backend
1. Open the **Backend service** settings
2. Click **"Variables"** tab
3. Look for **"Raw Editor"** or add variables manually

Set these environment variables in the Backend service:

```
SPRING_DATASOURCE_URL=<MySQL_JDBC_URL>
SPRING_DATASOURCE_USERNAME=<MySQL_USERNAME>
SPRING_DATASOURCE_PASSWORD=<MySQL_PASSWORD>
SPRING_JPA_HIBERNATE_DDL_AUTO=update
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long-here
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGIN=<your-frontend-url>
PORT=8080
```

### 3.5 Find MySQL Credentials
1. Click on the **MySQL service** in Railway
2. Go to **Connect** tab
3. Copy the **MYSQL_URL** or individual credentials:
   - **MYSQL_HOST**
   - **MYSQL_PORT**
   - **MYSQL_USER**
   - **MYSQL_PASSWORD**
   - **MYSQL_DATABASE**

### 3.6 Build JDBC URL
Use this format:
```
jdbc:mysql://<host>:<port>/<database>?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
```

**Example:**
```
jdbc:mysql://railway.app:3306/project_manager?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
```

### 3.7 Set JWT_SECRET
Generate a strong secret key (minimum 32 characters):
```
your-random-32-or-more-character-secret-key-here
```

### 3.8 Deploy Backend
1. Click **"Deploy"** button
2. Watch the build logs in the **Deployments** tab
3. Once deployed, copy the **Backend URL** (e.g., `https://project-hq-backend-prod.railway.app`)

---

## Step 4: Deploy Frontend Service

### 4.1 Create Frontend Service
1. In your Railway project, click **"New Service"** → **"GitHub Repo"**
2. Select `project-hq` repository
3. Click **"Deploy"**

### 4.2 Configure Frontend Root Directory
1. Go to the **Frontend service** settings
2. Click **Settings** → **Service**
3. Set **Root Directory** to `frontend`
4. Save changes

### 4.3 Set Frontend Environment Variables
1. Click **Frontend service** → **Variables**
2. Add this environment variable:

```
VITE_API_BASE_URL=https://<your-backend-url>/api
```

**Example:**
```
VITE_API_BASE_URL=https://project-hq-backend-prod.railway.app/api
```

### 4.4 Update Backend CORS
1. Go back to **Backend service** → **Variables**
2. Update `CORS_ALLOWED_ORIGIN`:

```
CORS_ALLOWED_ORIGIN=https://<your-frontend-url>
```

**Example:**
```
CORS_ALLOWED_ORIGIN=https://project-hq-frontend-prod.railway.app
```

### 4.5 Deploy Frontend
1. Click **"Deploy"** button
2. Wait for build and deployment to complete
3. Copy the **Frontend URL** (e.g., `https://project-hq-frontend-prod.railway.app`)

---

## Step 5: Verify Deployment

### 5.1 Test Backend
```
GET https://<your-backend-url>/actuator/health
```
Should return a JSON response with `"status":"UP"`

### 5.2 Test Frontend
Open in browser:
```
https://<your-frontend-url>
```
Should load the login page

### 5.3 Test Full Flow
1. Open frontend URL
2. Go to **Signup** page
3. Create a test account
4. Login
5. Create a project and tasks

---

## Step 6: Final Configuration

### 6.1 Update Backend CORS (After Frontend URL Known)
1. Backend service → **Variables**
2. Set `CORS_ALLOWED_ORIGIN` to your **Frontend URL**
3. Redeploy backend

### 6.2 Ensure MySQL Auto-creates Database
Backend will auto-create tables via Hibernate with `ddl-auto=update`

---

## Troubleshooting

### Backend Won't Start
- Check logs: Backend service → **Deployments** → View logs
- Common issues:
  - MySQL connection string incorrect
  - JWT_SECRET missing or too short
  - Database not accessible

### Frontend 404 Error
- Check `VITE_API_BASE_URL` is set correctly
- Rebuild frontend: Go to **Frontend** → **Deployments** → **Redeploy**

### CORS Error in Browser
- Update Backend `CORS_ALLOWED_ORIGIN` to exact Frontend URL
- Redeploy backend after updating

### Port Issues
- Railway assigns ports automatically; don't hardcode ports
- Backend uses `${PORT:8080}` by default (Railway overrides this)

---

## Railway Free Tier Limits

- **2 Deployments** (Backend + Frontend)
- **1 MySQL Database** (5GB)
- **Limited compute hours** (~500 hours/month)
- **Shared resources** (may be slower than paid tier)

To maximize free tier:
1. Turn off services when not in use
2. Use sleep functionality if available
3. Monitor resource usage in Railway dashboard

---

## Environment Variables Reference

### Backend (`backend` service)

| Variable | Example | Notes |
|----------|---------|-------|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://...` | MySQL JDBC connection string |
| `SPRING_DATASOURCE_USERNAME` | `root` | MySQL username |
| `SPRING_DATASOURCE_PASSWORD` | `password123` | MySQL password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` | Auto-create/update tables |
| `JWT_SECRET` | Min 32 chars | Secret key for JWT tokens |
| `JWT_EXPIRATION_MS` | `86400000` | 24 hours in milliseconds |
| `CORS_ALLOWED_ORIGIN` | Frontend URL | Allow frontend to call API |
| `PORT` | `8080` | Server port (Railway assigns automatically) |

### Frontend (`frontend` service)

| Variable | Example | Notes |
|----------|---------|-------|
| `VITE_API_BASE_URL` | `https://backend-url/api` | Backend API endpoint |

---

## Quick Checklist

- [ ] GitHub repository created and pushed
- [ ] Railway project created
- [ ] Backend service deployed with root directory set
- [ ] MySQL database created and linked
- [ ] Backend environment variables set
- [ ] Frontend service deployed with root directory set
- [ ] Frontend environment variable set (`VITE_API_BASE_URL`)
- [ ] Backend CORS updated with Frontend URL
- [ ] Both services successfully deployed
- [ ] Frontend loads without errors
- [ ] Signup/Login flow works
- [ ] Create project and tasks works

---

## Support

If you encounter issues:
1. Check Railway documentation: https://docs.railway.app
2. Review service logs in Railway dashboard
3. Verify all environment variables are set correctly
4. Ensure MySQL is running and accessible
