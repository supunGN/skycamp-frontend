# SkyCamp Frontend

React + Vite frontend for the SkyCamp camping platform.

## Quick Start

For detailed setup instructions, see [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md).

### Prerequisites

- XAMPP running
- Node.js (v16+)

### Development

```bash
npm install
npm run dev
```

The app will run at `http://localhost:5173` with automatic proxy to the PHP backend.

### Production Build

```bash
npm run build
```

## Project Structure

- `src/api.js` - Centralized API client with Axios
- `src/App.jsx` - Main application component
- `src/pages/` - Page components
- `vite.config.js` - Vite configuration with proxy setup

## API Usage

All API calls should use the centralized `API` object:

```javascript
import { API } from "./api";

// Authentication
const result = await API.auth.login({ email, password });
const result = await API.auth.register(formData);

// Other endpoints
const destinations = await API.destinations.list();
const providers = await API.serviceProviders.list();
```

## Team Development

This setup ensures:

- ✅ No URL configuration needed
- ✅ Session cookies work on first login
- ✅ Hot reload during development
- ✅ Single origin for production deployment

See [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) for complete setup instructions.
