<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Recommended Application Structure

For a more maintainable and scalable React application, we recommend the following folder structure:

```
fonsave-frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/
│   │   ├── common/         # Reusable components across features
│   │   ├── layout/         # Layout components (Header, Footer, Sidebar)
│   │   └── ui/             # UI components (buttons, inputs, etc.)
│   ├── features/           # Feature-based modules
│   │   ├── auth/           # Authentication feature
│   │   │   ├── components/ # Feature-specific components
│   │   │   ├── api/        # API calls related to this feature
│   │   │   ├── hooks/      # Feature-specific hooks
│   │   │   ├── types/      # TypeScript types
│   │   │   ├── utils/      # Utility functions
│   │   │   └── index.ts    # Feature entry point
│   │   ├── dashboard/      # Dashboard feature
│   │   ├── timeTracking/   # Time tracking feature
│   │   └── reports/        # Reporting feature
│   ├── hooks/              # Global custom hooks
│   ├── lib/                # Utility libraries
│   ├── services/           # API services
│   │   ├── api.ts          # Base API configuration
│   │   ├── auth.service.ts # Auth related API calls
│   │   └── ...
│   ├── store/              # State management
│   │   ├── slices/         # Redux slices or context providers
│   │   └── index.ts        # Store configuration
│   ├── types/              # Global TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── routes/             # Application routes
│   │   ├── ProtectedRoute.tsx
│   │   ├── PublicRoute.tsx
│   │   └── index.tsx       # Main routing configuration
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables
└── ... (config files)
```

### Key Benefits of This Structure:

1. **Feature-based organization**: Group related components, hooks, services, and utilities by feature, making it easier to understand and maintain code related to specific business domains.

2. **Clear separation of concerns**: Divide components into common reusable components and feature-specific components.

3. **Services layer**: Centralize API calls in a dedicated service directory for better maintainability.

4. **Routing structure**: Organize application routing in a dedicated folder.

5. **State management**: Structured approach to state management, whether using Context API, Redux, or other libraries.



### Additions Features
1. auth screens (2FA, social-callback)
Design a minimal, mobile-first homepage for a tech service. The page should include a central IMEI input box with a search button, space for displaying clean or stolen status, and call-to-actions for registering a phone and user sign-up. Style should be clean, flat UI with lots of white space, rounded cards, blue and gray color scheme, and subtle icons for phone, shield, and eye scanning.

use available ui templates if needed
=======
# FonSave Frontend

FonSave is a web platform that allows users to register, manage their devices, and make secure payments.  
This repository contains the **frontend application**, built with **Vite + React**, which communicates with the FonSave backend API.



>>>>>>> 715b85134713bf701e3369a15c194c7fa3e9132f
