## Toast System

Lightweight, framework-friendly toast notifications with positions, variants, duration, and an accessible UI. Includes a simple API and an embeddable `ToastContainer` for rendering.

- Live Demo: [toast-system.vercel.app](https://toast-system.vercel.app/)

### Features

- Success, Error, Warning, Info variants
- Six positions: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
- Auto-dismiss with progress bar and smooth transitions
- Programmatic API: `toast.success`, `toast.error`, `toast.warning`, `toast.info`
- Accessible markup with keyboard and screen-reader friendly controls
- Ship-ready styling with Tailwind CSS and SVG icons via SVGR

### Quickstart

1. Install dependencies

```bash
# using yarn
yarn

# or npm
npm install

# or pnpm
pnpm install
```

2. Run the dev server

```bash
yarn dev
# npm run dev / pnpm dev also work
```

Open http://localhost:3000 to view the demo page.

### Usage

Add the `ToastContainer` once near the root of your app (e.g., in a layout or top-level page), then trigger toasts via the `toast` API from anywhere in your client components.

```tsx
import { toast, ToastContainer } from "@/components/toast";

// Render once in your app root
function AppRoot() {
  return (
    <>
      {/* your routes/components */}
      <ToastContainer />
    </>
  );
}

// Trigger a toast from any client component
toast.success("Success", "This is a success message", {
  position: "top-right",
  variant: "success",
  duration: 3000,
});
```

For an interactive example and controls, see the live demo: [toast-system.vercel.app](https://toast-system.vercel.app/).

### API

Exports from `@/components/toast`:

- `toast.success(title: string, description?: string, options?: ToastOptions)`
- `toast.error(title: string, description?: string, options?: ToastOptions)`
- `toast.warning(title: string, description?: string, options?: ToastOptions)`
- `toast.info(title: string, description?: string, options?: ToastOptions)`
- `ToastContainer`: React component that renders toasts grouped by position.

Types:

```ts
type ToastVariant = "success" | "error" | "warning" | "info";
type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

interface ToastOptions {
  variant?: ToastVariant; // default: "success"
  position?: ToastPosition; // default: "top-right"
  duration?: number; // default: 3000 (ms)
}
```

Notes:

- The `ToastContainer` must be mounted somewhere in your client tree for toasts to render.
- Clicking a toast or its close button dismisses it early.
- Duration is respected even across quick page updates thanks to stored `createdAt` timestamps.

### Configuration

SVG icons are imported as React components using SVGR. This project includes the necessary config in `next.config.ts`:

```ts
// next.config.ts
webpack: (config) => {
  config.module.rules.push({
    test: /\.svg$/,
    use: ["@svgr/webpack"],
  });
  return config;
};
```

### Project Structure

```
assets/
  icons/
    error-icon.svg
    info-icon.svg
    success-icon.svg
    warning-icon.svg
components/
  toast.tsx         # toast API, ToastContainer, UI
app/
  page.tsx          # interactive demo page
```

### Scripts

```bash
yarn dev     # start dev server
yarn build   # build for production
yarn start   # start production server
yarn lint    # run linter
```

### Acknowledgements

- Built with Next.js and Tailwind CSS
- Demo and documentation available at [toast-system.vercel.app](https://toast-system.vercel.app/)

### Author

- **Saif Mohamed** — [LinkedIn](https://linkedin.com/in/saifmohamedsv)
