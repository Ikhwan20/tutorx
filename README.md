# TutorX - Malaysian Additional Mathematics Learning Platform

![TutorX Platform](https://img.shields.io/badge/Education-Malaysian%20Form%204-blue) ![Status](https://img.shields.io/badge/Status-Production%20Ready-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

TutorX is a comprehensive gamified learning platform designed specifically for Malaysian Form 4 Additional Mathematics students following the KSSM (Kurikulum Standard Sekolah Menengah) syllabus. The platform combines educational videos, interactive quizzes, progress tracking, and gamification features to make mathematics learning engaging and effective.

## Key Features

### Educational Content
- **9 Comprehensive Lessons**: Real YouTube educational videos aligned with Malaysian curriculum
- **2 Main Topics**: Functions & Graphs (3 lessons) and Quadratic Functions (6 lessons)
- **Interactive Learning**: Step-by-step video tutorials with structured content
- **Malaysian-Specific**: Content tailored for KSSM Form 4 Additional Mathematics syllabus

### Gamification System
- **Points & Levels**: Earn XP points and level up through learning activities
- **Study Streaks**: Daily learning streak tracking to build consistent habits
- **Achievement System**: Unlock rewards and badges for reaching milestones
- **Progress Analytics**: Detailed learning insights and performance tracking

### Assessment & Quizzes
- **Interactive Quizzes**: Multiple-choice assessments with immediate feedback
- **Score Tracking**: Detailed performance analytics with percentage scoring
- **Topic-Specific Tests**: Targeted quizzes for each learning area
- **Progress Validation**: Completion tracking for lessons and topics

### Modern Web Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Live progress tracking and instant feedback
- **Clean UI**: Modern, student-friendly interface with Malaysian design sensibilities
- **Fast Performance**: Optimized for quick loading and smooth interactions

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe component development
- **Tailwind CSS** with shadcn/ui components for consistent styling
- **TanStack Query** for efficient server state management and caching
- **Wouter** for lightweight client-side routing
- **Vite** for fast development builds and hot reload

### Backend Stack
- **Node.js** with Express.js framework for RESTful API endpoints
- **TypeScript** throughout for end-to-end type safety
- **Drizzle ORM** with PostgreSQL for production database operations
- **In-Memory Storage** for development with sample Malaysian curriculum data
- **Zod** for runtime data validation and type inference

### Database Schema
```
Users (gamification metrics) → Progress Tracking → Topics → Lessons → Quizzes
                                     ↓
                               Achievements ← User Achievements
```


## Deployment Method

### Option 2: PostgreSQL Production Setup

For production deployments with persistent database storage:

1. **Database Configuration**
   ```bash
   # Install PostgreSQL client
   npm install @neondatabase/serverless
   
   # Set environment variables
   export DATABASE_URL="postgresql://username:password@host:port/database"
   ```

2. **Run Database Migrations**
   ```bash
   npx drizzle-kit generate:pg
   npx drizzle-kit migrate:pg
   ```

3. **Update Storage Implementation**
   Replace the MemStorage with PostgreSQL implementation in `server/storage.ts`

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

### Option 3: Docker Deployment

For containerized deployments:

1. **Create Dockerfile** (add to project root):
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Build and Deploy**:
   ```bash
   docker build -t tutorx-platform .
   docker run -p 5000:5000 tutorx-platform
   ```

### Option 4: Vercel Deployment

For serverless deployment:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Configure Environment**:
   Set up environment variables in the Vercel dashboard

## Project Structure

```
tutorx-platform/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   └── App.tsx        # Main application component
│   └── index.html         # HTML entry point
├── server/                 # Backend Express.js application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data access layer
│   └── vite.ts            # Development server integration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and TypeScript types
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite build configuration
└── README.md             # This documentation file
```

## Configuration & Customization

### Adding New Topics
1. Update the sample data in `server/storage.ts`
2. Add new topic data with Malaysian curriculum alignment
3. Create corresponding lessons and quizzes
4. Test the new content in the development environment

### Adding New Lessons
1. Define lesson structure in the database schema
2. Add video URLs (YouTube links recommended)
3. Create lesson content with Malaysian examples
4. Add corresponding quizzes for assessment

### Customizing Gamification
1. Modify point values in the achievement system
2. Adjust level progression calculations
3. Add new achievement types and rewards
4. Customize the user interface themes

### Adding New Achievement Types
1. Define achievement criteria in `server/storage.ts`
2. Add achievement checking logic in the progress tracking
3. Create achievement badges and visual rewards
4. Test achievement unlock conditions

## API Documentation

### Authentication Endpoints
- `GET /api/users/:id` - Get user profile and gamification data
- `PUT /api/users/:id` - Update user progress and statistics

### Educational Content Endpoints
- `GET /api/topics` - List all available topics
- `GET /api/topics/:id` - Get specific topic details
- `GET /api/topics/:id/lessons` - Get lessons for a topic
- `GET /api/lessons/:id` - Get specific lesson content

### Assessment Endpoints
- `GET /api/quizzes/:id` - Get quiz questions and structure
- `POST /api/progress` - Submit quiz results and update progress

### Gamification Endpoints
- `GET /api/achievements` - List all available achievements
- `GET /api/users/:id/achievements` - Get user's unlocked achievements
- `GET /api/users/:id/progress` - Get detailed progress analytics

## Malaysian Curriculum Alignment

### Form 4 Additional Mathematics Coverage
- **Functions and Graphs**: Function notation, domain/range, transformations
- **Quadratic Functions**: Standard form, vertex form, completing the square
- **Polynomial Functions**: Factoring, graphing, and applications
- **Exponential and Logarithmic Functions**: Growth models and real applications
- **Trigonometric Functions**: Unit circle, identities, and problem solving

### Assessment Standards
- Multiple choice questions aligned with SPM format
- Step-by-step solutions with Malaysian mathematical conventions
- Real-world applications relevant to Malaysian students
- Progress tracking matching Malaysian education benchmarks

## Testing & Quality Assurance

### Development Testing
```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run development server with hot reload
npm run dev
```

### Code Quality Standards
- TypeScript strict mode enabled for type safety
- ESLint configuration for code consistency
- Prettier formatting for readable code
- Component-level testing with React Testing Library

## Contributing Guidelines

### Adding New Features
1. Create feature branch from main
2. Implement feature with TypeScript types
3. Add comprehensive comments and documentation
4. Test feature thoroughly in development
5. Submit pull request with detailed description

### Code Style Guidelines
- Use TypeScript for all new code
- Follow existing component structure patterns
- Add JSDoc comments for complex functions
- Use semantic HTML and accessible design patterns
- Follow Malaysian English spelling conventions

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Educational Impact

TutorX is designed to make Malaysian Additional Mathematics more accessible and engaging for Form 4 students. The platform addresses common learning challenges through:

- **Visual Learning**: Video-based lessons with clear explanations
- **Interactive Practice**: Immediate feedback through quizzes and assessments  
- **Motivation**: Gamification elements to maintain student engagement
- **Progress Tracking**: Analytics to help students and teachers monitor improvement
- **Accessibility**: Mobile-responsive design for learning anywhere, anytime

## Support & Resources

### Getting Help
- Check the documentation in the `/docs` folder
- Review the code comments for implementation details
- Open GitHub issues for bugs or feature requests
- Contact the development team for urgent support

### Educational Resources
- Malaysian Ministry of Education KSSM guidelines
- Additional Mathematics textbook alignments
- Teacher resources and lesson planning guides
- Student progress tracking and parent reports

---

**Built with for Malaysian students and educators**

*Making Additional Mathematics accessible, engaging, and effective through modern technology.*