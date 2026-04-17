import type { LucideIcon } from 'lucide-react';

export type EmojiCategory =
  | 'Smileys & People'
  | 'Hearts & Love'
  | 'Animals & Nature'
  | 'Food & Drink'
  | 'Travel & Places'
  | 'Activities'
  | 'Objects'
  | 'Symbols';

export interface EmojiEntry {
  /** Human-readable display name */
  name: string;
  /** The Lucide icon component */
  icon: LucideIcon;
  /** Search keywords for filtering */
  keywords: string[];
  /** Category this emoji belongs to */
  category: EmojiCategory;
}

export interface EmojiSelectResult {
  /** Human-readable display name */
  name: string;
  /** Complete SVG markup string */
  svg: string;
}

export interface EmojiPickerProps {
  /** Callback fired when an emoji is selected */
  onSelect: (emoji: EmojiSelectResult) => void;
  /** Color theme. 'auto' follows prefers-color-scheme. Default: 'light' */
  theme?: 'light' | 'dark' | 'auto';
  /** Width of the picker. Default: 320 */
  width?: number | string;
  /** Height of the picker. Default: 450 */
  height?: number | string;
  /** Number of columns in the emoji grid. Default: 6 */
  columns?: number;
  /** Size of each emoji icon in pixels. Default: 24 */
  iconSize?: number;
  /** Stroke width of the Lucide icons. Default: 1.75 */
  iconStrokeWidth?: number;
  /** Additional CSS class name */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}
