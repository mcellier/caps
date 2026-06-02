# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a caps (bottle caps) collection website that can run as either a dynamic Express server or generate a static HTML site. The site displays a personal collection of beer caps organized by country and brewery, with search, sorting, and offline PWA capabilities.

## Commands

### Development
```bash
npm start           # Run dynamic Express server on PORT env variable
npm run start:dev   # Run with nodemon for auto-reload during development
```

### Build
```bash
npm run build       # Generate static site in build/ directory
```

The build process:
- Renders Pug templates to HTML
- Copies images, CSS, JavaScript, and dependencies to build/
- Creates a self-contained static site ready for deployment

## Architecture

### Core Data Flow

The application is built around a single data aggregation function in `caps.js`:

**caps.js**: `getCaps()` function
- Scans `images/` directory using glob pattern `images/**/**/*.*`
- Expects two-level structure: `images/{country}/{brewery}/{cap-name}.jpg`
- Parses cap names to extract tags from parentheses: `Beer Name (tag1, tag2).jpg`
- Returns structured data object with:
  - `caps`: nested object by country → brewery → beers array
  - `total`: total number of caps
  - `countries`: count (excluding 2 special categories)

### Dual Mode Operation

**Dynamic mode (index.js)**:
- Express 5.x server serving Pug templates
- Single route `/` that renders with `getCaps()` data
- Static asset serving for `/public`, `/images`, and npm dependencies
- Opens browser automatically on start

**Static mode (build.js)**:
- Pre-renders templates using `pug.renderFile()`
- Copies all assets to `build/` directory
- Output is deployable to any static host

### View Architecture

**views/index.pug**: Main template using component includes
- `components/head.pug`: Meta tags, PWA manifest, CSS links
- `components/header.pug`: Logo, search bar, sort button
- `components/caps.pug`: Main content rendering caps by country/brewery
- `components/mentions.pug`: Legal mentions modal
- `components/footer.pug`: Footer content

The caps component iterates through the data structure to render collapsible country sections with brewery groupings and individual cap images.

### Client-Side Features

**public/index.js**: Main UI interactions
- Service worker registration for PWA
- `search()`: Filters caps by beer name, brewery, tags, or country (case-insensitive)
- `toggleCountry()`: Expand/collapse country sections
- `showLegalMentions()`/`hideLegalMentions()`: Modal control

**public/sort.js**: Sorting functionality
- Three sort modes: alphabetical by country, caps count descending, caps count ascending
- Cycles through modes on button click
- Uses CSS flexbox order property for reordering without DOM manipulation

**public/sw.js**: Service worker for offline support
- Online-first strategy for HTML/CSS/JS (cache as fallback)
- Offline-first strategy for images (cache-then-network)
- Cache name: `mycaps-v1`

### Image Management

Images must follow strict conventions:
- Location: `images/{country}/{brewery}/{name}.jpg`
- Size: 300px width JPG format
- Naming: `{Beer Name} (optional, tags).jpg`
- Lazy loading via lazyloadjs library

The README provides ImageMagick commands for batch converting and resizing images to meet these requirements.

## Key Technical Details

- **No database**: All data derived from filesystem at runtime (dynamic) or build time (static)
- **No build tooling**: Vanilla JavaScript, no bundlers or transpilers
- **Progressive Web App**: Service worker enables offline functionality
- **Pug templating**: Server-side rendering for both modes
- **Express 5.x**: Modern Express with updated dependencies

## Development Notes

- The site is in French (`lang='fr'` in index.pug)
- Country/brewery names come directly from directory names in `images/`
- Tags are extracted from filenames using regex: `/\(.*\)/`
- Search operates on data attributes on list items, not DOM text content
- The `-2` in countries count excludes "unknown" and "non beer" categories
