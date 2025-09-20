# 🔄 Loading Component System - Complete Guide

A comprehensive, reusable loading system that provides consistent loading states across your entire application.

## 🎯 **Key Features**

- **8 Different Variants**: Spinner, dots, pulse, bars, skeleton, card, page, and overlay
- **5 Size Options**: xs, sm, md, lg, xl
- **4 Color Themes**: primary, secondary, accent, muted
- **Framer Motion Animations**: Smooth, performant animations
- **TypeScript Support**: Full type safety
- **Responsive Design**: Works on all screen sizes
- **Consistent Theming**: Uses your CSS variables

---

## 🚀 **Basic Usage**

### **Import Options**

```typescript
// Main component with all variants
import { Loading } from "@/components/ui/Loading";

// Specialized components
import {
  LoadingSpinner,
  LoadingDots,
  LoadingCard,
  LoadingPage,
  LoadingOverlay,
} from "@/components/ui/Loading";
```

### **Simple Loading States**

```typescript
// Basic spinner
<Loading />

// Spinner with text
<Loading text="Loading builds..." showText />

// Different variants
<Loading variant="dots" size="lg" />
<Loading variant="pulse" color="accent" />
<Loading variant="bars" size="sm" />
```

---

## 🎨 **All Variants & Examples**

### **1. Spinner Loading**

```typescript
// Basic spinner
<Loading variant="spinner" />

// Large spinner with text
<Loading
  variant="spinner"
  size="lg"
  text="Saving build..."
  showText
/>

// Custom color spinner
<Loading
  variant="spinner"
  spinnerColor="#ff6b6b"
/>
```

### **2. Dots Loading**

```typescript
// Perfect for inline loading
<Loading variant="dots" size="sm" />

// With text
<Loading
  variant="dots"
  text="Processing..."
  showText
  color="accent"
/>
```

### **3. Pulse Loading**

```typescript
// Subtle breathing effect
<Loading variant="pulse" size="md" />

// Good for buttons
<button disabled>
  <Loading variant="pulse" size="xs" />
  Saving...
</button>
```

### **4. Bars Loading**

```typescript
// Audio visualizer style
<Loading variant="bars" size="lg" />

// Great for data loading
<Loading
  variant="bars"
  text="Loading statistics..."
  showText
/>
```

### **5. Card Skeleton**

```typescript
// Perfect for build cards
<LoadingCard />;

// Multiple cards
{
  loading && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}
```

### **6. Page Skeleton**

```typescript
// Full page loading
{
  loading && <LoadingPage />;
}
```

### **7. Custom Skeleton**

```typescript
// Custom skeleton shapes
<Loading
  variant="skeleton"
  className="h-32 w-full rounded-lg"
/>

<Loading
  variant="skeleton"
  className="h-4 w-3/4 mb-2"
/>
```

### **8. Loading Overlay**

```typescript
// Overlay on existing content
<LoadingOverlay
  show={isLoading}
  variant="spinner"
  text="Updating build..."
  showText
>
  <BuildCard build={build} />
</LoadingOverlay>
```

---

## 📱 **Real-World Usage Examples**

### **Gallery Page Loading**

```typescript
export default function GalleryPage() {
  const { builds, loading, error } = useBuilds();
  const { user, isLoading: authLoading } = useAuthStore();

  // Auth loading
  if (authLoading) {
    return (
      <Loading
        variant="spinner"
        size="lg"
        fullScreen
        text="Authenticating..."
        showText
      />
    );
  }

  // Builds loading
  if (loading) {
    return (
      <div className="container">
        <h1>My Builds</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {builds.map((build) => (
        <BuildCard key={build.id} build={build} />
      ))}
    </div>
  );
}
```

### **Form Submission Loading**

```typescript
export default function SaveBuildDialog() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveBuild(buildData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-2"
      >
        {isSaving && <Loading variant="dots" size="sm" />}
        {isSaving ? "Saving..." : "Save Build"}
      </button>
    </div>
  );
}
```

### **Data Fetching with Overlay**

```typescript
export default function ModSelector() {
  const [isLoadingMods, setIsLoadingMods] = useState(false);
  const { mods } = useModStore();

  return (
    <LoadingOverlay
      show={isLoadingMods}
      variant="spinner"
      text="Loading compatible mods..."
      showText
    >
      <div className="mods-grid">
        {mods.map((mod) => (
          <ModCard key={mod.id} mod={mod} />
        ))}
      </div>
    </LoadingOverlay>
  );
}
```

### **API Call Loading States**

```typescript
export default function useApiWithLoading() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      return await response.json();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const LoadingComponent = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <Loading variant="spinner" text="Loading..." showText />;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    return <>{children}</>;
  };

  return { loading, error, apiCall, LoadingComponent };
}
```

---

## 🎛️ **Configuration Options**

### **Props Interface**

```typescript
interface LoadingProps {
  variant?: "spinner" | "dots" | "pulse" | "skeleton" | "bars" | "card" | "page";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "accent" | "muted";
  text?: string;
  showText?: boolean;
  className?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  spinnerColor?: string; // Custom hex color
}
```

### **Size Reference**

```typescript
xs: { size: "w-4 h-4", text: "text-xs" }    // 16px
sm: { size: "w-6 h-6", text: "text-sm" }    // 24px
md: { size: "w-8 h-8", text: "text-base" }  // 32px (default)
lg: { size: "w-12 h-12", text: "text-lg" }  // 48px
xl: { size: "w-16 h-16", text: "text-xl" }  // 64px
```

### **Color Reference**

```typescript
primary: "text-[var(--accent)]"; // Your accent color
secondary: "text-[var(--text2)]"; // Secondary text
accent: "text-[var(--accent)]"; // Same as primary
muted: "text-[var(--text3)]"; // Muted text
```

---

## 🔧 **Advanced Usage**

### **Conditional Loading with Different Variants**

```typescript
function SmartLoading({
  type,
  isLoading,
}: {
  type: string;
  isLoading: boolean;
}) {
  if (!isLoading) return null;

  switch (type) {
    case "auth":
      return (
        <Loading
          variant="spinner"
          size="lg"
          fullScreen
          text="Authenticating..."
          showText
        />
      );
    case "data":
      return (
        <Loading variant="dots" size="md" text="Loading data..." showText />
      );
    case "save":
      return <Loading variant="pulse" size="sm" />;
    case "cards":
      return <LoadingCard />;
    default:
      return <Loading variant="spinner" />;
  }
}
```

### **Loading States Hook**

```typescript
function useLoadingStates() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: loading }));
  };

  const isLoading = (key: string) => loadingStates[key] || false;
  const isAnyLoading = Object.values(loadingStates).some(Boolean);

  return { setLoading, isLoading, isAnyLoading };
}

// Usage
function MyComponent() {
  const { setLoading, isLoading, isAnyLoading } = useLoadingStates();

  const handleSave = async () => {
    setLoading("save", true);
    try {
      await saveBuild();
    } finally {
      setLoading("save", false);
    }
  };

  return (
    <div>
      {isLoading("save") && (
        <Loading variant="pulse" text="Saving..." showText />
      )}
      <button onClick={handleSave} disabled={isAnyLoading}>
        Save Build
      </button>
    </div>
  );
}
```

### **Global Loading Provider**

```typescript
// contexts/LoadingContext.tsx
const LoadingContext = createContext<{
  showGlobalLoading: (text?: string) => void;
  hideGlobalLoading: () => void;
}>({});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [globalLoading, setGlobalLoading] = useState<{
    show: boolean;
    text?: string;
  }>({ show: false });

  const showGlobalLoading = (text?: string) => {
    setGlobalLoading({ show: true, text });
  };

  const hideGlobalLoading = () => {
    setGlobalLoading({ show: false });
  };

  return (
    <LoadingContext.Provider value={{ showGlobalLoading, hideGlobalLoading }}>
      {children}
      {globalLoading.show && (
        <Loading
          variant="spinner"
          size="lg"
          fullScreen
          overlay
          text={globalLoading.text}
          showText
        />
      )}
    </LoadingContext.Provider>
  );
}
```

---

## ✅ **Migration from Old Loading**

### **Before (Manual Loading)**

```typescript
// ❌ Old way - inconsistent, repetitive
{
  loading && (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
}

// ❌ Old skeleton - manual HTML
<div className="animate-pulse">
  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
</div>;
```

### **After (Loading Component)**

```typescript
// ✅ New way - consistent, reusable
{
  loading && <Loading variant="spinner" size="md" />;
}

// ✅ New skeleton - pre-built component
{
  loading && <LoadingCard />;
}
```

---

## 🎨 **Customization**

### **Custom Colors**

```typescript
// Use custom hex colors
<Loading variant="spinner" spinnerColor="#ff6b6b" />

// Or use CSS variables
<Loading variant="dots" className="text-red-500" />
```

### **Custom Skeleton Shapes**

```typescript
// Profile skeleton
<div className="flex items-center gap-4">
  <Loading variant="skeleton" className="w-12 h-12 rounded-full" />
  <div className="flex-1">
    <Loading variant="skeleton" className="h-4 w-32 mb-2" />
    <Loading variant="skeleton" className="h-3 w-24" />
  </div>
</div>

// Table skeleton
<div className="space-y-2">
  {Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="flex gap-4">
      <Loading variant="skeleton" className="h-4 w-16" />
      <Loading variant="skeleton" className="h-4 flex-1" />
      <Loading variant="skeleton" className="h-4 w-20" />
    </div>
  ))}
</div>
```

---

## 🚀 **Performance Tips**

1. **Use appropriate variants**: Cards for lists, spinners for actions, skeletons for content
2. **Size matters**: Use smaller sizes for inline loading, larger for full-screen
3. **Avoid nested overlays**: Don't stack multiple loading overlays
4. **Conditional rendering**: Only render loading components when actually loading
5. **Preload skeletons**: Show content structure immediately while data loads

This loading system provides everything you need for consistent, beautiful loading states throughout your application! 🎉
