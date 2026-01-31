# Android Widget Layout Redesign

## TL;DR

> **Quick Summary**: Redesign the Android home screen widget from a single-row horizontal layout to a 2-row vertical layout with 3 evenly-spaced stat columns and a username/timestamp footer.
>
> **Deliverables**:
>
> - Updated widget height configuration in `app.json`
> - Redesigned `CopilotWidget` component with 2-row layout
> - New i18n keys for "Requests used" / "Requests left"
> - Username prop passed through widget data flow
>
> **Estimated Effort**: Short (2-3 hours)
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1 (i18n) + Task 2 (config) → Task 3 (layout) → Task 4 (handler) → Task 5 (verify)

---

## Context

### Original Request

Redesign the Android widget layout to match this specification:

```
___________________________________________________________
|                                                          |
|       xx%            YY                ZZ                |
|      used       Requests used.    Requests left          |
|                                                          |
|  UserName - last update date                             |
|__________________________________________________________|
```

### Interview Summary

**Key Discussions**:

- **Layout Change**: From single-row horizontal (items left-compacted) to 2-row vertical
- **Top Row**: 3 evenly-spaced stat columns using `justifyContent: 'space-between'`
- **Bottom Row**: Username + timestamp in format "username - last update date"
- **Widget Height**: Keep `targetCellHeight: 1`, increase `minHeight` to 70dp
- **Labels**: Use "Requests used" / "Requests left" (new i18n keys needed)
- **Loading/Error States**: Keep simple centered text (no structural changes)

**Research Findings**:

- `react-native-android-widget` FlexWidget fully supports required layout properties
- ShopifyWidget example from library repo demonstrates similar multi-row metrics pattern
- Username already exists in `QuotaInfo` type, just needs to be passed to widget

---

## Work Objectives

### Core Objective

Transform the Android widget from a compact horizontal layout to a more readable 2-row vertical layout with username display.

### Concrete Deliverables

- `app.json`: Widget `minHeight` changed from `40dp` to `70dp`
- `locales/en.json`: New keys `widget.requestsUsed` and `widget.requestsLeft`
- `widgets/CopilotWidget.tsx`: New 2-row layout with `username` prop
- `widgets/widgetTaskHandler.tsx`: Pass `username` from `QuotaInfo` to widget

### Definition of Done

- [ ] `npx tsc --noEmit` passes with no errors in modified files
- [ ] Widget component renders with new 2-row structure
- [ ] Username displays in bottom row

### Must Have

- 3 stat columns evenly spaced across top row (percentage, used count, remaining)
- Each stat column: value above, label below, center-aligned
- Bottom row with username and timestamp
- Existing color logic preserved (status color for percentage)

### Must NOT Have (Guardrails)

- DO NOT modify iOS widget (`targets/widget/index.swift`)
- DO NOT change MMKV storage structure or keys
- DO NOT add new dependencies
- DO NOT modify `CopilotWidgetLoading` or `CopilotWidgetError` layout structure
- DO NOT change widget update/refresh logic
- DO NOT add excessive padding that would cause content overflow

---

## Verification Strategy (MANDATORY)

### Test Decision

- **Infrastructure exists**: NO (widgets are not unit tested in this project)
- **User wants tests**: Manual verification via LSP diagnostics
- **Framework**: N/A

### Automated Verification (LSP Diagnostics)

Each task will be verified using LSP diagnostics to ensure type safety and no compilation errors.

**Verification Command:**

```bash
npx tsc --noEmit
```

**Evidence Requirements:**

- LSP diagnostics show no errors in modified files
- TypeScript compilation succeeds

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Add i18n keys (no dependencies)
└── Task 2: Update widget config in app.json (no dependencies)

Wave 2 (After Wave 1):
└── Task 3: Redesign CopilotWidget layout (depends: 1, 2)

Wave 3 (After Wave 2):
└── Task 4: Update widgetTaskHandler to pass username (depends: 3)

Wave 4 (After Wave 3):
└── Task 5: Verify with LSP diagnostics (depends: 4)

Critical Path: Task 1/2 → Task 3 → Task 4 → Task 5
Parallel Speedup: ~20% faster (Wave 1 tasks parallel)
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
| ---- | ---------- | ------ | -------------------- |
| 1    | None       | 3      | 2                    |
| 2    | None       | 3      | 1                    |
| 3    | 1, 2       | 4      | None                 |
| 4    | 3          | 5      | None                 |
| 5    | 4          | None   | None (final)         |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents                                               |
| ---- | ----- | ---------------------------------------------------------------- |
| 1    | 1, 2  | `category='quick'` - Simple config edits                         |
| 2    | 3     | `category='quick', load_skills=['frontend-ui-ux']` - Layout work |
| 3    | 4     | `category='quick'` - Simple prop passing                         |
| 4    | 5     | `category='quick'` - Verification                                |

---

## TODOs

- [ ] 1. Add i18n keys for new stat labels

  **What to do**:
  - Add `widget.requestsUsed`: "Requests used" to `locales/en.json`
  - Add `widget.requestsLeft`: "Requests left" to `locales/en.json`

  **Must NOT do**:
  - Do not modify existing keys
  - Do not add keys for other locales (only en.json exists)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple JSON file edit, single file, <5 lines change
  - **Skills**: `[]`
    - No specialized skills needed for JSON editing

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 3
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `locales/en.json:54-61` - Existing widget i18n keys structure

  **Acceptance Criteria**:

  ```bash
  # Verify keys exist in JSON
  bun -e "const en = require('./locales/en.json'); console.log(en.widget.requestsUsed, en.widget.requestsLeft)"
  # Expected: "Requests used" "Requests left"
  ```

  **Commit**: YES (groups with 2)
  - Message: `feat(widget): add i18n keys for redesigned layout`
  - Files: `locales/en.json`

---

- [ ] 2. Update widget height configuration

  **What to do**:
  - Change `minHeight` from `"40dp"` to `"70dp"` in `app.json`
  - Keep `targetCellHeight: 1` unchanged

  **Must NOT do**:
  - Do not change `targetCellWidth` or `targetCellHeight`
  - Do not modify other widget properties (updatePeriodMillis, resizeMode, etc.)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple JSON config edit, single line change
  - **Skills**: `[]`
    - No specialized skills needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `app.json:47-59` - Widget configuration block in expo plugins

  **Acceptance Criteria**:

  ```bash
  # Verify minHeight is 70dp
  bun -e "const app = require('./app.json'); console.log(app.expo.plugins.find(p => Array.isArray(p) && p[0] === 'react-native-android-widget')[1].widgets[0].minHeight)"
  # Expected: "70dp"
  ```

  **Commit**: YES (groups with 1)
  - Message: `feat(widget): add i18n keys for redesigned layout`
  - Files: `app.json`

---

- [ ] 3. Redesign CopilotWidget layout to 2-row structure

  **What to do**:
  1. **Add `username` prop** to `CopilotWidgetProps` interface:

     ```typescript
     interface CopilotWidgetProps {
       usedQuota: number;
       totalQuota: number;
       percentUsed: number;
       lastUpdated: string;
       username: string; // ADD THIS
     }
     ```

  2. **Update function signature** to destructure `username`

  3. **Redesign container layout**:
     - Change `flexDirection: 'row'` → `flexDirection: 'column'`
     - Keep `justifyContent: 'space-between'`
     - This creates 2 rows: top stats, bottom info

  4. **Create top row** (stats row):
     - FlexWidget with `flexDirection: 'row'`, `justifyContent: 'space-between'`, `width: 'match_parent'`
     - Contains 3 stat columns

  5. **Create 3 stat columns** (each is a vertical stack):

     **Left column (percentage)**:

     ```tsx
     <FlexWidget style={{ alignItems: 'center' }}>
       <TextWidget text={`${Math.round(percentUsed)}%`} style={/* large, statusColor */} />
       <TextWidget text={i18n.t('widget.usedLowercase')} style={/* small, muted */} />
     </FlexWidget>
     ```

     **Center column (used count)**:

     ```tsx
     <FlexWidget style={{ alignItems: 'center' }}>
       <TextWidget text={usedQuota.toLocaleString()} style={/* medium, text color */} />
       <TextWidget text={i18n.t('widget.requestsUsed')} style={/* small, muted */} />
     </FlexWidget>
     ```

     **Right column (remaining count)**:

     ```tsx
     <FlexWidget style={{ alignItems: 'center' }}>
       <TextWidget text={remaining.toLocaleString()} style={/* medium, good color */} />
       <TextWidget text={i18n.t('widget.requestsLeft')} style={/* small, muted */} />
     </FlexWidget>
     ```

  6. **Create bottom row** (username + timestamp):

     ```tsx
     <TextWidget
       text={`${username} - ${lastUpdated}`}
       style={{ fontSize: xs, color: icon, alignSelf: 'flex-start' }}
     />
     ```

  7. **Update styles object**:
     - Remove old `leftSection`, `percentageContainer`, `statsRow`, `statItem` styles
     - Add new styles: `topRow`, `statColumn`, `statValue`, `statLabel`, `bottomRow`
     - Reduce font sizes slightly to fit in compact height (percentage: 2xl instead of 3xl)

  **Must NOT do**:
  - Do not modify `CopilotWidgetLoading` component layout
  - Do not modify `CopilotWidgetError` component layout
  - Do not change `applyWidgetTheme()` function
  - Do not change `getStatusColor()` logic
  - Do not remove any existing i18n usage

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file React component edit, well-defined layout changes
  - **Skills**: `['frontend-ui-ux']`
    - `frontend-ui-ux`: Layout redesign with flexbox, spacing, typography considerations

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential)
  - **Blocks**: Task 4
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `widgets/CopilotWidget.tsx:30-152` - Current CopilotWidget component to redesign
  - `widgets/CopilotWidget.tsx:48-106` - Current styles object structure

  **Type References**:
  - `widgets/CopilotWidget.tsx:9-14` - CopilotWidgetProps interface to extend

  **External References**:
  - ShopifyWidget example: Multi-row metrics layout pattern (from librarian research)
  - FlexWidget docs: `justifyContent: 'space-between'` for even spacing

  **Acceptance Criteria**:

  ```bash
  # Verify TypeScript compiles without errors
  npx tsc --noEmit 2>&1 | grep -E "CopilotWidget|error" || echo "No errors"
  # Expected: "No errors" or empty output
  ```

  ```bash
  # Verify username prop exists in interface
  grep -A5 "interface CopilotWidgetProps" widgets/CopilotWidget.tsx | grep "username"
  # Expected: line containing "username: string"
  ```

  ```bash
  # Verify new i18n keys are used
  grep "widget.requestsUsed\|widget.requestsLeft" widgets/CopilotWidget.tsx
  # Expected: Two lines showing usage of these keys
  ```

  **Commit**: NO (groups with 4)

---

- [ ] 4. Update widgetTaskHandler to pass username prop

  **What to do**:
  - In `buildWidget()` function, pass `username={quota.username}` to `<CopilotWidget />`

  **Current code** (line 41-48):

  ```tsx
  return (
    <CopilotWidget
      usedQuota={quota.usedQuota}
      totalQuota={quota.totalQuota}
      percentUsed={percentUsed}
      lastUpdated={lastUpdated}
    />
  );
  ```

  **Updated code**:

  ```tsx
  return (
    <CopilotWidget
      usedQuota={quota.usedQuota}
      totalQuota={quota.totalQuota}
      percentUsed={percentUsed}
      lastUpdated={lastUpdated}
      username={quota.username}
    />
  );
  ```

  **Must NOT do**:
  - Do not modify `getWidgetData()` function
  - Do not modify `widgetTaskHandler()` function
  - Do not modify `updateWidget()` function
  - Do not change any storage/MMKV logic

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single line addition in one file
  - **Skills**: `[]`
    - No specialized skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (sequential)
  - **Blocks**: Task 5
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `widgets/widgetTaskHandler.tsx:41-48` - Current CopilotWidget invocation to update

  **Type References**:
  - `types/quota.ts:3-10` - QuotaInfo type showing username field exists

  **Acceptance Criteria**:

  ```bash
  # Verify username prop is passed
  grep "username={quota.username}" widgets/widgetTaskHandler.tsx
  # Expected: line showing username prop
  ```

  ```bash
  # Verify TypeScript compiles
  npx tsc --noEmit 2>&1 | grep -E "widgetTaskHandler|error" || echo "No errors"
  # Expected: "No errors"
  ```

  **Commit**: YES
  - Message: `feat(widget): redesign Android widget to 2-row layout with username`
  - Files: `widgets/CopilotWidget.tsx`, `widgets/widgetTaskHandler.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 5. Verify all changes with LSP diagnostics

  **What to do**:
  - Run TypeScript compiler to verify no type errors
  - Check LSP diagnostics for all modified files
  - Ensure no regressions in existing code

  **Must NOT do**:
  - Do not make any code changes in this task
  - Do not run the app or widget preview

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Verification-only task, no code changes
  - **Skills**: `[]`
    - No specialized skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (final)
  - **Blocks**: None (final task)
  - **Blocked By**: Task 4

  **References**:

  **Files to verify**:
  - `locales/en.json` - i18n keys
  - `app.json` - widget config
  - `widgets/CopilotWidget.tsx` - main layout changes
  - `widgets/widgetTaskHandler.tsx` - prop passing

  **Acceptance Criteria**:

  ```bash
  # Full TypeScript verification
  npx tsc --noEmit
  # Expected: Exit code 0, no output
  ```

  ```bash
  # Verify JSON files are valid
  bun -e "require('./app.json'); require('./locales/en.json'); console.log('JSON valid')"
  # Expected: "JSON valid"
  ```

  **Commit**: NO (verification only)

---

## Commit Strategy

| After Task | Message                                                               | Files                                                        | Verification       |
| ---------- | --------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------ |
| 1 + 2      | `feat(widget): add i18n keys for redesigned layout`                   | `locales/en.json`, `app.json`                                | JSON valid         |
| 3 + 4      | `feat(widget): redesign Android widget to 2-row layout with username` | `widgets/CopilotWidget.tsx`, `widgets/widgetTaskHandler.tsx` | `npx tsc --noEmit` |

---

## Success Criteria

### Verification Commands

```bash
# TypeScript compilation
npx tsc --noEmit  # Expected: exit 0, no output

# JSON validity
bun -e "require('./app.json'); require('./locales/en.json'); console.log('OK')"  # Expected: OK

# i18n keys exist
bun -e "const en = require('./locales/en.json'); console.log(en.widget.requestsUsed && en.widget.requestsLeft ? 'Keys OK' : 'MISSING')"  # Expected: Keys OK

# Widget config updated
bun -e "const app = require('./app.json'); const w = app.expo.plugins.find(p => Array.isArray(p) && p[0] === 'react-native-android-widget')[1].widgets[0]; console.log(w.minHeight)"  # Expected: 70dp
```

### Final Checklist

- [ ] All "Must Have" present:
  - [ ] 3 stat columns evenly spaced in top row
  - [ ] Each stat column has value above, label below, center-aligned
  - [ ] Bottom row shows username and timestamp
  - [ ] Status color logic preserved for percentage
- [ ] All "Must NOT Have" absent:
  - [ ] iOS widget unchanged
  - [ ] MMKV storage unchanged
  - [ ] No new dependencies
  - [ ] Loading/Error layouts unchanged
- [ ] All verification commands pass
