# Sanskruti Travels Website

## Overview

This is a static website for Sanskruti Travels, a travel agency offering domestic and international tour packages. The website is built using vanilla HTML, CSS, and JavaScript with Bootstrap 5 for responsive design. It features a multi-page structure with dynamic content loading for travel packages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static Website**: Pure HTML/CSS/JavaScript implementation
- **Responsive Design**: Bootstrap 5 framework for mobile-first responsive layouts
- **Progressive Enhancement**: JavaScript enhances functionality without breaking core features
- **Client-Side Routing**: URL parameters for filtering and navigation state

### Technology Stack
- **HTML5**: Semantic markup with proper SEO meta tags
- **CSS3**: Custom styling with CSS variables and modern features
- **JavaScript (ES6+)**: Vanilla JavaScript for interactivity
- **Bootstrap 5**: CSS framework for responsive components
- **Font Awesome 6**: Icon library for visual elements

## Key Components

### 1. Multi-Page Structure
- **index.html**: Homepage with hero section and featured packages
- **packages.html**: Package listing with filtering and search
- **package-detail.html**: Individual package details page
- **about.html**: Company information page
- **contact.html**: Contact information and forms

### 2. Navigation System
- Fixed top navigation bar with responsive mobile menu
- Active page highlighting
- WhatsApp booking integration via external link
- Consistent navigation across all pages

### 3. Package Management System
- **packages.json**: Static JSON data file containing all package information
- Dynamic package loading and filtering
- Category-based filtering (domestic/international)
- Search functionality across package names and descriptions
- Sorting options for packages

### 4. Styling System
- **CSS Variables**: Centralized color scheme and design tokens
- **Custom CSS**: Brand-specific styling in `css/style.css`
- **Responsive Design**: Mobile-first approach with Bootstrap grid system
- **Visual Hierarchy**: Consistent typography and spacing

## Data Flow

### Package Data Structure
```json
{
  "packages": [
    {
      "id": "unique-identifier",
      "name": "Package Name",
      "category": "domestic|international",
      "location": "Destination",
      "price": 32000,
      "originalPrice": 45000,
      "duration": "6 Days 5 Nights",
      "images": ["url1", "url2"],
      "itinerary": [...],
      "inclusions": [...]
    }
  ]
}
```

### Client-Side Data Processing
1. **Load**: Fetch package data from JSON file
2. **Filter**: Apply category, budget, and search filters
3. **Sort**: Order packages by name, price, or rating
4. **Display**: Render filtered packages in responsive grid
5. **Navigate**: Handle URL parameters for deep linking

## External Dependencies

### CDN Resources
- **Bootstrap 5.3.0**: CSS framework and JavaScript components
- **Font Awesome 6.4.0**: Icon library
- **External Images**: Pixabay URLs for package imagery

### Third-Party Integrations
- **WhatsApp Business**: Direct booking via WhatsApp link (917021360582)
- **External Image Hosting**: Pixabay for package and hero images

## Deployment Strategy

### Static Hosting
- **Architecture**: Client-side only, no server requirements
- **Hosting Options**: Can be deployed on any static hosting service
- **CDN Compatibility**: All external resources loaded via CDN
- **Performance**: Minimal dependencies for fast loading

### SEO Optimization
- Proper meta tags and descriptions on all pages
- Semantic HTML structure
- Image alt attributes for accessibility
- Clean URL structure

### Browser Compatibility
- Modern JavaScript (ES6+) features used
- Bootstrap 5 provides cross-browser compatibility
- Graceful degradation for older browsers

## Key Architectural Decisions

### 1. Static vs Dynamic
**Problem**: Need for a travel agency website with package management
**Solution**: Static website with JSON data file
**Rationale**: 
- Simple deployment and hosting
- Fast loading times
- Easy content updates via JSON
- No server maintenance required

### 2. Bootstrap Framework
**Problem**: Need for responsive design and consistent UI components
**Solution**: Bootstrap 5 with custom CSS overrides
**Rationale**:
- Rapid development
- Mobile-first responsive design
- Well-tested components
- Easy customization

### 3. Client-Side Filtering
**Problem**: Package search and filtering functionality
**Solution**: JavaScript-based filtering with URL state management
**Rationale**:
- No server required
- Instant filtering results
- Bookmarkable filtered views
- Reduced complexity

### 4. External Image Hosting
**Problem**: Image storage and delivery
**Solution**: External CDN links (Pixabay)
**Rationale**:
- Reduced repository size
- Fast image loading
- No storage costs
- Easy image management

The architecture prioritizes simplicity, performance, and maintainability while providing a professional travel agency website experience.

## Recent Updates (July 31, 2025)

### Fixed Search and Filter Functionality
✓ Resolved JavaScript stack overflow error in packages.js
✓ Fixed duration parsing for proper filtering (extracts numbers from "6 Days 5 Nights" format)
✓ Fixed search functionality to handle undefined destinations field
✓ Renamed conflicting function `applyFilters()` to `applyFiltersGlobal()` to prevent recursion

### Added Itinerary Sharing Features
✓ Created share functionality for WhatsApp, email, download, and copy to clipboard
✓ Added sharing dropdown to package detail pages
✓ Integrated sharing functions into main.js for global access
✓ Set up global currentPackage variable for sharing context

### Created Admin Interface for GitHub Pages
✓ Built comprehensive admin.html page for package management
✓ Added admin.js with full CRUD functionality for packages
✓ Implemented package export to JSON for GitHub Pages deployment
✓ Added admin link to navigation for easy access
✓ Created GitHub deployment instructions modal

### Enhanced User Experience
✓ Fixed all JavaScript errors preventing proper functionality
✓ Added success notifications for user actions
✓ Improved error handling throughout the application
✓ Made website fully functional with proper filtering and search

The website now provides complete functionality for browsing packages, advanced filtering, itinerary sharing, and package management compatible with GitHub Pages hosting.