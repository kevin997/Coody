# Coody Database Setup

## 🗄️ Database Configuration

### Database Details
- **Host**: 31.97.179.151
- **Port**: 5434
- **Database**: coody_db
- **User**: coody_user
- **Password**: CoodyLearning2024!

### Connection String
```
DATABASE_URL="postgresql://coody_user:CoodyLearning2024!@31.97.179.151:5434/coody_db?schema=public"
```

## 📊 Database Schema

### Tables Created

#### 1. **users** - User Authentication
Stores user registration and login information.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| email | String | Unique email address |
| name | String | User's full name |
| password | String | Hashed password |
| role | String | "learner" or "instructor" |
| avatar | String? | Optional profile picture URL |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

#### 2. **course_progress** - Course Tracking
Tracks user progress through courses.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| userId | String | Foreign key to users |
| courseId | String | Course identifier |
| completedSections | String[] | Array of completed section IDs |
| lastAccessedSection | String? | Last viewed section |
| lastAccessedAt | DateTime | Last access timestamp |
| startedAt | DateTime | Course start timestamp |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Constraints:**
- Unique constraint on (userId, courseId) - one progress record per user per course

#### 3. **course_notes** - Course Notes
Stores user notes for each course section.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| userId | String | Foreign key to users |
| courseId | String | Course identifier |
| sectionId | String | Section identifier |
| content | Text | Note content |
| createdAt | DateTime | Note creation timestamp |
| updatedAt | DateTime | Last update timestamp |

**Constraints:**
- Unique constraint on (userId, courseId, sectionId) - one note per section per user

## 🔧 Database Operations

### Running Migrations
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Prisma Studio (Database GUI)
```bash
npx prisma studio
```
Opens a web interface at http://localhost:5555 to view and edit data.

### Generate Prisma Client
```bash
npx prisma generate
```

## 🐳 Docker Setup

The database is managed via Docker Compose in `/home/atlas/Projects/CSL/CSL-DevOps/docker-compose.yml`

### Start Database
```bash
cd /home/atlas/Projects/CSL/CSL-DevOps
docker compose up -d postgres-coody
```

### Stop Database
```bash
docker compose stop postgres-coody
```

### View Logs
```bash
docker compose logs -f postgres-coody
```

### Access PostgreSQL Shell
```bash
docker exec -it csl-postgres-coody psql -U coody_user -d coody_db
```

## 📝 Usage in Code

### Import Prisma Client
```typescript
import { prisma } from '@/lib/prisma';
```

### Example Queries

#### Create User
```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    password: hashedPassword,
    role: 'learner',
  },
});
```

#### Track Course Progress
```typescript
const progress = await prisma.courseProgress.upsert({
  where: {
    userId_courseId: {
      userId: user.id,
      courseId: 'python-sql-finance',
    },
  },
  update: {
    completedSections: {
      push: 'section-1-1',
    },
    lastAccessedSection: 'section-1-1',
    lastAccessedAt: new Date(),
  },
  create: {
    userId: user.id,
    courseId: 'python-sql-finance',
    completedSections: ['section-1-1'],
    lastAccessedSection: 'section-1-1',
  },
});
```

#### Save Course Notes
```typescript
const note = await prisma.courseNote.upsert({
  where: {
    userId_courseId_sectionId: {
      userId: user.id,
      courseId: 'python-sql-finance',
      sectionId: 'section-1-1',
    },
  },
  update: {
    content: 'My updated notes...',
  },
  create: {
    userId: user.id,
    courseId: 'python-sql-finance',
    sectionId: 'section-1-1',
    content: 'My notes...',
  },
});
```

#### Get User Progress
```typescript
const userWithProgress = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    courseProgress: true,
    courseNotes: true,
  },
});
```

## 🔒 Security Notes

1. **Password Hashing**: Always hash passwords before storing (use bcrypt or argon2)
2. **Environment Variables**: Never commit `.env` file to git
3. **Database Backups**: Implement regular backup strategy
4. **SSL Connection**: Consider enabling SSL for production

## 🚀 Migration Status

✅ **Initial Migration Applied**: 20251110192721_init
- Created users table
- Created course_progress table
- Created course_notes table
- Set up all relationships and constraints

## 📦 Next Steps

### For MVP:
1. ✅ Database schema created
2. ✅ Migrations applied
3. ⏳ Implement authentication API routes
4. ⏳ Migrate Zustand stores to use database
5. ⏳ Add user registration/login pages
6. ⏳ Sync course progress with database

### Future Enhancements:
- Exercise submissions and results
- Quiz scores
- Certificates
- User achievements/badges
- Course ratings and reviews
- Discussion forums
- Instructor dashboard analytics

---

**Last Updated**: November 10, 2025  
**Database Version**: PostgreSQL 15  
**Prisma Version**: 6.19.0
