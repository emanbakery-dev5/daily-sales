# Dashboard Functional Specification

**Project:** EMA Bakery Distribution Management System (EMA-BDMS)

**Module:** Dashboard

**Version:** 1.0.0

**Status:** Approved

---

## 1. Purpose

The Dashboard is the primary landing page after successful authentication.

Its purpose is to provide users with an immediate overview of business performance, operational status, outstanding actions, and quick access to frequently used features.

The dashboard is role-aware, meaning that each user only sees the information they are authorized to access.

---

## 2. Business Objectives

The Dashboard shall:

- Present real-time business metrics.
- Display actionable information.
- Reduce navigation time.
- Surface operational alerts.
- Highlight outstanding collections.
- Display recent business activities.
- Provide shortcuts to common tasks.
- Refresh automatically without requiring a full page reload.

---

## 3. User Roles

The dashboard content varies according to the authenticated user's permissions.

| Role                 | Dashboard Access     |
| -------------------- | -------------------- |
| System Administrator | Full Dashboard       |
| Operations Manager   | Operations Dashboard |
| Finance Officer      | Finance Dashboard    |
| Sales Coordinator    | Sales Dashboard      |
| Read-Only User       | Read-Only Dashboard  |

Widgets that require unavailable permissions are completely hidden.

---

## 4. Route

```text
/dashboard
```

This is the default landing page after successful login.

Unauthenticated users attempting to access this route are redirected to `/login`.

---

## 5. Navigation Flow

```text
Successful Login

↓

Load User Profile

↓

Load Permissions

↓

Load Dashboard Configuration

↓

Load Dashboard Data

↓

Render Widgets

↓

Dashboard Ready
```

---

## 6. Dashboard Layout

The dashboard consists of:

- Top Navigation Bar
- Left Sidebar Navigation
- Breadcrumb
- Welcome Banner
- KPI Cards
- Charts Section
- Quick Actions Panel
- Recent Activity Feed
- Notification Panel
- Footer

The layout uses responsive CSS Grid.

---

## 7. Welcome Banner

Displays:

- User's first name.
- Current date.
- Personalized greeting.

Examples:

Morning:

```text
Good Morning, Ahmed
```

Afternoon:

```text
Good Afternoon, Ahmed
```

Evening:

```text
Good Evening, Ahmed
```

The greeting changes automatically based on local system time.

---

## 8. KPI Cards

The first row contains KPI cards.

Default cards include:

### Today's Dispatches

Displays:

- Total dispatches created today.

Click Action:

Navigate to filtered Dispatch List.

---

### Today's Revenue

Displays:

- Total value of today's dispatches.

Click Action:

Open Daily Revenue Report.

---

### Outstanding Balance

Displays:

- Total customer outstanding balance.

Click Action:

Open Outstanding Ledger Report.

---

### Payments Received Today

Displays:

- Total payments received today.

Click Action:

Open Payment Report.

---

### Active Salespersons

Displays:

- Number of active salespersons.

Click Action:

Navigate to Salesperson List.

---

### Active Products

Displays:

- Number of active products.

Click Action:

Navigate to Product List.

---

## 9. KPI Card Behavior

Each KPI card contains:

- Icon
- Title
- Value
- Trend Indicator
- Last Updated Timestamp

Hover State:

- Elevation increases.
- Cursor changes to pointer.
- Shadow becomes more prominent.

Clicking anywhere on the card triggers navigation.

---

## 10. Trend Indicators

Trend values compare today's data with the previous business day.

Indicators include:

- Increase
- Decrease
- No Change

Visual representation:

- Up Arrow
- Down Arrow
- Neutral Line

Percentage values are rounded to one decimal place.

---

## 11. Quick Actions Panel

Displays the most frequently used actions.

Default actions:

- New Dispatch
- Record Payment
- Add Salesperson
- Add Product
- View Reports

Buttons are displayed only if the user has permission.

---

## 12. Quick Action Behavior

Each Quick Action button:

- Uses an icon.
- Displays a descriptive label.
- Supports keyboard focus.
- Shows tooltip on hover.

Clicking the button immediately navigates to the corresponding page.

No confirmation dialogs are required.

---

## 13. Recent Activity Feed

Displays recent business events.

Examples:

- Dispatch Created
- Payment Recorded
- Product Updated
- User Created
- Price Version Activated

Each activity includes:

- Icon
- Description
- User
- Timestamp

The feed is sorted in descending chronological order.

---

## 14. Notifications Panel

Displays system notifications.

Examples:

- Failed WhatsApp delivery.
- Pending configuration changes.
- Credit limit exceeded.
- Upcoming future price activation.

Unread notifications are visually highlighted.

Clicking a notification opens the relevant screen.

---

## 15. Loading State

During data retrieval:

- Skeleton loaders replace KPI cards.
- Charts display placeholders.
- Recent Activity displays loading rows.
- Quick Actions remain disabled until permissions are loaded.

No layout shifting should occur.

---

## 16. Empty States

Examples:

No Recent Activity

Message:

```text
No recent activity available.
```

No Notifications

Message:

```text
You're all caught up.
```

No KPI Data

Display:

```text
No data available for the selected period.
```

Empty states include an appropriate icon and descriptive message.

---

## 17. Refresh Behavior

Dashboard data refreshes automatically every five minutes.

Users may also manually refresh using the Refresh button.

Manual refresh performs:

- Reload KPI cards.
- Reload charts.
- Reload activity feed.
- Reload notifications.

The page itself does not reload.

---

## 18. Error Handling

If dashboard data fails to load:

Display:

```text
Unable to load dashboard information.

Please try again.
```

Retry button:

```text
Retry
```

Retry requests only the failed data source rather than refreshing the entire dashboard.

---

## 19. Acceptance Criteria (Part 1)

The Dashboard is considered complete for this section when:

- Users are redirected to the dashboard after login.
- KPI cards display correctly.
- Quick actions respect permissions.
- Recent activity loads successfully.
- Notifications are visible.
- Loading and empty states behave correctly.
- Automatic refresh functions as expected.

---

## 20. Dashboard Charts

The Dashboard includes visual summaries to help users quickly understand business performance.

Charts are interactive, responsive, and automatically update when dashboard data is refreshed.

---

### Daily Dispatch Trend

Purpose:

Displays the number of dispatches created during the selected period.

Chart Type:

Line Chart

Default Range:

Last 7 Days

Interactions:

- Hover displays exact values.
- Responsive resizing.
- Automatically updates when filters change.

---

### Revenue Trend

Purpose:

Displays total revenue over time.

Chart Type:

Bar Chart

Default Range:

Current Month

Interactions:

- Hover tooltip.
- Clicking a bar opens the filtered Dispatch Report.

---

### Outstanding Balance Distribution

Purpose:

Displays outstanding balances grouped by salesperson.

Chart Type:

Horizontal Bar Chart

Sorting:

Highest outstanding balance first.

---

### Payment Collection Trend

Purpose:

Displays payment collections over time.

Chart Type:

Area Chart

Default Period:

Current Month

---

## 21. Dashboard Filters

A global dashboard filter bar appears above all charts.

Available filters:

- Today
- Yesterday
- Last 7 Days
- Last 30 Days
- This Month
- Previous Month
- Custom Date Range

Changing the filter updates:

- KPI Cards
- Charts
- Recent Activity
- Notifications (where applicable)

without reloading the page.

---

### Custom Date Range

Fields:

- Start Date
- End Date

Validation:

- Start Date cannot be after End Date.
- Future dates are not permitted.
- Maximum range: 365 days.

Invalid input displays inline validation.

---

## 22. Global Search Shortcut

The Dashboard provides quick access to Global Search.

Keyboard Shortcut:

Ctrl + K (Windows/Linux)

Command + K (macOS)

Opening Global Search displays a searchable overlay.

Search categories include:

- Salespersons
- Products
- Dispatches
- Payments
- Reports

Results respect user permissions.

---

## 23. Widget Personalization (Future)

The architecture supports optional personalization.

Planned capabilities:

- Reorder widgets.
- Hide widgets.
- Resize widgets.
- Save personal dashboard layouts.

Default Version 1 behavior:

Fixed layout for all users.

---

## 24. Sidebar Interaction

The left navigation sidebar supports:

Expanded Mode

Collapsed Mode

Collapsed State:

- Icons remain visible.
- Labels are hidden.
- Hover displays tooltip.

The selected module remains highlighted.

---

## 25. Breadcrumb

The Dashboard displays:

Home

No additional breadcrumb items are required.

Navigating to other modules updates the breadcrumb automatically.

---

## 26. User Profile Menu

Located in the top-right corner.

Displays:

- User Avatar
- Full Name
- Current Role

Selecting the profile menu opens:

- My Profile (Future)
- Change Password (Future)
- Sign Out

---

## 27. Refresh Button

A Refresh button appears in the dashboard toolbar.

Selecting Refresh performs:

1. Disable Refresh button.
2. Display loading indicator.
3. Reload dashboard data.
4. Update "Last Updated" timestamp.
5. Enable Refresh button.

Multiple refresh requests are prevented.

---

## 28. Last Updated Timestamp

Displayed below the dashboard title.

Format:

```text
Last Updated: 29 Jun 2026, 10:45 AM
```

Updates automatically after every successful refresh.

---

## 29. Responsive Behaviour

The Dashboard supports:

Desktop (Primary)

Tablet

Mobile

---

### Desktop

- Four-column KPI layout.
- Full sidebar.
- Charts displayed side by side.

---

### Tablet

- Two-column KPI layout.
- Collapsible sidebar.
- Charts stacked vertically where required.

---

### Mobile

- Single-column layout.
- Sidebar replaced by navigation drawer.
- KPI cards displayed vertically.
- Charts optimized for smaller screens.

---

## 30. Accessibility

The Dashboard complies with WCAG 2.1 AA.

Requirements:

- Keyboard-only navigation.
- Screen-reader compatible headings.
- Descriptive ARIA labels.
- Focus indicators.
- Accessible chart summaries.
- Color-independent status indicators.

---

## 31. Keyboard Navigation

Supported keyboard interactions:

Tab

Navigate interactive elements.

Shift + Tab

Reverse navigation.

Enter

Activate focused element.

Escape

Close open overlays.

Ctrl + K / Command + K

Open Global Search.

---

## 32. Micro-Interactions

### KPI Card Hover

- Elevation increases.
- Shadow becomes stronger.
- Cursor changes to pointer.

---

### Button Hover

- Background transitions smoothly.
- Icon color updates where applicable.

---

### Notification Hover

- Background highlights.
- Cursor changes to pointer.

---

### Chart Hover

- Tooltip fades in.
- Data point is highlighted.

---

### Sidebar Collapse

Animated transition duration:

200 ms

---

### Loading Skeleton

Fade animation until content loads.

---

## 33. Performance Requirements

Dashboard initial render target:

Less than 1 second.

Subsequent refresh target:

Less than 500 milliseconds.

Chart rendering target:

Less than 300 milliseconds.

---

## 34. Security Considerations

Dashboard data must:

- Respect Role-Based Access Control (RBAC).
- Respect Supabase Row-Level Security (RLS).
- Never expose unauthorized business information.
- Load only permitted widgets.

Hidden widgets must not be retrievable through client-side manipulation.

---

## 35. Audit Events

The following events are recorded:

- Dashboard Viewed
- Dashboard Refreshed
- Dashboard Filter Changed
- Notification Opened
- Quick Action Selected
- Report Opened from Dashboard

Audit entries include:

- User ID
- Timestamp
- Action
- Correlation ID

---

## 36. Error States

Possible error scenarios:

- Network failure
- Unauthorized access
- Data retrieval timeout
- Partial widget failure

Each widget handles its own errors independently.

Failure in one widget must not prevent other widgets from rendering.

---

## 37. Business Rules

- Dashboard displays only authorized data.
- Financial metrics are calculated server-side.
- KPI totals are read-only.
- Dashboard never permits data modification.
- Refresh operations do not alter business data.

---

## 38. Acceptance Criteria

The Dashboard module is considered complete when:

- Users are redirected to the Dashboard after authentication.
- KPI cards display accurate information.
- Charts render correctly.
- Quick Actions respect permissions.
- Notifications function correctly.
- Filters update dashboard data without page reload.
- Refresh updates all dashboard content.
- Responsive layouts function correctly.
- Accessibility requirements are satisfied.
- Audit events are generated.
- Security rules are enforced.
- Performance targets are achieved.

---

## 39. References

This module is governed by:

- `/architecture/DOMAIN_MODEL.md`
- `/architecture/SECURITY_MODEL.md`
- `/architecture/BUSINESS_RULE_ENGINE.md`
- `/architecture/WORKFLOW_ENGINE.md`
- `/architecture/CQRS.md`
- `/docs/SYSTEM_REQUIREMENTS_SPECIFICATION.md`

---

## Conclusion

The Dashboard serves as the operational command center of the EMA Bakery Distribution Management System.

By combining role-aware KPIs, interactive charts, operational alerts, quick actions, and responsive design, the Dashboard enables users to monitor business performance and access core workflows efficiently while maintaining security, accessibility, and enterprise-grade usability standards.
