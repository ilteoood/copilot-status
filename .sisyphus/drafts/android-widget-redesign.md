# Draft: Android Widget Layout Redesign

## Requirements (confirmed)

### From User Request:

- **Layout Change**: Redesign from single row with left-compacted items to 2-row centered layout
- **Top Row**: 3 evenly-spaced stat items using `justifyContent: 'space-between'`
  - Left: `xx%` + "used" label (vertical stack, centered)
  - Center: `YY` (usedQuota) + "Requests used" label (vertical stack, centered)
  - Right: `ZZ` (remaining) + "Requests left" label (vertical stack, centered)
- **Bottom Row**: `username - last update date` (single line, bottom-left)
- **New Data**: Username must be passed to widget (available in QuotaInfo)

### ASCII Target:

```
___________________________________________________________
|                                                          |
|       xx%            YY                ZZ                |
|      used       Requests used.    Requests left          |
|                                                          |
|  UserName - last update date                             |
|__________________________________________________________|
```

## Technical Decisions

### Current State (from code review):

- **Widget Config**: `minHeight: 40dp`, `targetCellHeight: 1`, `minWidth: 250dp`
- **Current Layout**: Single row with `flexDirection: 'row'`, items compacted left
- **Props**: `usedQuota`, `totalQuota`, `percentUsed`, `lastUpdated` (NO username)
- **Data Source**: `widgetTaskHandler.tsx` reads from MMKV via `quotaStorage`
- **QuotaInfo Type**: Already includes `username: string` field

### Required Changes:

1. **Widget Height**: Must increase `minHeight` from 40dp to ~60-80dp for 2 rows
   - Consider `targetCellHeight: 2` OR just increase minHeight
2. **CopilotWidgetProps**: Add `username: string` prop
3. **CopilotWidget Layout**:
   - Container: `flexDirection: 'column'`
   - Top row: 3 items with `justifyContent: 'space-between'`
   - Bottom row: username + timestamp
4. **widgetTaskHandler**: Pass `quota.username` to CopilotWidget
5. **i18n**: May need new keys for "Requests used", "Requests left"

## Research Findings

### Current i18n Keys (from en.json):

- `widget.used`: "Used"
- `widget.usedLowercase`: "used"
- `widget.left`: "Left"
- `widget.loading`: "Loading..."
- `widget.signInToView`: "Sign in to view"

### Missing i18n Keys (needed):

- "Requests used" (or reuse existing)
- "Requests left" (or reuse existing)

## Confirmed Decisions (from user)

1. **Widget Height**: Keep `targetCellHeight: 1`, increase `minHeight` to 70-80dp
2. **i18n Labels**: Use full text "Requests used" / "Requests left" (need new i18n keys)

3. **Loading/Error States**: Simple centered text (no structural placeholders)

## Scope Boundaries

### INCLUDE:

- `app.json`: Update widget minHeight configuration
- `widgets/CopilotWidget.tsx`: Full layout redesign (main, loading, error)
- `widgets/widgetTaskHandler.tsx`: Pass username prop
- `locales/en.json`: Add new i18n keys if needed

### EXCLUDE:

- iOS widget (separate Swift implementation)
- Backend/API changes
- MMKV storage changes (username already stored)
