# Flashcard Generator

A customizable flashcard application for vocabulary learning with timing controls, word/translation swap, and JavaScript post-processing functionality.

## Features

- **Customizable Vocabulary**: Load vocabulary from any URL with tab-separated format (`translation\tword`)
- **Timing Controls**: Configure display duration for word-only and word+translation phases
- **Word/Translation Swap**: Option to reverse the display order
- **Post-Processing**: JavaScript code editor to transform flashcard content before display
- **Keyboard Shortcuts**: Quick access to settings (S) and post-processing (E)
- **Progress Tracking**: Visual indicator showing current position in vocabulary set
- **Brutalist Design**: High-contrast, distraction-free interface optimized for learning

## Usage

### Loading Vocabulary

1. Click "OPEN SETTINGS" or press `S`
2. Enter a URL to your vocabulary file
3. Click "LOAD VOCABULARY"

**Vocabulary File Format:**
```
translation1	word1
translation2	word2
translation3	word3
```

Each line must contain a translation and word separated by a tab character (`\t`).

### Timing Configuration

- **Word Display Time**: Duration (in seconds) to show only the word
- **Both Display Time**: Duration (in seconds) to show both word and translation

Default: 2 seconds for word, 1 second for both.

### Post-Processing

Press `E` or click the code icon to open the post-processing editor. Write a JavaScript function to transform flashcard content:

```javascript
function process({ word, translation }) {
  // Example: Convert to uppercase
  return { 
    word: word.toUpperCase(), 
    translation: translation.toUpperCase() 
  };
}
```

The function receives `{ word, translation }` and must return an object with the same structure.

**Example Transformations:**

```javascript
// Add prefix
function process({ word, translation }) {
  return { 
    word: "→ " + word, 
    translation: "← " + translation 
  };
}

// Remove punctuation
function process({ word, translation }) {
  return { 
    word: word.replace(/[.,!?]/g, ''), 
    translation: translation.replace(/[.,!?]/g, '') 
  };
}

// Truncate long words
function process({ word, translation }) {
  return { 
    word: word.length > 20 ? word.slice(0, 20) + '...' : word,
    translation: translation.length > 20 ? translation.slice(0, 20) + '...' : translation
  };
}
```

### Keyboard Shortcuts

- `S` - Open settings panel
- `E` - Open post-processing editor
- `ESC` - Close any open panel

## Technology Stack

- **Framework**: Next.js with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Package Manager**: pnpm

## Design Philosophy

**Brutalist Digital Learning** - A high-contrast, distraction-free interface that prioritizes readability and focus. Features include:

- Deep black background with cyan-blue grid pattern
- Sharp geometric design with no rounded corners
- Space Grotesk for display typography
- IBM Plex Mono for UI elements
- Fira Code for code editor
- Minimal animations (200-300ms transitions)
- Mathematical precision in layout

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## License

MIT
