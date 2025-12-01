# SpotShot - Photo Spot Discovery & Sharing Platform

## Overview

**SpotShot** (also known as **PhotoSpots**) is a React Native mobile application that enables travelers, photographers, and content creators to discover, share, and save the best photo locations around the world. The app provides an interactive map-based interface where users can explore community-contributed photo spots, complete with images, descriptions, photography tips, and exact GPS coordinates.

## Core Purpose

The app solves the problem of finding photogenic locations when traveling or exploring new areas. Instead of searching through scattered blog posts or social media, users can:
- Browse a curated map of photo-worthy locations
- See exactly what to expect with real photos from each spot
- Get photography tips for capturing the best shot
- Navigate directly to locations using Google Maps integration
- Build a personal collection of saved spots for future visits

---

## Technology Stack

### Frontend
- **Framework**: React Native 0.81.4 with React 19.1.0
- **Navigation**: Expo Router 6.0 (file-based routing)
- **UI Components**: Custom components with Expo UI libraries
- **State Management**: React Context API + Custom Hooks
- **Platform**: Expo 54.0 (supports iOS, Android, and Web)

### Backend Services
- **Authentication**: Supabase Auth (email/password, session management)
- **Database**: Supabase (PostgreSQL) + Custom API Server
- **Image Storage**: Cloudinary (with server-side signature generation)
- **Maps**: Google Maps (react-native-maps)
- **Geocoding**: react-native-geocoding

### Key Dependencies
- `@supabase/supabase-js` - Authentication and database
- `@cloudinary/url-gen` - Image optimization
- `expo-image-picker` - Photo selection
- `expo-location` - GPS coordinates
- `react-native-maps` - Interactive maps
- `axios` - HTTP client for API calls
- `react-hook-form` - Form management

---

## Architecture Overview

### Application Structure

```
spotshot/
├── app/                          # Expo Router pages (file-based routing)
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Main map view (home)
│   │   ├── explore.tsx           # Explore with filters
│   │   ├── addSpot.tsx           # Add new spot form
│   │   ├── saved.tsx             # User's saved spots
│   │   ├── profile.tsx           # User profile & stats
│   │   └── login.tsx             # Authentication screen
│   ├── spot/                     # Spot detail pages
│   ├── add-spot/                 # Multi-step add spot flow
│   ├── _layout.tsx               # Root layout with providers
│   ├── index.tsx                 # App entry point
│   └── about.tsx                 # About page
├── lib/                          # Backend logic & API
│   ├── api/                      # API service layer
│   │   ├── spots.ts              # Spot CRUD operations
│   │   ├── favourites.ts         # Favourites management
│   │   ├── users.ts              # User profile operations
│   │   ├── cloudinary.ts         # Image upload signatures
│   │   └── moderation.ts         # Content moderation
│   ├── data/                     # Static data
│   └── supabase.ts               # Supabase client configuration
├── components/                   # Reusable React components
│   ├── ui/                       # UI components
│   ├── Filters.tsx               # Country/city filtering
│   └── ReportModal.tsx           # Report content modal
├── hooks/                        # Custom React hooks
│   ├── useSpots.ts               # Fetch all spots
│   ├── useSpot.ts                # Fetch single spot
│   ├── useFavourites.ts          # Favourites state
│   ├── useAddSpot.ts             # Add spot logic
│   ├── useUserStats.ts           # User statistics
│   └── useColorScheme.ts         # Theme management
├── provider/                     # React Context providers
│   └── AuthProvider.tsx          # Authentication context
├── types/                        # TypeScript type definitions
│   ├── spot.ts                   # Spot data model
│   └── profile.ts                # User profile model
├── utils/                        # Utility functions
│   ├── cloudinary.ts             # Cloudinary helpers
│   ├── maps.ts                   # Maps utilities
│   ├── compressImage.ts          # Image optimization
│   └── getAddressFromCoords.ts   # Reverse geocoding
├── constants/                    # App constants
├── assets/                       # Images, icons, fonts
└── views/                        # View components
```

### Data Flow Architecture

```
User Interaction
      ↓
React Component
      ↓
Custom Hook (e.g., useSpots, useFavourites)
      ↓
API Service Layer (lib/api/*)
      ↓
External Services (Supabase, Custom API Server, Cloudinary)
      ↓
Database / Storage
```

---

## Core Features & Functionality

### 1. Authentication System

**Location**: `provider/AuthProvider.tsx`

**Features**:
- Email/password signup with username
- Email/password login
- Session persistence (AsyncStorage)
- Password reset via email
- Auto-refresh tokens
- Auth state management across app lifecycle

**Key Functions**:
- `signIn(email, password)` - Authenticate user
- `signUp(email, password, username)` - Register new user with validation
- `signOut()` - Clear session
- `requestPasswordReset(email)` - Send reset email
- `refreshProfile()` - Reload user profile data

**Auth Flow**:
1. User submits credentials
2. Supabase Auth validates
3. Session stored in AsyncStorage
4. User profile fetched from custom API
5. Auth state propagated via Context

### 2. Interactive Map View

**Location**: `app/(tabs)/index.tsx`

**Features**:
- Google Maps integration with custom markers
- Map pins for each photo spot
- Preview images on map markers
- Tap to view spot details
- Geolocation support
- Clustering for dense areas

**Data Source**: `useSpots()` hook fetches all spots from API

### 3. Spot Discovery & Browsing

**Location**: `app/(tabs)/explore.tsx`

**Features**:
- Filter spots by country and city
- Dynamic location filter dropdowns
- Real-time filtering
- List view with spot previews

**Filtering Logic**:
```typescript
// API: GET /api/spots?country=X&city=Y
getSpots({ country?: string, city?: string })
```

### 4. Spot Details View

**Location**: `app/spot/[id].tsx`

**Features**:
- High-resolution spot image
- Spot name, city, country
- Description and photography tips
- GPS coordinates
- Google Maps navigation button
- Like/save count display
- Favourite/unfavourite toggle
- Report content option

**Data Loading**:
```typescript
// Fetch spot by ID
const spot = useSpot(id)

// Check if user has favourited
const isFavourite = checkIfFavourite(userId, spotId)

// Get favourite count
const count = getFavouriteCount(spotId)
```

### 5. Add New Spot

**Location**: `app/(tabs)/addSpot.tsx`, `app/add-spot/*`

**Multi-step Process**:
1. **Photo Selection**: Use device camera or photo library
2. **Image Upload**: Compress and upload to Cloudinary
3. **Location Input**:
   - Manual entry (city, country)
   - GPS coordinates from EXIF or device location
4. **Spot Details**:
   - Spot name
   - Description
   - Photography tips
5. **Submit**: Create spot via API

**Technical Flow**:
```typescript
// 1. Get Cloudinary signature from server
const signature = await getCloudinarySignature()

// 2. Compress image
const compressed = await compressImage(image)

// 3. Upload to Cloudinary
const uploadedUrl = await uploadToCloudinary(compressed, signature)

// 4. Create spot record
await createSpot({
  name, city, country, description, photo_tips,
  image: uploadedUrl, latitude, longitude, author_id
})
```

**Content Moderation**: New spots have `accepted: false` until reviewed by moderators.

### 6. Favourites System

**Location**: `hooks/useFavourites.ts`, `lib/api/favourites.ts`

**Features**:
- Add/remove spots from favourites
- View all saved spots in dedicated tab
- Track favourite count per spot
- Real-time favourite status updates

**API Endpoints**:
- `POST /api/favourites` - Add to favourites
- `GET /api/favourites/:userId` - Get user's favourites
- `GET /api/favourites/check?userId=X&spotId=Y` - Check status
- `GET /api/favourites/count/:spotId` - Get count

### 7. User Profile

**Location**: `app/(tabs)/profile.tsx`

**Features**:
- Username and avatar display
- User statistics:
  - Number of spots contributed
  - Number of favourites saved
- Sign out functionality

**Data Source**: `useAuth()` context provides profile data

### 8. Content Moderation

**Location**: `lib/api/moderation.ts`, `components/ReportModal.tsx`

**Features**:
- Report inappropriate content
- Reason selection for reports
- Admin approval system for new spots

**Workflow**:
1. User reports a spot with reason
2. Report submitted to moderation API
3. Moderators review flagged content
4. New spots require approval before appearing on map

---

## Data Models

### Spot Interface
```typescript
interface Spot {
  id: string;              // Unique identifier
  accepted: boolean;       // Moderation status
  name: string;            // Spot name
  city: string;            // City name
  country: string;         // Country name
  photo_tips: string;      // Photography advice
  description: string;     // Detailed description
  image: string;           // Cloudinary URL
  latitude: number;        // GPS latitude
  longitude: number;       // GPS longitude
  author_id: string;       // Creator user ID
}
```

### Profile Interface
```typescript
interface Profile {
  id: string;              // User ID (from Supabase Auth)
  username: string;        // Display name
  avatar_url: string | null; // Profile picture URL
}
```

---

## API Integration

### Backend Server
The app communicates with a custom backend server via REST API:

**Base URL**: `process.env.EXPO_PUBLIC_NATIVE_SERVER_URL`

### Spot Endpoints
- `GET /api/spots` - Fetch all spots (with optional filters)
- `GET /api/spots/spot/:id` - Fetch single spot
- `POST /api/spots` - Create new spot
- `GET /api/spots/countries` - Get unique countries
- `GET /api/spots/cities?country=X` - Get cities in country
- `GET /api/spots/count/:userId` - Get user's spot count

### Favourites Endpoints
- `POST /api/favourites` - Add to favourites
- `GET /api/favourites/:userId` - Get user's favourites
- `GET /api/favourites/check` - Check favourite status
- `GET /api/favourites/count/:spotId` - Get favourite count

### User Endpoints
- `GET /api/users/:userId` - Get user profile

### Cloudinary Endpoints
- `GET /api/cloudinary/sign` - Get upload signature

### Moderation Endpoints
- `POST /api/moderation/report` - Report content

---

## Image Handling

### Cloudinary Integration

**Flow**:
1. User selects image from device
2. Image compressed locally (`utils/compressImage.ts`)
3. Request server-signed upload signature
4. Upload to Cloudinary with signature
5. Store Cloudinary URL in database

**Compression Settings**:
- Quality: 0.7
- Resize to max dimension while maintaining aspect ratio

**Security**:
- All uploads require server-side signatures
- Prevents unauthorized uploads
- Folder organization by resource type

---

## Navigation Structure

### Tab Navigation

**Authenticated Users**:
1. **Map** (index) - Main map view with all spots
2. **Explore** - Filtered browsing
3. **Add Spot** - Create new spot
4. **Saved** - User's favourites
5. **Profile** - User account

**Unauthenticated Users**:
1. **Map** (index) - Main map view (read-only)
2. **Login** - Authentication screen

**Protected Routes**: Explore, Add Spot, Saved, and Profile tabs are only accessible to authenticated users via `<Tabs.Protected guard={isAuthenticated}>`.

---

## State Management

### React Context
- **AuthProvider**: Global authentication state
  - User ID, profile, loading states
  - Auth actions (sign in/up/out)
  - Session management

### Custom Hooks
- **useSpots**: Fetch and cache all spots with filtering
- **useSpot(id)**: Fetch single spot details
- **useFavourites**: Manage user's favourites
- **useAddSpot**: Handle spot creation workflow
- **useUserStats**: Fetch user statistics

### Local Storage
- **AsyncStorage**: Persist Supabase auth session
- Auto-refresh tokens on app resume

---

## Security Features

1. **Authentication**:
   - Email verification required on signup
   - Secure password hashing (Supabase)
   - Session tokens with auto-refresh

2. **Content Moderation**:
   - All new spots require approval (`accepted: false`)
   - User reporting system
   - Admin review workflow

3. **Image Uploads**:
   - Server-side signature generation
   - Prevents direct uploads to Cloudinary
   - Malicious file prevention

4. **API Security**:
   - Service role key stored in environment variables
   - Supabase Row Level Security (RLS) policies

---

## Environment Variables

Required in `.env`:
```bash
EXPO_PUBLIC_NATIVE_SUPABASE_URL=<Supabase project URL>
EXPO_PUBLIC_NATIVE_SUPABASE_SERVICE_ROLE_KEY=<Supabase service key>
EXPO_PUBLIC_NATIVE_SERVER_URL=<Custom API server URL>
```

Google Maps API Key configured in `app.json`:
```json
{
  "ios": {
    "config": {
      "googleMapsApiKey": "AIzaSyA9q2rheHLUpiVxD5CSY7YiDkJgbksZbmE"
    }
  }
}
```

---

## Future Roadmap

Based on the README and codebase analysis:

1. **Community Features**:
   - Photography challenges
   - User profiles with portfolios
   - Social features (comments, shares)

2. **Discovery Enhancements**:
   - Advanced search and filtering
   - Category tags (landscape, architecture, street art, etc.)
   - Nearby spots based on user location

3. **Offline Support**:
   - Download spots for offline access
   - Offline map caching

4. **Gamification**:
   - Badges for spot contributions
   - Leaderboards
   - Achievement system

---

## Key Files Reference

### Authentication
- `provider/AuthProvider.tsx:116` - `signIn` function
- `provider/AuthProvider.tsx:142` - `signUp` function
- `app/(tabs)/login.tsx` - Login UI

### Spots Management
- `lib/api/spots.ts:5` - `getSpots` with filters
- `lib/api/spots.ts:21` - `getSpotById`
- `lib/api/spots.ts:26` - `createSpot`
- `hooks/useSpots.ts` - Spots data hook
- `hooks/useAddSpot.ts` - Add spot hook

### Favourites
- `lib/api/favourites.ts:7` - `addToFavourites`
- `lib/api/favourites.ts:15` - `getFavouriteSpots`
- `hooks/useFavourites.ts` - Favourites state management

### Navigation
- `app/(tabs)/_layout.tsx:9` - Tab layout configuration
- `app/_layout.tsx` - Root layout with AuthProvider

### Image Handling
- `lib/api/cloudinary.ts:14` - Get upload signature
- `utils/compressImage.ts` - Image compression utility
- `utils/cloudinary.ts` - Cloudinary helpers

---

## Development Commands

```bash
# Start Expo development server
npm start

# Start web version
npm run web

# Run linter
npm run lint

# Reset project (clean setup)
npm run reset-project
```

---

## Platform Support

- **iOS**: Full support (App Store ready)
- **Android**: Full support (adaptive icons, edge-to-edge)
- **Web**: Metro bundler with static output

---

## Notable Implementation Details

1. **Typed Routes**: Expo Router's experimental typed routes enabled for type-safe navigation
2. **New Architecture**: React Native's new architecture enabled (`newArchEnabled: true`)
3. **Dark Mode**: Automatic UI style adaptation
4. **Tab Protection**: Dynamic tab visibility based on auth state
5. **Session Management**: Auto-refresh on app state change (foreground/background)
6. **Form Validation**: Client-side validation with detailed error messages
7. **Image Optimization**: Compression before upload to reduce bandwidth

---

## Summary

SpotShot is a well-architected mobile application that combines modern React Native development practices with robust backend services. The app provides a seamless experience for discovering and sharing photo locations, with careful attention to user authentication, content moderation, and image handling. The codebase follows clean separation of concerns with dedicated layers for UI components, business logic (hooks), API services, and state management.
