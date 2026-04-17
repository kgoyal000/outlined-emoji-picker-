import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Search, ChevronLeft, ChevronRight, ChevronRightIcon } from 'lucide-react';
import { emojiData, CATEGORIES, CATEGORY_ICONS } from './emoji-data';
import type { EmojiPickerProps, EmojiEntry, EmojiCategory } from './types';

/**
 * Renders a Lucide icon component to a complete SVG string.
 */
function iconToSvg(
  Icon: EmojiEntry['icon'],
  size: number,
  strokeWidth: number
): string {
  return renderToStaticMarkup(
    React.createElement(Icon, {
      size,
      strokeWidth,
      xmlns: 'http://www.w3.org/2000/svg',
    })
  );
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onSelect,
  theme = 'light',
  width = 320,
  height = 450,
  columns = 6,
  iconSize = 24,
  iconStrokeWidth = 1.75,
  className,
  style,
  mode = 'standalone',
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<EmojiCategory>(CATEGORIES[0]);
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiEntry | null>(null);
  const [focusIndex, setFocusIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Determine theme class
  const themeClass = useMemo(() => {
    if (theme === 'auto') return 'ep-theme-auto';
    if (theme === 'dark') return 'ep-theme-dark';
    return 'ep-theme-light';
  }, [theme]);

  // Filter emojis based on search
  const filteredEmojis = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) {
      return emojiData.filter((e) => e.category === activeCategory);
    }
    return emojiData.filter(
      (e) =>
        e.name.toLowerCase().includes(query) ||
        e.keywords.some((k) => k.includes(query))
    );
  }, [search, activeCategory]);

  // Handle emoji click
  const handleSelect = useCallback(
    (entry: EmojiEntry) => {
      setSelectedEmoji(entry);
      const svg = iconToSvg(entry.icon, iconSize, iconStrokeWidth);
      onSelect({ name: entry.name, svg });
      if (mode === 'popover') {
        onClose?.();
      }
    },
    [onSelect, iconSize, iconStrokeWidth, mode, onClose]
  );

  // Handle category tab click
  const handleCategoryClick = useCallback((category: EmojiCategory) => {
    setActiveCategory(category);
    setSearch('');
    setFocusIndex(-1);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const total = filteredEmojis.length;
      if (total === 0) return;

      let newIndex = focusIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          newIndex = focusIndex < total - 1 ? focusIndex + 1 : 0;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = focusIndex > 0 ? focusIndex - 1 : total - 1;
          break;
        case 'ArrowDown':
          e.preventDefault();
          newIndex = focusIndex + columns < total ? focusIndex + columns : focusIndex;
          break;
        case 'ArrowUp':
          e.preventDefault();
          newIndex = focusIndex - columns >= 0 ? focusIndex - columns : focusIndex;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusIndex >= 0 && focusIndex < total) {
            handleSelect(filteredEmojis[focusIndex]);
          }
          return;
        case 'Escape':
          e.preventDefault();
          searchRef.current?.focus();
          setFocusIndex(-1);
          return;
        default:
          return;
      }

      setFocusIndex(newIndex);
    },
    [focusIndex, filteredEmojis, columns, handleSelect]
  );

  // Scroll focused item into view
  useEffect(() => {
    if (focusIndex >= 0 && gridRef.current) {
      const buttons = gridRef.current.querySelectorAll<HTMLButtonElement>(
        '[data-emoji-button]'
      );
      buttons[focusIndex]?.focus();
      buttons[focusIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusIndex]);

  // Popover: click-outside detection
  useEffect(() => {
    if (mode !== 'popover' || !onClose) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [mode, onClose]);

  // Popover: Escape key to close
  useEffect(() => {
    if (mode !== 'popover' || !onClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mode, onClose]);

  // Tab scroll detection
  const checkTabScroll = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    checkTabScroll();
    el.addEventListener('scroll', checkTabScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkTabScroll);
  }, [checkTabScroll]);

  const scrollTabs = useCallback((dir: 'left' | 'right') => {
    const el = tabsRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -100 : 100, behavior: 'smooth' });
  }, []);

  // Determine which label to show
  const categoryLabel = search.trim()
    ? `SEARCH RESULTS (${filteredEmojis.length})`
    : activeCategory.toUpperCase();

  return (
    <div
      ref={containerRef}
      className={`ep-container ${themeClass}${mode === 'popover' ? ' ep-container--popover' : ''} ${className || ''}`}
      style={{ width, height, ...style }}
      role="dialog"
      aria-label="Emoji picker"
    >
      {/* Search bar — underline style */}
      <div className="ep-search-wrapper">
        <div className="ep-search-inner">
          <Search className="ep-search-icon" size={18} strokeWidth={2} aria-hidden="true" />
          <input
            ref={searchRef}
            className="ep-search-input"
            type="text"
            placeholder="Search icons..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setFocusIndex(-1);
            }}
            aria-label="Search emojis"
          />
        </div>
      </div>

      {/* Category tabs with gradient scroll indicators */}
      <div className="ep-tabs-wrapper">
        {canScrollLeft && (
          <div className="ep-tabs-arrow ep-tabs-arrow--left">
            <button onClick={() => scrollTabs('left')} type="button" aria-label="Scroll left">
              <ChevronLeft size={12} strokeWidth={2.5} />
            </button>
          </div>
        )}
        <div ref={tabsRef} className="ep-category-tabs" role="tablist" aria-label="Emoji categories">
          {CATEGORIES.map((cat) => {
            const CatIcon = CATEGORY_ICONS[cat];
            const isActive = !search.trim() && activeCategory === cat;
            return (
              <button
                key={cat}
                className={`ep-category-tab ${isActive ? 'ep-category-tab--active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
                role="tab"
                aria-selected={isActive}
                aria-label={cat}
                title={cat}
                type="button"
              >
                <CatIcon size={16} strokeWidth={1.75} />
              </button>
            );
          })}
        </div>
        {canScrollRight && (
          <div className="ep-tabs-arrow ep-tabs-arrow--right">
            <button onClick={() => scrollTabs('right')} type="button" aria-label="Scroll right">
              <ChevronRight size={12} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      {/* Category label */}
      <div className="ep-category-label" aria-live="polite">
        <ChevronRightIcon size={14} strokeWidth={2} />
        {categoryLabel}
      </div>

      {/* Emoji grid */}
      <div
        ref={gridRef}
        className="ep-grid"
        role="grid"
        aria-label="Emoji grid"
        onKeyDown={handleKeyDown}
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {filteredEmojis.length === 0 && (
          <div className="ep-empty" role="status">
            No icons found
          </div>
        )}
        {filteredEmojis.map((entry, index) => {
          const IconComponent = entry.icon;
          const isSelected = selectedEmoji?.name === entry.name;
          const isFocused = focusIndex === index;
          return (
            <button
              key={`${entry.category}-${entry.name}`}
              className={`ep-grid-item ${isSelected ? 'ep-grid-item--selected' : ''}`}
              onClick={() => handleSelect(entry)}
              onFocus={() => setFocusIndex(index)}
              data-emoji-button
              tabIndex={isFocused ? 0 : -1}
              role="gridcell"
              aria-label={entry.name}
              title={entry.name}
              type="button"
            >
              <IconComponent size={iconSize} strokeWidth={iconStrokeWidth} />
            </button>
          );
        })}
      </div>

      {/* Bottom preview bar */}
      {selectedEmoji && (
        <div className="ep-preview" aria-live="polite">
          <div className="ep-preview-icon">
            <selectedEmoji.icon size={20} strokeWidth={iconStrokeWidth} />
          </div>
          <div className="ep-preview-info">
            <span className="ep-preview-name">{selectedEmoji.name}</span>
            <span className="ep-preview-category">{selectedEmoji.category}</span>
          </div>
        </div>
      )}

      {/* Popover arrow */}
      {mode === 'popover' && <div className="ep-popover-arrow" />}
    </div>
  );
};

EmojiPicker.displayName = 'EmojiPicker';
