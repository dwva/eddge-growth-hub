# Teacher Dashboard UI Design Specifications

## Global Design System

### Layout Container
```
max-width: 1600px (prevent ultra-wide stretch)
padding: Consistent throughout
spacing: space-y-10 (40px between major sections)
```

### Typography Scale
```
Page Title: text-3xl font-bold (30px)
Section Header: text-sm font-semibold uppercase text-gray-400 (12px, all caps)
Card Title: text-lg font-semibold (18px)
Subsection: text-base font-semibold (16px)
Body: text-sm (14px)
Meta/Caption: text-xs text-gray-500 (12px)
```

### Color Palette (Neutral + Accents)
```
Background: White (#FFFFFF)
Borders: border-gray-100 (#F3F4F6)
Text Primary: text-gray-900 (#111827)
Text Secondary: text-gray-500 (#6B7280)
Text Tertiary: text-gray-400 (#9CA3AF)

Accent Colors (Soft):
- Blue: bg-blue-50, text-blue-600
- Emerald: bg-emerald-50, text-emerald-600
- Violet: bg-violet-50, text-violet-600
- Amber: bg-amber-50, text-amber-600
- Red: bg-red-50, text-red-600
```

### Card System
```
Background: bg-white
Border: border border-gray-100
Shadow: shadow-sm (subtle)
Radius: rounded-2xl (16px)
Padding: p-6 (24px)
Hover: hover:shadow-md hover:border-gray-200
```

### Button Sizes
```
Primary: h-10 px-4 rounded-xl
Small: h-8 px-3 text-xs rounded-lg
Icon Only: h-9 w-9 rounded-lg
```

### Section Headers
```
Small gray uppercase label above each major section:
- OVERVIEW
- QUICK ACTIONS
- PERFORMANCE
- ACTIVITY
- etc.

Style: text-sm font-semibold text-gray-400 uppercase tracking-wide mb-5
```

---

## Page 1: Dashboard (TeacherHome)

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ [Header]                                                 │
│ Dashboard                                [Buttons]       │
│ Monday, February 3, 2026                                 │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ OVERVIEW                                                  │
│ [KPI Card] [KPI Card] [KPI Card] [KPI Card]             │
│                                                           │
│ QUICK ACTIONS                                            │
│ [Action] [Action] [Action] [Action]                     │
│                                                           │
│ PERFORMANCE                                              │
│ [Class Performance Card────────] [Alerts Card]          │
│ │ • Distribution (3 boxes)    │ │ • 3 Alert items│       │
│ │ • Subject Progress (4 bars) │ │ • View All btn │       │
│                                                           │
│ RECENT ACTIVITY                                          │
│ [Activity Timeline] [Top Performers]                     │
│                                                           │
│ UPCOMING EVENTS                                          │
│ [Event Card] [Event Card] [Event Card]                  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Detailed Sections

#### 1. Page Header
```
┌─────────────────────────────────────────────────────────┐
│ Dashboard                    [Messages 3] [New Assessment]│
│ Monday, February 3, 2026                                  │
└─────────────────────────────────────────────────────────┘
Border bottom: border-b border-gray-100
Padding bottom: pb-6
Title: text-3xl font-bold
Date: text-sm text-gray-500 mt-2
Buttons: h-10, rounded-xl, gap-3
```

#### 2. KPI Cards (OVERVIEW Section)
```
Grid: 4 columns on desktop, 2 on mobile
Gap: gap-5 (20px)
Section header: "OVERVIEW" (gray, uppercase, small)

Each card:
- Clean StatCard component (already good)
- Icon in soft colored circle (12x12 container, 5x5 icon)
- Large value (text-2xl or text-3xl)
- Small trend badge (if applicable)
- Equal height cards
```

#### 3. Quick Actions (Redesigned)
```
Grid: 4 columns
Gap: gap-4 (16px)
Section header: "QUICK ACTIONS"

Each action card:
┌──────────────┐
│     [📊]     │  ← Icon in 12x12 soft colored circle
│              │
│  Analytics   │  ← Label centered below
└──────────────┘

Card style:
- Vertical layout (icon top, text bottom)
- p-6 (24px padding)
- bg-white border border-gray-100
- Icon centered in soft background
- Text: text-sm font-medium text-gray-700
- Hover: border-gray-200, shadow-sm
- No heavy colored backgrounds
```

#### 4. Performance Section (Separated)
```
Grid: 2/3 width + 1/3 width
Gap: gap-6

LEFT CARD: Class Performance
┌──────────────────────────────────┐
│ Class Performance    [View Details→] │
│ Class 10-A Overview              │
├──────────────────────────────────┤
│                                  │
│ [12] High    [15] Average   [5] Need Attention │
│ ≥80%         60-79%         <60%               │
│                                  │
│ Subject-wise Progress            │
│ Mathematics    ████████░ 82%     │
│ Science        ██████░░░ 75%     │
│ English        ████████░ 85%     │
│ History        █████░░░░ 68%     │
└──────────────────────────────────┘

- Remove gradient background from header
- Clean white card
- Distribution: 3 equal boxes, soft colored backgrounds
- Progress bars: h-2, clean style
- Better vertical spacing between elements

RIGHT CARD: Alerts & Reminders
┌──────────────────────┐
│ 🔔 Alerts & Reminders│
├──────────────────────┤
│ [📅] PTM Tomorrow     │
│     3 parents confirmed│
│                      │
│ [⚠️] 2 At-Risk Students│
│     Need immediate..  │
│                      │
│ [📄] Assessment Pending│
│     Due in 2 days    │
│                      │
│ [View All Alerts]    │
└──────────────────────┘

- Remove heavy backgrounds
- Simple rounded boxes with light colored bg
- Minimal icons (4x4)
- Clean typography
```

#### 5. Recent Activity + Top Performers
```
Grid: 1/2 + 1/2 width
Gap: gap-6

LEFT: Recent Activity
- Timeline with small colored dots (2x2)
- Avatar (8x8)
- Clean text hierarchy
- Border separator between items

RIGHT: Top Performers
- Crown icon for #1
- Avatar (10x10) with border
- Score right-aligned (text-lg)
- Trend indicator (small, subtle)
- Light gray background on hover
```

#### 6. Upcoming Events
```
Grid: 3 columns
Full width row
Clean event cards with:
- Date box (12x12, primary color)
- Event title (truncate)
- Time (text-xs)
- Badge (small)
- Light gradient background (very subtle)
```

---

## Page 2: Students (TeacherStudents)

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ Students                                    [+ Add Student]│
│ Manage your class roster and student information         │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ [Search input...............................] [Filter▼]  │
│                                                           │
│ 32 STUDENTS                                              │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Avatar | Name | Roll | Score | Attendance | Actions │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │  JS    | John Smith  | 001 | 92% ↑ | 100%  | •••   │ │
│ │  EW    | Emma Wilson | 002 | 88% ↑ | 96%   | •••   │ │
│ │  ...                                                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ [← Previous]                            [Next →]         │
└─────────────────────────────────────────────────────────┘
```

### Redesign Changes
```
1. Clean Filter Bar
   - Single row: Search + Filter dropdown
   - No card wrapper, just clean inputs
   - height: h-12, rounded-xl
   - Border: border-gray-200

2. Table Container
   - Single clean card
   - Header: "32 STUDENTS" (uppercase, gray)
   - Remove excessive padding
   - Clean table with good spacing

3. Table Design
   - Row height: consistent (py-4)
   - Borders: border-b border-gray-50
   - Hover: bg-gray-50/50
   - Avatar: 10x10, clean style
   - Trend icons: subtle, 3x3
   - Actions: clean ••• icon

4. Pagination
   - Below table, centered
   - Clean buttons (h-9)
   - Page numbers visible
```

---

## Page 3: Class Analytics (TeacherClassAnalytics)

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ Class Analytics                                          │
│ Comprehensive performance metrics for Class 10-A         │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ KEY METRICS                                              │
│ [KPI] [KPI] [KPI] [KPI]                                 │
│                                                           │
│ PERFORMANCE TRENDS                                       │
│ ┌──────────────────────────────────────────────────────┐│
│ │ Performance Over Time                                 ││
│ │ [Clean Line Chart - h-80]                            ││
│ └──────────────────────────────────────────────────────┘│
│                                                           │
│ DISTRIBUTION & SUBJECTS                                  │
│ ┌──────────────────┐ ┌────────────────────────────────┐│
│ │ Distribution     │ │ Subject Performance            ││
│ │ [Clean Pie Chart]│ │ [Subject Cards Grid]           ││
│ └──────────────────┘ └────────────────────────────────┘│
│                                                           │
│ TOP PERFORMERS                                           │
│ [Student Card] [Student Card] [Student Card]             │
└─────────────────────────────────────────────────────────┘
```

### Redesign Changes
```
1. Remove ALL Tabs
   - Single page view, no tab navigation
   - Scroll down for all content

2. Separate Each Concern
   - KPIs in own section (top)
   - One chart per section
   - Never mix chart types in same card

3. Chart Redesign (CRITICAL)
   Performance Chart:
   - Height: h-80 (320px)
   - Soft gradient fill (opacity 0.1-0.2)
   - Light grid (stroke #f0f0f0)
   - No heavy borders
   - Clean axis labels (text-xs, gray-400)
   - Tooltip: Clean white card, subtle shadow
   
   Distribution:
   - Pie chart or simple bar chart
   - Soft colors
   - Clean legend (outside chart)
   - h-72

4. Subject Performance
   - Grid of individual cards (4 columns)
   - Each subject in own card
   - Badge with score
   - Progress bar (h-2)
   - Pass rate indicator
   - Clean hover effect

5. Section Headers
   - Add section headers before each group
   - "KEY METRICS", "PERFORMANCE TRENDS", etc.
```

---

## Page 4: Assessments (TeacherAssessments)

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ Assessments                        [+ Create Assessment] │
│ Create and manage your assessments                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ [All] [Published] [Draft] [Grading]                     │
│                                                           │
│ ┌──────────────────────────────────────────────────────┐│
│ │ Chapter 5 Quiz             [Draft] │ Mathematics    │ ││
│ │ 20 questions • Multiple Choice     │ Due: Mar 15    │ ││
│ │                                     [Edit] [Publish] │ ││
│ └──────────────────────────────────────────────────────┘│
│                                                           │
│ ┌──────────────────────────────────────────────────────┐│
│ │ Mid-term Exam          [Published] │ Mathematics    │ ││
│ │ 50 questions • Mixed Format        │ Due: Mar 20    │ ││
│ │ 28/32 submitted                    [View] [Grade]   │ ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Redesign Changes
```
1. Minimal Tab Bar
   - No card wrapper
   - Just clean pills
   - h-10, px-4, rounded-lg
   - Active: bg-gray-100
   - Inactive: transparent, hover:bg-gray-50

2. Assessment Cards
   - Full width cards
   - Clean layout: Title + Badge + Subject
   - Meta info: text-xs, gray-500
   - Actions: Right side, clean buttons
   - Border: border-gray-100
   - Padding: p-6
   - Spacing: gap-4 between cards

3. Status Badges
   - Minimal design
   - Soft colored backgrounds
   - text-xs font-medium
   - rounded-full, px-3 py-1

4. Create Dialog
   - Clean form layout
   - Good spacing between fields
   - Clear section headers
   - Minimal borders
```

---

## Page 5: Attendance (TeacherAttendance)

### Current State: Already Good ✓
Minor refinements only:
```
1. Keep the detailed student cards
2. Ensure consistent spacing
3. Clean Present/Absent buttons
4. Minimal date picker design
```

---

## Page 6: Reports / Class Summary (TeacherReports)

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ Class Summary                                   [Export] │
│ Comprehensive overview of Class 10-A                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ OVERVIEW                                                 │
│ [KPI] [KPI] [KPI] [KPI]                                 │
│                                                           │
│ SUBJECT PERFORMANCE                                      │
│ ┌──────────────────────────────────────────────────────┐│
│ │ [Clean Bar Chart comparing subjects]                 ││
│ └──────────────────────────────────────────────────────┘│
│                                                           │
│ TOP PERFORMERS                                           │
│ ┌──────────────────────────────────────────────────────┐│
│ │ [Student] [Student] [Student] [Student]              ││
│ └──────────────────────────────────────────────────────┘│
│                                                           │
│ AT-RISK STUDENTS                                         │
│ ┌──────────────────────────────────────────────────────┐│
│ │ [Student] [Student] [Student]                        ││
│ └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Redesign Changes
```
1. Separate Sections Clearly
   - Each concern in own row
   - Never mix KPIs with charts
   - Never mix charts with lists

2. Chart Simplification
   - ONE chart only (subject comparison)
   - Clean bar chart design
   - h-72, proper spacing
   - Soft colors

3. Student Cards
   - Reduce card height: max-h-[160px]
   - Cleaner layout
   - Better spacing
   - Consistent with Top Performers design

4. Remove Duplicate Content
   - No attendance summary (redundant)
   - Focus on performance and at-risk
```

---

## Page 7: Communication (TeacherCommunication)

### Current State: Already Clean ✓
Minor refinements:
```
1. Keep inbox-style layout
2. Ensure truncation works properly
3. Minimal conversation cards
4. Clean message input area
```

---

## Page 8-10: Subject Teacher Pages

### Subject Classes
```
Clean grid of class cards:
- Subject filter dropdown (top)
- 2-column grid
- Each card shows:
  • Class name
  • Student count
  • Average score badge
  • Subject performance (not completion)
  • Clean progress bar
```

### Subject Students
```
Similar to main Students page:
- Class filter (top)
- Clean table
- Search functionality
- Minimal actions
```

### Subject Analytics
```
Same principles as Class Analytics:
- Separated sections
- Clean charts
- No tabs within content
- Chapter/Topic/Mistakes in sidebar navigation
```

---

## Icon System Cleanup

### Unified Approach
```
1. Icon Size: Consistent 4x4 or 5x5
2. Icon Container: 12x12 rounded square
3. Icon Background: Soft colored (bg-{color}-50)
4. Icon Color: Vibrant (text-{color}-600)
5. Style: Line-based lucide-react icons only
```

### Icon Color Mapping
```
Users/Students: Blue
Performance/Charts: Emerald
Calendar/Time: Violet
Tasks/Work: Amber
Alerts/Important: Red
Messages: Blue
Analytics: Emerald
```

---

## Chart Design System

### All Charts Must Follow:
```
1. Container
   - Clean white card
   - Padding: p-6
   - Border: border-gray-100
   - Shadow: shadow-sm

2. Chart Header
   - Title: text-lg font-semibold
   - Subtitle: text-sm text-gray-500 mt-1
   - Action button: Right side (optional)

3. Chart Canvas
   - Height: h-72 or h-80 (consistent)
   - ResponsiveContainer from Recharts
   - Margins: { top: 10, right: 20, left: 0, bottom: 0 }

4. Chart Styling
   - Grid: strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}
   - Axis: tick={{ fontSize: 13, fill: '#9ca3af' }}
   - AxisLine: axisLine={false} tickLine={false}
   - Colors: Soft pastels, avoid bright colors
   - Fill: Gradient with opacity 0.1-0.2

5. Tooltip
   - borderRadius: 12px
   - border: none
   - boxShadow: 0 10px 40px rgba(0,0,0,0.1)
   - padding: 12px 16px
```

### Chart Types
```
Line/Area Chart:
- Use for trends over time
- Soft gradient fill
- Smooth curves (type="monotone")
- Single color scheme

Bar Chart:
- Use for comparisons
- Vertical orientation preferred
- Consistent bar color or gradient
- Clean spacing

Pie Chart:
- Use sparingly (distribution only)
- Max 4-5 segments
- Soft colors
- Legend outside chart
```

---

## Spacing System

### Vertical Spacing
```
Between major sections: space-y-10 (40px)
Between cards in section: gap-6 (24px)
Within card sections: space-y-4 (16px)
Between elements: gap-3 (12px)
```

### Padding
```
Page container: px-8 (32px)
Card padding: p-6 (24px)
Small containers: p-4 (16px)
Buttons: px-4 py-2 (standard)
```

### Grid Gaps
```
KPI cards: gap-5 (20px)
Action cards: gap-4 (16px)
Content cards: gap-6 (24px)
Tight grids: gap-3 (12px)
```

---

## Responsive Breakpoints

### Grid Columns
```
Mobile (default): 1 column
Tablet (md): 2 columns
Desktop (lg): 3-4 columns

KPIs: 2 → 4
Actions: 2 → 4
Content: 1 → 2
Charts: 1 → 1 (full width)
Student cards: 1 → 2 → 4
```

### Hide/Show Elements
```
Mobile:
- Hide: Unnecessary columns, long descriptions
- Simplify: Navigation, charts
- Stack: All layouts vertical

Desktop:
- Show: All data columns
- Expand: Charts full size
- Grid: Multi-column layouts
```

---

## Implementation Priority

### Phase 1: Core Pages (Do First)
1. Dashboard - Complete redesign
2. Students - Table and filters
3. Class Analytics - Charts and separation
4. Assessments - Cards and tabs

### Phase 2: Secondary Pages
5. Reports - Clean sections
6. Attendance - Minor refinements
7. Communication - Minor fixes

### Phase 3: Subject Pages
8. Subject Classes
9. Subject Students
10. Subject Analytics

---

## Summary of Key Changes

### What Gets REMOVED:
- ❌ Gradient backgrounds
- ❌ Heavy shadows
- ❌ Colorful backgrounds on action buttons
- ❌ Complex tab systems within pages
- ❌ Mixed chart types in one card
- ❌ Excessive font weights
- ❌ Tight spacing
- ❌ Cluttered layouts

### What Gets ADDED:
- ✅ Section headers (gray, uppercase)
- ✅ More white space
- ✅ Separated concerns (one per card)
- ✅ Clean chart designs
- ✅ Consistent icon system
- ✅ Better visual hierarchy
- ✅ Minimal color accents
- ✅ Clear top-down flow

### Result:
Clean, calm, professional SaaS dashboard that teachers want to use daily.
