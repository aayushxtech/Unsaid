# Unsaid Frontend

## Technologies Used

This project utilizes the following modern technologies:

### Core Framework
- **React** (v18.2.0) - A JavaScript library for building user interfaces
- **React DOM** (v18.2.0) - React package for web applications
- **React Router DOM** (v6.22.3) - Declarative routing for React applications

### Styling Solutions
#### Tailwind CSS
- **Tailwind CSS** (v3.4.1) - Utility-first CSS framework
- **PostCSS** (v8.4.35) - Tool for transforming CSS with JavaScript
- **Autoprefixer** (v10.4.19) - PostCSS plugin to parse CSS and add vendor prefixes

#### Material UI
- **@mui/material** (v5.15.11) - React components implementing Material Design
- **@mui/icons-material** (v5.15.11) - Material Design icons
- **@emotion/react** (v11.11.4) - CSS-in-JS library
- **@emotion/styled** (v11.11.0) - Styled-components-like API for Emotion

### Backend Integration
- **Supabase JS** (v2.39.7) - Supabase JavaScript client library
- **Supabase Auth Helpers** (v0.9.1) - Authentication utilities for React

### Development Tools
- **Vite** (v5.1.4) - Next generation frontend toolingk
- **ESLint** (v8.57.0) - Tool for identifying and fixing code issues
- **Prettier** (v3.2.5) - Code formatter
- **@vitejs/plugin-react** (v4.2.1) - Official React plugin for Vite

### Additional Utilities
- **date-fns** (v3.3.1) - Modern JavaScript date utility library
- **react-icons** (v5.0.1) - Popular icons for React applications

## Getting Started

1. **Clone the repository**
```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Update the `.env` file with your Supabase credentials

4. **Start development server**
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React context providers
│   ├── lib/           # Utility functions and helpers
│   ├── pages/         # Page components
│   ├── styles/        # Global styles and Tailwind config
│   └── App.jsx        # Root component
├── public/            # Static assets
└── vite.config.js     # Vite configuration
```

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request


