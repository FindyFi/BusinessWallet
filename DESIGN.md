# Business Wallet - Web UI Design Documentation

## Overview

This document describes the visual layout and design specifications for the Business Wallet web user interface. This serves as the design deliverable for FR-0001.

## Design Philosophy

The Business Wallet UI follows these principles:
- **Professional and trustworthy**: Suitable for organizational use
- **Clear information hierarchy**: Easy to navigate and understand
- **Accessible**: WCAG 2.1 Level AA compliant
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern and clean**: Uses contemporary design patterns

## Layout Structure

### Main Layout Components

The application uses a three-part layout structure:

```
┌─────────────────────────────────────────────────────┐
│  HEADER (Fixed Top)                                 │
│  Logo | Business Wallet          User Info | Avatar │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ SIDEBAR  │  MAIN CONTENT AREA                       │
│          │                                          │
│ Nav      │  Page content rendered here              │
│ Items    │  via React Router                        │
│          │                                          │
│          │                                          │
├──────────┴──────────────────────────────────────────┤
│  FOOTER                                             │
│  Copyright notice                                   │
└─────────────────────────────────────────────────────┘
```

### Header

**Position**: Fixed at the top of the viewport
**Height**: ~64px
**Layout**: Flexbox with space-between alignment

**Elements**:
1. **Logo + Title** (left side):
   - Logo: 48×48px rounded square with "BW" initials
   - Background: Blue gradient (#3b82f6 to #2563eb)
   - Title: "Business Wallet" in white, 1.5rem font size
   
2. **User Section** (right side):
   - User name: "Organization Admin" (hidden on mobile)
   - Avatar: 36×36px circular with initials "OA"
   - Avatar background: Blue (#3b82f6) with light blue border

**Styling**:
- Background: Gradient from dark blue (#1e3a8a) to slate (#1e293b)
- Color: White text
- Shadow: 0 2px 8px rgba(0,0,0,0.15)
- Padding: 1rem horizontal, responsive

### Sidebar

**Desktop View**:
- Width: 250px
- Position: Fixed left side
- Background: White (#ffffff)
- Border: Right border 1px solid #e2e8f0
- Height: Full viewport height (minus header)

**Navigation Items**:
Each item includes:
- Icon (emoji, 1.25rem): Visual identifier
- Label: Text description
- Active state indicator: 3px blue left border

**Navigation Structure**:
1. 🏠 Home
2. 🎫 Credentials
3. ✍️ Issue
4. 🔗 Share
5. 📄 Documents
6. ⚙️ Settings

**Interaction States**:
- Hover: Light gray background (#f1f5f9)
- Active: Light blue background (#eff6ff), blue text (#2563eb), blue left border
- Focus: Blue outline for keyboard navigation

**Mobile View** (≤768px):
- Converts to horizontal scrollable navigation
- Positioned below header
- Items arranged in a row with icons on top of labels
- Active state: Bottom border instead of left border

### Main Content Area

**Layout**:
- Flex: 1 (takes remaining space)
- Padding: 2rem (1.5rem on mobile)
- Background: Light gray (#f8fafc)
- Overflow: Scrollable vertically

**Content Rendering**:
- React Router Outlet for dynamic page content
- Max content width: Unconstrained (pages control their own max-width)

### Footer

**Position**: Bottom of layout
**Height**: Auto (min ~48px)
**Layout**: Centered text

**Content**:
- Copyright notice: "© 2026 Business Wallet. All rights reserved."
- Font size: 0.875rem
- Color: Gray (#64748b)

**Styling**:
- Background: White (#ffffff)
- Border: Top border 1px solid #e2e8f0
- Padding: 1rem horizontal

## Color Palette

### Primary Colors
- **Primary Blue**: #3b82f6 (Buttons, active states, accents)
- **Dark Blue**: #2563eb (Hover states, darker accents)
- **Navy Blue**: #1e3a8a (Header gradient start)

### Neutral Colors
- **Dark Slate**: #1e293b (Dark text, header gradient end)
- **Slate**: #475569 (Secondary text)
- **Gray**: #64748b (Tertiary text, placeholder)
- **Light Gray**: #cbd5e1 (Borders, disabled)
- **Very Light Gray**: #e2e8f0 (Dividers, subtle borders)
- **Background**: #f8fafc (Page background)
- **White**: #ffffff (Cards, sidebar, footer)

### Semantic Colors
- **Success**: #10b981 (Checkmarks, success states)
- **Info**: #3b82f6 (Information, links)
- **Warning**: #f59e0b (Warnings - not yet used)
- **Error**: #ef4444 (Errors - not yet used)

### Color Usage
- **Background colors**: Navy gradient for header, light gray for main area, white for components
- **Text colors**: Dark slate for headings, slate/gray for body text
- **Interactive elements**: Blue for links and active states
- **Borders**: Light gray shades for subtle separation

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
```
Uses system fonts for optimal performance and native feel.

### Font Sizes
- **Headings**:
  - H1 (Page title in header): 1.5rem (24px)
  - H2 (Page headings): 2rem (32px), mobile: 1.75rem
  - H3 (Section headings): 1.25-1.5rem (20-24px)
  
- **Body Text**:
  - Regular: 1rem (16px)
  - Small: 0.875rem (14px)
  - Large: 1.125rem (18px)

### Font Weights
- **Regular**: 400 (body text)
- **Medium**: 500 (navigation, labels)
- **Semibold**: 600 (headings, emphasis)
- **Bold**: 700 (hero titles, strong emphasis)

### Line Heights
- Headings: 1.2
- Body text: 1.5
- Dense text: 1.75

## Spacing System

Uses a consistent 8px base unit system:
- 0.25rem = 4px
- 0.5rem = 8px
- 0.75rem = 12px
- 1rem = 16px
- 1.5rem = 24px
- 2rem = 32px
- 3rem = 48px

## Component Patterns

### Feature Cards (Home Page)
- Background: White
- Border: 1px solid #e2e8f0
- Border radius: 0.5rem (8px)
- Padding: 1.5rem (24px)
- Shadow on hover: 0 4px 6px rgba(0,0,0,0.1)
- Transition: 0.2s ease
- Hover effect: Slight lift (translateY(-2px))

### Placeholder Boxes
- Background: White
- Border: 2px dashed #cbd5e1
- Border radius: 0.5rem (8px)
- Padding: 3rem 2rem (mobile: 2rem 1rem)
- Text alignment: Center
- Icon size: 4rem (64px), opacity 0.5

### Buttons (Future Use)
- Primary: Blue background (#3b82f6), white text
- Border radius: 0.375rem (6px)
- Padding: 0.5rem 1rem
- Transition: All 0.2s
- Hover: Darker blue (#2563eb)
- Focus: 2px outline, 2px offset

## Responsive Design

### Breakpoints
- **Mobile**: ≤640px
- **Tablet**: 641px - 768px
- **Desktop**: >768px

### Layout Adaptations

#### Mobile (≤768px)
- **Header**: 
  - Smaller logo (40×40px)
  - Smaller title (1.25rem)
  - Hide user name, show only avatar
  
- **Sidebar**:
  - Converts to horizontal scrollable bar
  - Positioned below header
  - Icons above labels
  - Scrollable if items overflow
  
- **Main Content**:
  - Reduced padding (1.5rem → 1rem)
  - Full width utilization
  
- **Feature Cards**:
  - Single column layout
  - Full width cards

#### Tablet (641px - 768px)
- Similar to desktop but with narrower sidebar
- Feature cards may start wrapping to 2 columns

#### Desktop (>768px)
- Full layout as designed
- Sidebar fixed on left (250px)
- Multi-column feature card grid
- Optimal spacing and padding

## Accessibility Features

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Visible focus indicators (2px blue outline)
- Logical tab order (header → sidebar → main content → footer)

### Screen Reader Support
- Semantic HTML elements (header, nav, main, footer)
- ARIA labels where appropriate
- Meaningful link text

### Color Contrast
- All text meets WCAG AA contrast requirements:
  - White text on navy background: >7:1
  - Dark text on white background: >12:1
  - Gray text on white background: >4.5:1

### Visual Design
- Clear visual hierarchy
- Sufficient spacing between interactive elements (min 44×44px touch targets)
- Icons supplemented with text labels
- Clear active/hover states

## Logo and Branding

### Logo Placeholder
- **Initials**: "BW" (Business Wallet)
- **Shape**: Rounded square (8px border-radius)
- **Size**: 48×48px (desktop), 40×40px (mobile)
- **Background**: Linear gradient from #3b82f6 to #2563eb
- **Text**: White, bold (700 weight), 1.25rem
- **Shadow**: 0 4px 6px rgba(0,0,0,0.1)

### Brand Colors
Primary brand color is blue (#3b82f6), representing:
- Trust and security
- Professionalism
- Technology and innovation
- Stability and reliability

### Future Logo Considerations
The current "BW" placeholder should be replaced with:
- Professional logo design
- SVG format for scalability
- Alt text for accessibility
- Multiple sizes for different contexts

## Page Templates

### Home Page
- Hero section with welcome message
- Grid of feature cards (4 items, responsive)
- Clear call-to-action in descriptions

### Content Pages (Credentials, Issue, Share, Documents, Settings)
- Page title (H2)
- Page description paragraph
- Placeholder content area
- Consistent spacing and layout

## Future Enhancements

### Planned Features
1. **Dark Mode**: Alternative color scheme for low-light environments
2. **Custom Theming**: Organization-specific color customization
3. **Advanced Navigation**: Breadcrumbs, sub-navigation
4. **Action Buttons**: Primary and secondary button styles
5. **Form Components**: Input fields, dropdowns, checkboxes
6. **Modal Dialogs**: For confirmations and detailed views
7. **Notifications**: Toast messages for user feedback
8. **Data Tables**: For credential and document listings
9. **Search Bar**: Global search in header
10. **User Menu**: Dropdown for profile, settings, logout

### Animation and Interaction
- Smooth transitions (0.2s ease)
- Subtle hover effects
- Loading states and spinners
- Skeleton screens for content loading
- Micro-interactions for better UX

## Implementation Notes

### Technology Stack
- **Framework**: React 19 with TypeScript
- **Routing**: React Router DOM v7
- **Build Tool**: Vite
- **Styling**: CSS with custom properties (no framework)
- **Icons**: Currently using emoji (to be replaced with icon library)

### CSS Architecture
- Component-scoped CSS files
- Global styles in index.css
- CSS custom properties for theming (future)
- Mobile-first responsive design
- Flexbox for layout

### Performance Considerations
- Minimal CSS framework overhead (custom CSS)
- System fonts for fast loading
- Optimized images and assets
- Code splitting with React Router
- Lazy loading for future pages

## Design Assets

### Screenshots
1. **Desktop Home View**: Shows header, sidebar, and main content
2. **Desktop Credentials View**: Demonstrates active navigation state
3. **Mobile View**: Shows responsive horizontal navigation

### Color Swatches
Available in the Color Palette section above.

### Typography Samples
Available in the Typography section above.

## Maintenance and Updates

### Version History
- **v1.0** (2026-02-11): Initial layout design with header, sidebar, main area, and footer

### Design Review Process
1. Product Owner reviews design documentation
2. Stakeholder feedback collection
3. Iterative improvements based on feedback
4. Implementation validation
5. User testing and refinement

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-11  
**Status**: Ready for Review  
**Deliverable for**: FR-0001 - Create basic visual layout for the web UI main page
