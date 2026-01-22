# Chosn: Complete Product Documentation
## A Modern Platform for the Childfree Community

**Working Name:** Chosn
**Domain:** chosn.app (to be registered)
**Tagline:** *"Thrive together."*

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Market Research & Opportunity](#market-research--opportunity)
3. [Competitive Analysis](#competitive-analysis)
4. [Product Requirements Document (PRD)](#product-requirements-document-prd)
5. [Technical Specifications](#technical-specifications)
6. [Implementation Plan](#implementation-plan)
7. [Marketing Strategy](#marketing-strategy)
8. [Brand & Naming](#brand--naming)
9. [Financial Projections](#financial-projections)
10. [Risk Analysis & Mitigation](#risk-analysis--mitigation)

---

## Executive Summary

### The Opportunity
The childfree population is growing rapidly—from 13.8% of non-parents in 2002 to nearly 30% in 2022. This represents approximately **50-60 million Americans** who have chosen a childfree lifestyle. Yet existing solutions in this space are fragmented, outdated, or too narrowly focused on dating alone.

### The Vision
Create a modern, community-first platform that serves the full spectrum of childfree adults—whether they're seeking romantic partnership, meaningful friendships, chosen family, or simply connection with like-minded individuals. This isn't just a dating app; it's a lifestyle platform for people who've made the same fundamental life choice.

### Key Differentiators
1. **Three-mode approach**: Dating, Friendship, and Community—all in one platform
2. **Modern UX**: Hinge/Bumble-level design and interaction patterns
3. **Verification-first**: Human-verified childfree status to build trust
4. **Community features**: Events, forums, and local gatherings
5. **Inclusive of all relationship statuses**: Singles, couples seeking friends, people in open relationships

---

## Market Research & Opportunity

### Demographics & Market Size

| Metric | Data | Source |
|--------|------|--------|
| Childfree adults in US | 50-60 million | MSU Study 2025 |
| % of non-parents who are childfree | 29.4% (up from 13.8% in 2002) | MSU Study |
| DINK households | 42+ million couples | Pew Research |
| DINK median household income | $193,900 | Pew Research 2023 |
| Global dating app market | $8.28 billion (2025) | Statista |
| US fertility rate | 1.6 births/woman (historic low) | CDC 2023 |

### User Demographics

**Age Distribution:**
- Average age of childfree individuals actively discussing online: 25.6 years
- Majority are millennials and Gen Z
- Growing segment of 35-50 year olds who've been childfree for decades

**Other Demographics:**
- 70% live in urban areas
- 37.5% identify as LGBTQ+
- Higher education levels (58% of DINK couples have bachelor's degrees)
- Higher disposable income—spend 4x more on dining out, 2x on travel

### Psychographic Insights

**Motivations for Being Childfree:**
1. Personal independence and autonomy
2. More leisure time
3. Career and education focus
4. Financial flexibility
5. Climate/environmental concerns (12% of Gen Z)
6. Health reasons

**Pain Points:**
1. **Dating difficulty**: Hard to find compatible partners who share childfree values
2. **"You'll change your mind"**: Constant dismissal of their life choice
3. **Social isolation**: Friends with kids drift away; harder to find community
4. **Chosen family needs**: No built-in support network for aging, emergencies
5. **Lifestyle mismatch**: Events and social structures centered around families

### The "Chosen Family" Opportunity

This is an underserved angle that no competitor adequately addresses:
- Childfree individuals rely more heavily on "chosen family" networks
- They're more likely to need formal long-term care planning
- Only 19.9% have wills (vs 32% general population)
- They seek deep, reliable friendships that provide family-like support

---

## Competitive Analysis

### Direct Competitors

#### 1. CFdating.com
**Overview:** Launched 2018, husband-and-wife team in Atlanta, ~10,000+ messages sent

**Strengths:**
- Human-verified profiles (no bots)
- Dedicated to childfree community
- Includes vasectomy/tubal ligation filters

**Weaknesses:**
- Dated UI/UX (website-first, not mobile-optimized)
- US-centric (international users face issues)
- Dating-only (no friendship/community features)
- Small user base
- Technical bugs reported

**Gap to Exploit:** Modern mobile experience, community features, global reach

#### 2. Kindred
**Overview:** Launched Feb 2022 (UK), iOS/Android, expanding globally

**Strengths:**
- Modern app design
- Includes childfree, childless, and parents-done categories
- Selfie verification
- Human-reviewed profiles

**Weaknesses:**
- UK-focused (limited US presence)
- Dating-only focus
- Limited community features
- Unclear how active user base is

**Gap to Exploit:** US market, community/friendship modes, events

#### 3. Biyu
**Overview:** Available on Google Play, €4.99/month premium

**Strengths:**
- Mobile-native
- Consent-based messaging (no conversation without acceptance)

**Weaknesses:**
- Limited features
- Small user base
- European focus
- No community features

#### 4. Childfree Passions
**Overview:** Free social networking/dating site

**Strengths:**
- Free to use
- Video/audio chat features
- Community chat rooms

**Weaknesses:**
- Very dated design (feels like 2005)
- Low engagement
- Spammy feel

### Indirect Competitors

#### Mainstream Dating Apps with Childfree Filters
- **OkCupid**: Has "doesn't want kids" filter, but buried in settings
- **Bumble**: Has preference filters, but not optimized for childfree
- **Hinge**: Family plans question, but not a core feature

**Gap:** None center childfree identity; it's an afterthought filter

#### Community Platforms
- **Childless Collective** (Mighty Networks): Support-focused, not dating/matching
- **r/childfree** (Reddit): 1.6M members, but not for dating/meetups
- **Meetup childfree groups**: Fragmented, inconsistent quality

### Competitive Gap Analysis

| Feature | CFdating | Kindred | Biyu | Our App |
|---------|----------|---------|------|---------|
| Modern mobile UX | ❌ | ✅ | ✅ | ✅ |
| Dating mode | ✅ | ✅ | ✅ | ✅ |
| Friendship mode | ❌ | ❌ | ❌ | ✅ |
| Community/events | ❌ | ❌ | ❌ | ✅ |
| Human verification | ✅ | ✅ | ❌ | ✅ |
| Prompt-based profiles | ❌ | ❌ | ❌ | ✅ |
| US market focus | ✅ | ❌ | ❌ | ✅ |
| LGBTQ+ inclusive | ✅ | ✅ | ❌ | ✅ |
| In-app events | ❌ | ❌ | ❌ | ✅ |
| Chosen family features | ❌ | ❌ | ❌ | ✅ |

---

## Product Requirements Document (PRD)

### Vision Statement
**"The platform where childfree adults find their people—whether that's a partner, a best friend, or their chosen family."**

### User Types (Revised Based on Research)

#### 1. **Chosn Solo**
- Thriving single, not actively seeking romance
- Wants community, friendships, chosen family
- May attend events, join interest groups
- Values: autonomy, connection without pressure

#### 2. **Open to Love**
- Seeking romantic partnership
- Childfree is a dealbreaker criterion
- Wants modern dating experience (Hinge-like)
- Values: compatibility, intentional dating

#### 3. **Future-Flexible**
- Not dating now, but open to future connection
- May be recently out of relationship, focused on career, etc.
- Wants to build network, stay visible
- Values: low-pressure presence, optionality

#### 4. **Coupled & Connected** (New category)
- In a relationship but seeking:
  - Couple friends
  - Individual friendships
  - Community involvement
- Values: social expansion without dating pressure

### Core Features

#### Phase 1: MVP (Launch Features)

**1. Onboarding & Profile Creation**
```
- Phone/email signup with verification
- Childfree status selection:
  - Childfree by choice
  - Childfree and sterilized (optional detail)
  - Childless by circumstance
  - Parent but done (no more kids)
- Relationship status:
  - Single
  - In a relationship
  - It's complicated
  - Ethically non-monogamous
- What I'm here for:
  - Dating
  - Friendship
  - Community
  - All of the above
- 6 photos minimum
- 3 prompts from curated list
- Location (city-level, not exact)
- Basic preferences (age, distance, gender)
```

**2. Discovery & Matching**
```
- Card-based profile viewing (Hinge-style)
- Like specific photos or prompts (not just swipe)
- Send intro message with like (encouraged, not required)
- Mutual likes = match
- Daily "Highly Compatible" suggestions (AI-powered)
- Filters: age, distance, relationship goal, sterilization status
```

**3. Messaging**
```
- Text chat for matches
- Photo sharing
- Voice notes
- No read receipts (reduces pressure)
- Video call option (in-app for safety)
- Report/block functionality
```

**4. Safety & Verification**
```
- Photo verification (selfie matching)
- Human review of all profiles before going live
- Community reporting system
- ID verification (optional, gets badge)
- Block list that persists
```

**5. Notifications & Engagement**
```
- Push notifications for matches, messages
- Weekly "new people in your area" digest
- "Someone liked you" teaser (paywall for details in free tier)
```

#### Phase 2: Post-Launch (Months 3-6)

**6. Friendship Mode**
```
- Separate tab/mode for platonic connections
- Profile adapts (different prompts for friendship)
- Bumble BFF-style matching
- Group matching (for friend groups seeking other groups)
```

**7. Community Features**
```
- Location-based forums/discussions
- Interest-based groups (travel, pets, career, hobbies)
- User-generated events (virtual and IRL)
- Official app-hosted events in major cities
```

**8. Events Platform**
```
- Browse local childfree events
- RSVP system
- Event chat rooms
- User-created events with approval
- Virtual events (game nights, book clubs, etc.)
```

#### Phase 3: Growth Features (Months 6-12)

**9. Chosen Family Features**
```
- "Inner Circle" designation for close connections
- Emergency contact sharing
- Milestone celebrations (sterilization anniversaries, etc.)
- Resource sharing (childfree-friendly doctors, etc.)
```

**10. Premium Features**
```
- See who liked you
- Unlimited likes
- Advanced filters
- Priority profile placement
- Read receipts (optional)
- Profile boost
- Incognito mode
- Travel mode
```

**11. Advanced Matching**
```
- Compatibility scores
- "We Met" feedback (like Hinge)
- AI-driven recommendations
- Prompt answer compatibility
```

### User Stories

**US-001: New User Signup**
```
As a new user,
I want to create a profile that reflects my childfree identity,
So that I can connect with compatible people.

Acceptance Criteria:
- Can sign up with phone or email
- Must verify phone/email
- Must complete childfree status selection
- Must upload minimum 3 photos
- Must answer minimum 2 prompts
- Profile reviewed by human within 24 hours
```

**US-002: Discover Matches**
```
As a user seeking dates,
I want to browse profiles of other childfree singles,
So that I can find potential romantic partners.

Acceptance Criteria:
- See one profile at a time
- Can like entire profile or specific content
- Can pass/skip profiles
- Shown profiles within my preference filters
- Can send message with like
```

**US-003: Match & Chat**
```
As a user who received a mutual like,
I want to chat with my match,
So that I can get to know them better.

Acceptance Criteria:
- Notification when matched
- Chat opens with context (what they liked)
- Can send text, photos, voice notes
- Can video call
- Can unmatch at any time
```

**US-004: Find Local Events**
```
As a user seeking community,
I want to discover childfree events in my area,
So that I can meet people in person.

Acceptance Criteria:
- See events within my location radius
- Filter by event type
- See who else is attending
- RSVP to events
- Get reminders before events
```

### Prompt Library (Sample)

**Dating Prompts:**
- "My ideal childfree weekend looks like..."
- "The moment I knew I didn't want kids..."
- "A boundary I'll never compromise on..."
- "My love language is..."
- "Green flags I look for..."
- "Dating me is like..."

**Friendship Prompts:**
- "I'm the friend who always..."
- "Looking for someone to [activity] with..."
- "My friendship love language is..."
- "A perfect friend hangout for me is..."
- "I nerd out about..."

**Lifestyle Prompts:**
- "Favorite way to spend my disposable income..."
- "My pet(s) are..."
- "Travel destination on my bucket list..."
- "How I'm building my chosen family..."

### Success Metrics

| Metric | Target (Year 1) |
|--------|-----------------|
| Registered users | 100,000 |
| Monthly active users | 40,000 |
| DAU/MAU ratio | 25%+ |
| Match rate | 15%+ |
| Messages per match | 10+ |
| Premium conversion | 5-8% |
| User retention (D30) | 30% |
| NPS | 40+ |
| Events hosted | 500+ |

---

## Technical Specifications

### Platform Strategy: Web-First, Then Mobile

**Rationale:**
1. Faster iteration without app store approvals
2. Lower development cost for MVP
3. Easier to test and validate features
4. SEO benefits for organic discovery
5. No install friction for new users

**Phased Approach:**
- **Phase 1 (Months 1-3):** Progressive Web App (PWA)
- **Phase 2 (Months 4-6):** React Native mobile apps
- **Phase 3 (Months 6+):** Native features as needed

### Recommended Tech Stack

#### Frontend
```
Framework: Next.js 14+ (React)
Styling: Tailwind CSS
State Management: Zustand or React Query
Real-time: Socket.io client
Mobile: React Native (Phase 2)
```

#### Backend
```
Runtime: Node.js with Express or Fastify
API: REST + WebSocket for real-time
ORM: Prisma
Validation: Zod
Authentication: NextAuth.js + custom JWT
```

#### Database
```
Primary: PostgreSQL (Supabase or Railway)
Cache: Redis (Upstash)
Search: Meilisearch or Algolia (for user discovery)
File Storage: Cloudflare R2 or AWS S3
```

#### Infrastructure
```
Hosting: Vercel (frontend) + Railway or Render (backend)
CDN: Cloudflare
Monitoring: Sentry + Vercel Analytics
Logging: Axiom or Logtail
CI/CD: GitHub Actions
```

#### Third-Party Services
```
Auth: Clerk or Auth0
Email: Resend or Postmark
SMS: Twilio
Push Notifications: OneSignal
Video Calls: Daily.co or Twilio Video
Payments: Stripe
Analytics: Mixpanel or Amplitude
Moderation: AWS Rekognition (photo) + OpenAI (text)
```

### Database Schema (Core Entities)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  status ENUM('pending', 'active', 'suspended', 'deleted'),
  verified_at TIMESTAMP,
  last_active TIMESTAMP
);

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  display_name VARCHAR(50),
  birthdate DATE,
  gender VARCHAR(50),
  gender_preferences TEXT[], -- array of genders interested in
  childfree_status ENUM('choice', 'sterilized', 'circumstance', 'parent_done'),
  relationship_status ENUM('single', 'relationship', 'complicated', 'enm'),
  seeking TEXT[], -- 'dating', 'friendship', 'community'
  bio TEXT,
  location_city VARCHAR(100),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  age_min INT,
  age_max INT,
  distance_max INT, -- miles
  is_verified BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE
);

-- Photos
CREATE TABLE photos (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id),
  url VARCHAR(500),
  position INT, -- order in profile
  is_primary BOOLEAN,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);

-- Prompts
CREATE TABLE prompts (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id),
  prompt_type VARCHAR(100), -- 'childfree_moment', 'ideal_weekend', etc.
  answer TEXT,
  position INT,
  created_at TIMESTAMP
);

-- Likes
CREATE TABLE likes (
  id UUID PRIMARY KEY,
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  content_type ENUM('profile', 'photo', 'prompt'),
  content_id UUID, -- references photo or prompt id if applicable
  message TEXT, -- optional intro message
  created_at TIMESTAMP,
  UNIQUE(from_user_id, to_user_id)
);

-- Matches
CREATE TABLE matches (
  id UUID PRIMARY KEY,
  user_1_id UUID REFERENCES users(id),
  user_2_id UUID REFERENCES users(id),
  matched_at TIMESTAMP,
  status ENUM('active', 'unmatched', 'blocked'),
  last_message_at TIMESTAMP
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  match_id UUID REFERENCES matches(id),
  sender_id UUID REFERENCES users(id),
  content TEXT,
  content_type ENUM('text', 'photo', 'voice', 'video_call'),
  created_at TIMESTAMP,
  read_at TIMESTAMP
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES users(id),
  title VARCHAR(200),
  description TEXT,
  event_type ENUM('virtual', 'in_person'),
  location_city VARCHAR(100),
  location_address TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  starts_at TIMESTAMP,
  ends_at TIMESTAMP,
  max_attendees INT,
  is_official BOOLEAN, -- app-hosted vs user-created
  status ENUM('draft', 'published', 'cancelled', 'completed'),
  created_at TIMESTAMP
);

-- Event RSVPs
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES users(id),
  status ENUM('going', 'maybe', 'not_going'),
  created_at TIMESTAMP,
  UNIQUE(event_id, user_id)
);

-- Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  reporter_id UUID REFERENCES users(id),
  reported_user_id UUID REFERENCES users(id),
  reason ENUM('fake', 'harassment', 'not_childfree', 'inappropriate', 'spam', 'other'),
  details TEXT,
  status ENUM('pending', 'reviewed', 'actioned', 'dismissed'),
  created_at TIMESTAMP,
  reviewed_at TIMESTAMP
);
```

### API Endpoints (Core)

```
Authentication:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/verify-phone
POST   /api/auth/refresh-token
POST   /api/auth/logout

Profile:
GET    /api/profile
PUT    /api/profile
POST   /api/profile/photos
DELETE /api/profile/photos/:id
PUT    /api/profile/prompts

Discovery:
GET    /api/discover          # Get potential matches
POST   /api/discover/like     # Like a profile
POST   /api/discover/pass     # Pass on a profile
GET    /api/discover/compatible # Daily compatible suggestions

Matches:
GET    /api/matches
GET    /api/matches/:id
DELETE /api/matches/:id       # Unmatch

Messages:
GET    /api/matches/:id/messages
POST   /api/matches/:id/messages
POST   /api/matches/:id/video-call

Events:
GET    /api/events
GET    /api/events/:id
POST   /api/events
PUT    /api/events/:id
POST   /api/events/:id/rsvp
GET    /api/events/:id/attendees

Community:
GET    /api/groups
GET    /api/groups/:id/posts
POST   /api/groups/:id/posts

Admin:
GET    /api/admin/pending-profiles
POST   /api/admin/profiles/:id/approve
POST   /api/admin/profiles/:id/reject
GET    /api/admin/reports
```

### Matching Algorithm

```python
# Pseudocode for compatibility scoring

def calculate_compatibility(user_a, user_b):
    score = 0
    max_score = 100

    # Must-have filters (dealbreakers)
    if not passes_basic_filters(user_a, user_b):
        return 0

    # Distance score (0-20 points)
    distance = calculate_distance(user_a.location, user_b.location)
    if distance <= 10:
        score += 20
    elif distance <= 25:
        score += 15
    elif distance <= 50:
        score += 10
    else:
        score += 5

    # Childfree status alignment (0-20 points)
    if user_a.childfree_status == user_b.childfree_status:
        score += 20
    elif both_firmly_childfree(user_a, user_b):
        score += 15
    else:
        score += 10

    # Seeking alignment (0-15 points)
    seeking_overlap = len(set(user_a.seeking) & set(user_b.seeking))
    score += seeking_overlap * 5

    # Activity level (0-10 points)
    # More active users scored higher
    score += activity_score(user_b)

    # Profile completeness (0-10 points)
    score += completeness_score(user_b)

    # Behavioral signals (0-25 points)
    # Based on historical like/pass patterns
    score += ml_compatibility_score(user_a, user_b)

    return score

def passes_basic_filters(user_a, user_b):
    # Age range check
    if not (user_a.age_min <= user_b.age <= user_a.age_max):
        return False
    if not (user_b.age_min <= user_a.age <= user_b.age_max):
        return False

    # Gender preference check
    if user_b.gender not in user_a.gender_preferences:
        return False
    if user_a.gender not in user_b.gender_preferences:
        return False

    # Distance check
    if calculate_distance(user_a, user_b) > user_a.distance_max:
        return False

    # Not already matched/blocked
    if has_existing_interaction(user_a, user_b):
        return False

    return True
```

### Security Requirements

1. **Data Encryption**
   - TLS 1.3 for all connections
   - AES-256 for data at rest
   - Bcrypt for password hashing

2. **Authentication**
   - JWT with short expiry (15 min access, 7 day refresh)
   - Rate limiting on auth endpoints
   - 2FA option for premium users

3. **Privacy**
   - Location fuzzing (city-level, not exact)
   - Photo metadata stripping
   - Right to deletion (GDPR compliance)
   - Data export functionality

4. **Moderation**
   - AI-powered photo screening (nudity, violence)
   - Text content moderation
   - Human review queue
   - User reporting system

---

## Implementation Plan

### Phase 1: Foundation (Weeks 1-4)

**Week 1-2: Setup & Core Infrastructure**
- [ ] Set up monorepo structure
- [ ] Configure Next.js project
- [ ] Set up PostgreSQL database
- [ ] Implement authentication (signup, login, verify)
- [ ] Set up CI/CD pipeline
- [ ] Configure staging environment

**Week 3-4: Profile System**
- [ ] Build profile creation flow
- [ ] Implement photo upload (with compression)
- [ ] Build prompt selection and answering
- [ ] Create profile viewing component
- [ ] Implement profile editing

### Phase 2: Core Features (Weeks 5-8)

**Week 5-6: Discovery & Matching**
- [ ] Build discovery feed algorithm
- [ ] Create swipe/like interface
- [ ] Implement like with message
- [ ] Build matching logic
- [ ] Create matches list view

**Week 7-8: Messaging**
- [ ] Implement real-time messaging (WebSocket)
- [ ] Build chat UI
- [ ] Add photo sharing in chat
- [ ] Implement voice notes
- [ ] Add unmatch/block functionality

### Phase 3: Safety & Polish (Weeks 9-12)

**Week 9-10: Verification & Safety**
- [ ] Build photo verification flow
- [ ] Create admin review dashboard
- [ ] Implement reporting system
- [ ] Add AI moderation integration
- [ ] Build block/report flows

**Week 11-12: Polish & Testing**
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Security audit
- [ ] Load testing
- [ ] Bug fixes and polish
- [ ] App Store assets (for later)

### Phase 4: Launch (Weeks 13-16)

**Week 13: Soft Launch**
- [ ] Launch to waitlist (beta)
- [ ] Gather feedback
- [ ] Fix critical issues
- [ ] Monitor metrics

**Week 14-15: Iterate**
- [ ] Address top user feedback
- [ ] Optimize onboarding
- [ ] Tune matching algorithm

**Week 16: Public Launch**
- [ ] Marketing push
- [ ] PR outreach
- [ ] Influencer partnerships
- [ ] Community seeding

### Phase 5: Growth Features (Months 4-6)

- [ ] Build friendship mode
- [ ] Create events platform
- [ ] Implement community forums
- [ ] Build premium subscription
- [ ] Launch mobile apps (React Native)

### Phase 6: Scale (Months 6-12)

- [ ] Advanced matching AI
- [ ] Chosen family features
- [ ] International expansion
- [ ] Enterprise features (for events companies)
- [ ] API for partners

### Team Requirements

**MVP (Months 1-4):**
- 1 Full-stack Developer (founder or lead)
- 1 Frontend Developer
- 1 Backend Developer
- 1 Designer (part-time/contract)
- 1 Community Manager (part-time)

**Growth (Months 4-12):**
- Add: 1 Mobile Developer
- Add: 1 DevOps/Infrastructure
- Add: 1 Data Scientist
- Full-time: Community Manager
- Add: 1 Marketing Lead

---

## Marketing Strategy

### Positioning Statement

**For** childfree adults **who** want meaningful connections without the pressure of traditional family expectations, **Chosn** is a **community-first platform** that **connects you with partners, friends, and chosen family who share your lifestyle**. **Unlike** mainstream dating apps where childfree is an afterthought or niche sites with outdated UX, **we** provide a modern, verified, and inclusive space designed around your identity.

### Target Audience Segments

#### Primary: "Intentional Daters" (30-45, urban)
- Know what they want
- Frustrated with mainstream apps
- Willing to pay for quality
- Active on: Instagram, Reddit, podcasts

#### Secondary: "Community Seekers" (25-40, mixed)
- May or may not be dating
- Seeking friends and belonging
- Lost social circles to friends' parenthood
- Active on: TikTok, Facebook groups, Discord

#### Tertiary: "Newly Decided" (22-30)
- Recently committed to childfree
- Seeking validation and community
- Exploring identity
- Active on: TikTok, Reddit, Twitter/X

### Launch Strategy

#### Pre-Launch (8 weeks before)

**1. Waitlist Building**
- Landing page with value prop
- "Be first" positioning
- Referral incentive (skip the line)
- Email nurture sequence
- Target: 5,000-10,000 signups

**2. Community Seeding**
- Engage on r/childfree (authentically, not spammy)
- Partner with childfree content creators
- Guest on childfree podcasts
- Build Twitter/X presence

**3. Content Marketing**
- Blog: "State of Childfree Dating" report
- Social: Shareable memes and quotes
- PR: Pitch to lifestyle publications

#### Launch Phase

**1. Invite Waves**
- Release in batches by city
- Maintain gender/seeking balance
- Create scarcity/exclusivity

**2. Influencer Partnerships**
- Micro-influencers (10K-100K) in:
  - Childfree lifestyle
  - DINK finance
  - Travel/adventure
  - LGBTQ+ community

**3. PR Push**
- Story angle: "The app for the 60 million Americans who chose not to have kids"
- Target: Refinery29, Bustle, The Cut, HuffPost, local news

#### Growth Phase

**1. Referral Program**
- Both referrer and referee get 1 month premium free
- Track referrals in-app
- Leaderboard for top referrers

**2. Events Marketing**
- Host launch parties in major cities
- Partner with childfree-friendly venues
- Create Instagram-worthy experiences

**3. Content Flywheel**
- User success stories (with consent)
- "How we met" features
- Community member spotlights
- Childfree lifestyle content

### Channel Strategy

| Channel | Purpose | Budget % |
|---------|---------|----------|
| Organic Social | Awareness, community | 10% |
| Influencer | Credibility, reach | 25% |
| Podcast Ads | Targeted reach | 20% |
| Reddit/FB Groups | Community seeding | 5% |
| PR/Media | Credibility, reach | 15% |
| Paid Social | Acquisition | 20% |
| Events | Brand, retention | 5% |

### Messaging Framework

**Core Message:**
"Find your people. Not just dates—your community, your chosen family, your future."

**Key Themes:**
1. **Validation**: "You're not alone. There are millions of us."
2. **Modern**: "Dating app UX meets community depth."
3. **Verified**: "Everyone here actually doesn't want kids."
4. **Inclusive**: "Dating, friendship, community—whatever you're seeking."
5. **Lifestyle**: "Built around how you actually live."

**Tagline Options:**
- "Your people are here."
- "Connection without conditions."
- "Where childfree isn't a filter—it's the foundation."
- "Find your chosen family."

---

## Brand & Naming

### Selected Name: **Chosn**

**Domain:** chosn.app (to be registered)
**Tagline:** *"Thrive together."*

**Why Chosn:**
- Positive framing—emphasizes thriving, not "anti" anything
- Works for dating AND community AND friendship
- Evokes growth, blooming, living your best life
- Elegant but not pretentious
- Easy to say, spell, remember
- Avoids trademark conflicts (unlike "Freely" which is a UK streaming service)

**Alternative Taglines:**
- "Your people are here."
- "Where childfree lives well."
- "Grow your chosen family."

### Visual Identity Direction

**Color Palette:**
- Primary: Warm coral or terracotta (inviting, not clinical)
- Secondary: Deep teal or forest green (grounding, mature)
- Accent: Gold or amber (premium feel)
- Neutrals: Warm grays, cream

**Mood:**
- Warm, not sterile
- Confident, not defensive
- Inclusive, not exclusive
- Modern, not trendy
- Grown-up, not childish (ironic pun aside)

**Typography:**
- Headers: Modern geometric sans (e.g., Satoshi, General Sans)
- Body: Readable humanist sans (e.g., Inter, Source Sans)

**Imagery Style:**
- Real people, diverse representation
- Lifestyle moments (travel, dining, pets, hobbies)
- Warm lighting, natural settings
- No stock photo feel
- Include couples AND friend groups AND solo shots

### Voice & Tone

**Brand Voice:**
- Confident but not arrogant
- Warm but not saccharine
- Direct but not cold
- Inclusive but not preachy
- Playful but not immature

**Examples:**

*Good:*
> "You know what you want. So do the people here."

*Not this:*
> "Finally, a place for people who hate kids!" (too negative)

*Good:*
> "Whether you're looking for love, friendship, or just people who get it—welcome home."

*Not this:*
> "Join our exclusive community of childfree individuals!" (too corporate)

---

## Financial Projections

### Revenue Model

**1. Freemium Subscription**

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 10 likes/day, basic filters, messaging |
| Plus | $14.99/mo | Unlimited likes, see who liked you, advanced filters |
| Premium | $29.99/mo | All Plus + boosts, read receipts, incognito, priority support |

**2. À La Carte Purchases**
- Boost ($4.99): 30 min visibility boost
- Super Like ($2.99): Stand out, guaranteed seen
- Spotlight ($9.99): Featured in discovery for 1 hour

**3. Events (Future)**
- Ticketed events: $15-50 per event
- Revenue share with hosts: 70/30

### Year 1 Financial Model

**Assumptions:**
- 100K registered users by end of Y1
- 40% MAU rate (40K monthly active)
- 6% premium conversion
- $18 average revenue per paying user (blended)

| Quarter | Users | MAU | Paying | Revenue |
|---------|-------|-----|--------|---------|
| Q1 | 10,000 | 4,000 | 240 | $4,320 |
| Q2 | 30,000 | 12,000 | 720 | $12,960 |
| Q3 | 60,000 | 24,000 | 1,440 | $25,920 |
| Q4 | 100,000 | 40,000 | 2,400 | $43,200 |
| **Total Y1** | | | | **$86,400** |

### Cost Structure (Year 1)

| Category | Monthly | Annual |
|----------|---------|--------|
| Infrastructure | $500-2,000 | $6,000-24,000 |
| Third-party services | $300-1,000 | $3,600-12,000 |
| Team (2-3 people) | $15,000-30,000 | $180,000-360,000 |
| Marketing | $2,000-10,000 | $24,000-120,000 |
| Legal/Admin | $500 | $6,000 |
| **Total** | **$18,300-43,500** | **$219,600-522,000** |

### Funding Requirements

**Bootstrap/Pre-Seed:** $50,000-100,000
- MVP development
- Initial marketing
- 6 months runway

**Seed (if pursuing VC):** $500,000-1,500,000
- Team expansion
- Marketing scale
- Mobile app development
- 18 months runway

### Path to Profitability

Break-even likely at ~50,000 paying users ($900K ARR) if keeping team lean. With Y1 conversion rates, this requires ~830K registered users—achievable in Y2-Y3 with strong retention and marketing.

---

## Risk Analysis & Mitigation

### Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low initial user base | High | High | Pre-launch waitlist, city-by-city rollout, community seeding |
| Gender imbalance | Medium | High | Monitor ratios, adjust marketing, consider invite system |
| Fake profiles/scammers | Medium | High | Human verification, AI moderation, community reporting |
| Mainstream app adds childfree features | Medium | Medium | Differentiate on community, build loyalty, move fast |
| Slow premium conversion | Medium | Medium | Test pricing, improve value prop, add features |
| Negative PR ("anti-children") | Low | High | Careful messaging, positive framing, PR preparation |
| Technical scaling issues | Low | Medium | Cloud infrastructure, load testing, monitoring |
| Competitor copies model | Low | Medium | Build community moat, iterate fast, brand loyalty |

### Mitigation Strategies

**1. Cold Start Problem**
- Launch city-by-city, not nationally
- Start with 5 cities with highest childfree populations
- Ensure minimum viable density before expanding
- Host launch events to seed early community

**2. Gender Balance**
- Monitor M/F/NB ratios in real-time
- Adjust marketing targeting if imbalanced
- Consider Bumble-style women-message-first if needed
- Promote friendship mode to attract broader base

**3. Community Trust**
- Transparency about moderation policies
- Fast response to reports
- Public commitment to verification
- Regular community updates

**4. Negative Framing**
- Never frame as "anti-children"
- Always positive: "pro-choice lifestyle"
- Emphasize community and belonging
- Have media talking points ready

---

## Appendix

### A. Childfree-Friendly Cities (Launch Targets)

1. San Francisco, CA
2. Seattle, WA
3. Portland, OR
4. Austin, TX
5. Denver, CO
6. New York, NY
7. Boston, MA
8. Chicago, IL
9. Los Angeles, CA
10. Washington, DC

### B. Content Calendar (Sample Month)

| Week | Theme | Content |
|------|-------|---------|
| 1 | Community spotlight | User story, "How we met" |
| 2 | Lifestyle | Travel tips, DINK finance |
| 3 | Dating advice | Profile tips, conversation starters |
| 4 | Events | Upcoming gatherings, event recaps |

### C. Key Metrics Dashboard

**Acquisition:**
- New signups (daily/weekly)
- Waitlist size
- CAC by channel
- Referral rate

**Engagement:**
- DAU/MAU
- Swipes per session
- Messages per match
- Event RSVPs

**Retention:**
- D1/D7/D30 retention
- Churn rate (free and paid)
- Reactivation rate

**Revenue:**
- MRR/ARR
- ARPU
- LTV
- Conversion rate (free to paid)

**Community Health:**
- Match rate
- Response rate
- Report rate
- NPS

---

## Sources

### Market Research
- [MSU Study on Childfree Adults](https://msutoday.msu.edu/news/2025/04/msu-study-finds-number-of-us-nonparents-who-never-want-children-is-growing)
- [Pew Research: Facts about DINKs](https://www.pewresearch.org/short-reads/2025/11/03/dual-income-no-kids-what-we-know-about-dinks-in-the-us/)
- [Scientific Reports: Prevalence of Childfree Adults](https://www.nature.com/articles/s41598-022-15728-z)
- [The Conversation: 1 in 5 US Adults Don't Want Children](https://theconversation.com/more-than-1-in-5-us-adults-dont-want-children-187236)
- [Fortune: DINK Spending Habits](https://fortune.com/2024/11/21/what-is-a-dink-dual-double-income-no-kids-new-1-percent-spending-luxury-travel-retail/)

### Competitor Analysis
- [CFdating Overview](https://www.datingnews.com/apps-and-sites/cfdating-supports-singles-who-want-childfree-lifestyles/)
- [Kindred Launch Announcement](https://www.stylist.co.uk/relationships/dating-love/dating-apps-kindred-kid-free-relationships/621151)
- [Boo: Guide to Childfree Dating Apps](https://boo.world/resources/niche-dating-best-dating-apps-for-childfree-dating)
- [Childless Collective Community](https://childlesscollective.com/)

### Dating App Design & Strategy
- [Dating App UX Best Practices 2025](https://medium.com/@prajapatisuketu/best-dating-app-ui-ux-design-practices-in-2025-d38fac4fa9c6)
- [MeasuringU: UX of Dating Apps 2024](https://measuringu.com/online-dating-benchmark-2024/)
- [Hinge vs Bumble Comparison](https://tawkify.com/blog/dating-methods/hinge-vs-bumble-dating-apps)
- [Dating App Monetization Guide](https://www.skadate.com/how-do-dating-apps-make-money/)
- [Niche Dating App Launch Strategy](https://www.adjust.com/blog/how-to-market-a-dating-app/)

### Technical Resources
- [Dating App Tech Stack 2025](https://www.jploft.com/blog/dating-app-tech-stack)
- [Location-Based Matching Technology](https://www.comfygen.com/blog/location-based-dating-app-development/)
- [Web vs Mobile MVP Strategy](https://orafox.com/web-vs-mobile-mvp-startup-strategy/)

### Community Insights
- [r/childfree Subreddit Analysis](https://gummysearch.com/r/childfree/)
- [Complete Without Kids: Childfree Dating](https://completewithoutkids.com/dating-and-relationships-in-the-childfree-community/)
- [Psychology Today: Why Adults Choose Childfree](https://www.psychologytoday.com/us/blog/invisible-bruises/202507/why-are-more-adults-choosing-to-remain-child-free)

---

*Document created: January 2026*
*Version: 1.1 — Updated with "Chosn" as working name*
