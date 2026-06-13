# 📁 Shared UI Components Library

A centralized library of reusable, **Standalone UI Components** built for **Angular v19/v20**. This library leverages **Angular Signals** for optimal reactivity and state management, and it is fully styled with **Tailwind CSS** to ensure a consistent, responsive, and accessible user experience across the entire application.

---

## 🛠 Setup & Integration

### 1. Configure Path Alias
To avoid messy relative imports (e.g., `../../../shared`), ensure you have a path alias mapped in your `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@shared": ["src/app/shared/index.ts"]
    }
  }
}
