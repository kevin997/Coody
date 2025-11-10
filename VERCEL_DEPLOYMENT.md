# 🚀 Deploying Coody to Vercel

## ✅ Pre-Deployment Checklist

- [x] Code committed to GitHub
- [x] Database running and migrated
- [x] Environment variables documented
- [x] `vercel.json` configured
- [x] `.env` in `.gitignore`
- [x] Build succeeds locally

## 📋 Step-by-Step Deployment

### 1. Push to GitHub

```bash
cd /home/atlas/Projects/Olku/coody/coody-platform

# Check status
git status

# Add any remaining changes
git add .
git commit -m "Ready for Vercel deployment"

# Push to GitHub
git push origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose your GitHub repository: `kevin997/Coody`
5. Click **"Import"**

### 3. Configure Project Settings

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave as default)
- **Build Command**: `prisma generate && next build` (from vercel.json)
- **Install Command**: `npm install` (from vercel.json)
- **Output Directory**: `.next` (auto-detected)

### 4. Add Environment Variables

Click **"Environment Variables"** and add:

#### Required Variables:

```env
DATABASE_URL
postgresql://coody_user:CoodyLearning2024!@31.97.179.151:5434/coody_db?schema=public

NODE_ENV
production

NEXT_PUBLIC_APP_URL
https://your-app.vercel.app

NEXTAUTH_URL
https://your-app.vercel.app

NEXTAUTH_SECRET
[Generate with: openssl rand -base64 32]
```

#### Generate NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

Copy the output and paste it as the `NEXTAUTH_SECRET` value.

### 5. Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Vercel will provide a URL: `https://coody-xxx.vercel.app`

### 6. Update Environment Variables

After first deployment, update these with your actual Vercel URL:

- `NEXT_PUBLIC_APP_URL` → `https://your-actual-url.vercel.app`
- `NEXTAUTH_URL` → `https://your-actual-url.vercel.app`

Then **redeploy**:
- Go to Deployments tab
- Click the three dots on the latest deployment
- Click **"Redeploy"**

---

## 🔧 Vercel Configuration

### `vercel.json`

```json
{
  "framework": "nextjs",
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "env": {
    "VERCEL_FORCE_NO_BUILD_CACHE": "1"
  }
}
```

### Why These Settings?

- **`prisma generate`**: Generates Prisma Client before build
- **`VERCEL_FORCE_NO_BUILD_CACHE`**: Ensures fresh Prisma generation each time
- **No `prisma db push`**: We don't push schema changes in production
- **No `prisma migrate deploy`**: Our database is already migrated

---

## 🎯 Post-Deployment Testing

### 1. Test Home Page
```
Visit: https://your-app.vercel.app
Expected: Homepage loads with courses
```

### 2. Test Registration
```
Visit: https://your-app.vercel.app/inscription
Actions:
1. Enter name, email, password
2. Click "S'inscrire"
Expected: Redirected to /parcours after registration
```

### 3. Test Login
```
Visit: https://your-app.vercel.app/connexion
Actions:
1. Enter email, password
2. Click "Se connecter"
Expected: Redirected to /parcours
```

### 4. Test Course Access
```
Visit: https://your-app.vercel.app/cours/python-sql-finance
Expected: 
- Course content loads
- Navigation works (click sections)
- "Suivant" and "Précédent" buttons work
- Can mark sections complete
- Can save notes
```

### 5. Test Logout
```
Actions:
1. Click user avatar
2. Click "Déconnexion"
Expected: Redirected to homepage
```

---

## 🐛 Troubleshooting

### Build Fails with Prisma Error

**Error**: "Prisma Client not found"

**Solution**:
1. Check `prisma generate` is in build command
2. Verify `DATABASE_URL` is set in environment variables
3. Try redeploying with cache cleared

### Authentication Not Working

**Error**: "NEXTAUTH_SECRET not configured"

**Solution**:
1. Generate secret: `openssl rand -base64 32`
2. Add to Vercel environment variables
3. Redeploy

### Database Connection Fails

**Error**: "Can't reach database"

**Solution**:
1. Verify `DATABASE_URL` is correct
2. Check if database server (31.97.179.151:5434) is accessible from Vercel
3. Ensure firewall allows Vercel IP ranges

### Content Not Loading

**Error**: 404 on `/api/content/...`

**Solution**:
1. Verify `python-sql-finance/` folder is in repository
2. Check file paths in `courseLoader.ts`
3. Confirm files are not in `.gitignore`

---

## 🔒 Security Checklist

- [x] `.env` file is in `.gitignore`
- [x] Passwords are hashed with bcrypt
- [x] NEXTAUTH_SECRET is randomly generated
- [x] Database credentials secure
- [x] HTTPS enabled (automatic on Vercel)
- [x] Protected routes have middleware

---

## 📊 Monitoring

### Check Deployment Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **"Deployments"** tab
4. Click on a deployment
5. View **"Build Logs"** and **"Function Logs"**

### Monitor Database

```bash
# Connect to database
docker exec -it csl-postgres-coody psql -U coody_user -d coody_db

# Check users
SELECT id, email, name, role FROM users;

# Check progress
SELECT * FROM course_progress;

# Check notes
SELECT * FROM course_notes;
```

---

## 🎨 Custom Domain (Optional)

### Add Your Domain

1. Go to Project Settings
2. Click **"Domains"**
3. Add your domain: `coody.com` or `learn.coody.com`
4. Follow DNS configuration instructions
5. Update environment variables:
   ```
   NEXT_PUBLIC_APP_URL=https://coody.com
   NEXTAUTH_URL=https://coody.com
   ```
6. Redeploy

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys if successful
# 4. Updates production URL
```

### Branch Deployments

- `main` branch → Production (`coody.vercel.app`)
- Other branches → Preview URLs (`coody-branch.vercel.app`)

---

## ✅ Success Criteria

Your deployment is successful when:

- [x] Build completes without errors
- [x] Homepage loads correctly
- [x] Users can register and login
- [x] Course navigation works
- [x] Progress and notes save to database
- [x] All API routes respond correctly
- [x] No console errors in browser

---

## 📞 Need Help?

### Vercel Support
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

### Common Issues
- Check Vercel logs for specific errors
- Verify all environment variables are set
- Test database connection from Vercel
- Clear build cache and redeploy

---

## 🎉 You're Live!

Once deployed:
- Share your URL: `https://your-app.vercel.app`
- Monitor analytics in Vercel dashboard
- Scale automatically with traffic
- Enjoy zero-downtime deployments

**Congratulations on deploying your LeetCode-style learning platform! 🚀**
