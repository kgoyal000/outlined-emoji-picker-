# Outlined Emoji Picker

[![npm version](https://img.shields.io/npm/v/outlined-emoji-picker.svg)](https://www.npmjs.com/package/outlined-emoji-picker)
[![license](https://img.shields.io/npm/l/outlined-emoji-picker.svg)](https://github.com/outlined-emoji-picker/outlined-emoji-picker/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-blue.svg)](https://www.typescriptlang.org/)
[![bundle size](https://img.shields.io/bundlephobia/minzip/outlined-emoji-picker)](https://bundlephobia.com/package/outlined-emoji-picker)

A lightweight, accessible emoji picker for React that uses **outlined/stroke-style icons** from [Lucide](https://lucide.dev). Instead of copying to clipboard, it returns a complete **SVG string** you can render inline anywhere.

---

## Features

- **Outlined icon style** -- clean, consistent stroke-based icons via Lucide
- **Returns SVG strings** -- render inline with `dangerouslySetInnerHTML`, as an `<img>` data URI, or pass to any SVG consumer
- **120+ curated icons** across 8 categories: Smileys, Hearts, Animals, Food, Travel, Activities, Objects, Symbols
- **Search** by name and keywords
- **Light / Dark / Auto theming** via CSS variables
- **Keyboard accessible** -- full arrow-key navigation and ARIA labels
- **TypeScript first** -- fully typed props, events, and exports
- **Tree-shakeable** -- only ships what you use
- **Zero heavy dependencies** -- just `lucide-react` as a peer dependency

---

## Demo

[**Live Demo**](https://kgoyal000.github.io/outlined-emoji-picker-/) — try both standalone and popover modes in the browser.

---

## Installation

```bash
# npm
npm install outlined-emoji-picker lucide-react

# yarn
yarn add outlined-emoji-picker lucide-react

# pnpm
pnpm add outlined-emoji-picker lucide-react
```

> **Note:** `react` and `react-dom` (>=17) are peer dependencies. `lucide-react` (>=0.300.0) is a regular dependency.

---

## Quick Start

```tsx
import { EmojiPicker } from 'outlined-emoji-picker';
import 'outlined-emoji-picker/styles.css';

function App() {
  return (
    <EmojiPicker
      onSelect={(emoji) => {
        console.log(emoji.name); // "Smile"
        console.log(emoji.svg);  // "<svg ...>...</svg>"
      }}
    />
  );
}
```

---

### Popover Mode

Use `mode="popover"` to render the picker as a floating popover anchored to a trigger element:

```tsx
import { useState } from 'react';
import { EmojiPicker } from 'outlined-emoji-picker';
import 'outlined-emoji-picker/styles.css';

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen(!open)}>
        Pick an icon
      </button>
      {open && (
        <EmojiPicker
          mode="popover"
          onSelect={(emoji) => {
            console.log(emoji.svg);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
```

The popover positions itself above the trigger. Wrap the trigger and picker in a `position: relative` container.

---

## API

### `<EmojiPicker />` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSelect` | `(emoji: { name: string; svg: string }) => void` | **required** | Callback when an icon is clicked. Receives the icon name and complete SVG markup string. |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Color theme. `'auto'` follows `prefers-color-scheme`. |
| `width` | `number \| string` | `320` | Width of the picker container. |
| `height` | `number \| string` | `450` | Height of the picker container. |
| `columns` | `number` | `6` | Number of columns in the icon grid. |
| `iconSize` | `number` | `24` | Size (px) of each icon in the grid. |
| `iconStrokeWidth` | `number` | `1.75` | Stroke width of the Lucide icons. |
| `className` | `string` | `undefined` | Additional CSS class for the root container. |
| `style` | `React.CSSProperties` | `undefined` | Additional inline styles for the root container. |
| `mode` | `'standalone' \| 'popover'` | `'standalone'` | Display mode. `'standalone'` renders inline, `'popover'` renders as a floating popover. |
| `onClose` | `() => void` | `undefined` | Called when the popover should close (click outside, Escape key, or emoji selected). Only used in popover mode. |

### `EmojiSelectResult`

```ts
interface EmojiSelectResult {
  name: string; // Human-readable name, e.g. "Smile"
  svg: string;  // Complete SVG markup string
}
```

---

## Using the SVG Output

The `svg` string returned by `onSelect` is a complete, self-contained SVG element. Here are some ways to use it:

### Inline HTML (dangerouslySetInnerHTML)

```tsx
function SelectedIcon({ svg }: { svg: string }) {
  return <span dangerouslySetInnerHTML={{ __html: svg }} />;
}
```

### As an `<img>` data URI

```tsx
function SelectedIcon({ svg }: { svg: string }) {
  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return <img src={dataUri} alt="Selected icon" width={24} height={24} />;
}
```

### Store in a database

Save the SVG string directly and render it later without needing `lucide-react` at render time.

---

## Theming

### Built-in themes

```tsx
<EmojiPicker theme="light" onSelect={handleSelect} />
<EmojiPicker theme="dark" onSelect={handleSelect} />
<EmojiPicker theme="auto" onSelect={handleSelect} />  {/* follows system */}
```

### Custom theming with CSS variables

Override any of these CSS custom properties on the `.ep-container` class:

```css
.ep-container {
  --ep-bg: #ffffff;
  --ep-bg-secondary: #f5f5f5;
  --ep-text: #1a1a1a;
  --ep-text-secondary: #6b7280;
  --ep-border: #e5e7eb;
  --ep-hover: #f0f0f0;
  --ep-active: #dbeafe;
  --ep-active-border: #93c5fd;
  --ep-tab-active: #3b82f6;
  --ep-tab-active-bg: #eff6ff;
  --ep-search-bg: #f3f4f6;
  --ep-search-focus: #3b82f6;
  --ep-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}
```

---

## Customization

### Adjust grid density

```tsx
<EmojiPicker columns={5} iconSize={28} onSelect={handleSelect} />
```

### Thinner or thicker strokes

```tsx
<EmojiPicker iconStrokeWidth={1.25} onSelect={handleSelect} /> {/* thinner */}
<EmojiPicker iconStrokeWidth={2.5} onSelect={handleSelect} />  {/* thicker */}
```

### Custom size

```tsx
<EmojiPicker width={400} height={500} onSelect={handleSelect} />
<EmojiPicker width="100%" height="100%" onSelect={handleSelect} />
```

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Arrow keys | Navigate the icon grid |
| Enter / Space | Select the focused icon |
| Escape | Return focus to the search input |
| Tab | Move between search, category tabs, and grid |

---

## Exports

In addition to the main component, you can import the icon data for custom use:

```ts
import { emojiData, CATEGORIES, CATEGORY_ICONS } from 'outlined-emoji-picker';
import type { EmojiEntry, EmojiCategory, EmojiPickerProps, EmojiSelectResult } from 'outlined-emoji-picker';
```

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Install dependencies (`npm install`)
4. Make your changes
5. Build (`npm run build`)
6. Commit and push
7. Open a pull request

---

## License

[MIT](./LICENSE)
