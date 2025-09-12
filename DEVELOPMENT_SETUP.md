# SkyCamp Development Setup Guide

This guide helps team members set up the SkyCamp project for development without needing to modify any URLs or configurations.

## Project Structure

```
htdocs/
└── skycamp/
    ├── skycamp-frontend/   (Vite React app)
    └── skycamp-backend/    (PHP backend, public/index.php is entrypoint)
```

## Prerequisites

- **XAMPP** installed and running (Apache + MySQL)
- **Node.js** (v16 or higher)
- **npm** or **yarn**

## Development Setup

### 1. Clone and Setup Backend

1. Clone the repository to `htdocs/skycamp/`
2. Ensure XAMPP is running
3. Import the database from `skycamp-backend/sql/skycamp.sql`
4. Verify backend is accessible at: `http://localhost/skycamp/skycamp-backend/public`

### 2. Setup Frontend

1. Navigate to the frontend directory:

   ```bash
   cd skycamp-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. The app will run at: `http://localhost:5173`

## How It Works

### Vite Proxy Configuration

The frontend uses Vite's proxy feature to handle API requests:

```javascript
// vite.config.js
server: {
  proxy: {
    "/api": {
      target: "http://localhost/skycamp/skycamp-backend/public",
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### Centralized API Client

All API calls go through the centralized `src/api.js`:

```javascript
// src/api.js
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const http = axios.create({
  baseURL,
  withCredentials: true, // Enables session cookies
  timeout: 15000,
});
```

### Request Flow

1. Frontend makes request to `/api/auth/login`
2. Vite proxy forwards to `http://localhost/skycamp/skycamp-backend/public/api/auth/login`
3. PHP backend processes request and sets session cookies
4. Response includes cookies that persist for subsequent requests

## Benefits

✅ **No URL Configuration**: Team members can clone and run without changing any URLs  
✅ **Session Persistence**: Cookies work on first login (no CORS issues)  
✅ **Hot Reload**: Frontend changes reflect immediately  
✅ **Single Origin**: All requests appear to come from the same origin

## API Usage Examples

### Authentication

```javascript
import { API } from "./api";

// Login
const result = await API.auth.login({ email, password });

// Register
const result = await API.auth.register(formData);

// Check session
const result = await API.auth.me();
```

### Other Endpoints

```javascript
// Destinations
const destinations = await API.destinations.list();
const result = await API.destinations.create(formData);

// Reviews
const result = await API.reviews.addDestinationReview(data);
const result = await API.reviews.addServiceProviderReview(data);

// Service Providers
const providers = await API.serviceProviders.list();
```

## Production Deployment

### Option 1: Build and Copy to Backend

```bash
# Build frontend
npm run build

# Copy dist/ contents to skycamp-backend/public/
# This serves everything from Apache at http://localhost/skycamp/
```

### Option 2: Build and Copy to Root

```bash
# Build frontend
npm run build

# Copy dist/ contents to htdocs/skycamp/
# This serves everything from Apache at http://localhost/skycamp/
```

## Troubleshooting

### Session Not Persisting

- Ensure XAMPP is running
- Check that backend is accessible at `http://localhost/skycamp/skycamp-backend/public`
- Verify proxy configuration in `vite.config.js`

### CORS Errors

- All API calls should use the centralized `API` object from `src/api.js`
- Never use hardcoded URLs like `http://localhost/skycamp-backend/...`
- Use relative paths like `/api/auth/login`

### Port Conflicts

- Frontend runs on port 5173 by default
- Backend runs on Apache's default port (usually 80)
- If port 5173 is busy, Vite will automatically use the next available port

## Environment Variables

You can override the API base URL by creating a `.env.development` file:

```bash
# .env.development
VITE_API_BASE_URL=http://localhost/skycamp/skycamp-backend/public/api
```

However, this is **not recommended** as it breaks the proxy setup and causes CORS issues.

## Team Workflow

1. **Development**: Always use `npm run dev` for frontend development
2. **Testing**: Test with the proxy setup to ensure sessions work correctly
3. **Production**: Use `npm run build` and copy to Apache for final deployment

## File Structure

```
skycamp-frontend/
├── src/
│   ├── api.js              # Centralized API client
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── pages/             # Page components
├── vite.config.js         # Vite configuration with proxy
├── package.json           # Dependencies and scripts
└── DEVELOPMENT_SETUP.md  # This file
```

## Need Help?

- Check that XAMPP is running
- Verify backend is accessible at `http://localhost/skycamp/skycamp-backend/public`
- Ensure all API calls use the centralized `API` object
- Check browser console for any CORS or network errors
