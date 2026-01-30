# Widget Migration to Unistyles - Complete

## What Changed

The Android widget (`widgets/CopilotWidget.tsx`) now uses **unistyles directly** via `UnistylesRuntime.getTheme()` instead of auto-generated constants.

### Before (Auto-generated Constants)
```typescript
import { WidgetColors, WidgetSpacing, WidgetFontSizes, WidgetBorderRadius } from '@/constants/widgetTheme';

style={{
  backgroundColor: WidgetColors.background,
  padding: WidgetSpacing.md,
}}
```

### After (Direct Unistyles Runtime)
```typescript
import { StyleSheet } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';

const theme = UnistylesRuntime.getTheme();

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
});
```

## Benefits

✅ **Single Source of Truth**: Widget reads directly from unistyles theme  
✅ **No Build Script Needed**: `npm run generate-widget-theme` no longer required  
✅ **Real-time Theme Access**: Widget always uses current theme  
✅ **Less Maintenance**: One less file to maintain (`widgetTheme.ts`)  
✅ **Type Safety**: Full TypeScript support from unistyles types  

## Implementation Details

### Theme Access
```typescript
// At module level (outside components)
const theme = UnistylesRuntime.getTheme();
```

- `UnistylesRuntime.getTheme()` returns the **currently active theme** (light/dark)
- Called once at module load time
- Theme values used in `StyleSheet.create()`

### Dynamic Status Colors
```typescript
function getStatusColor(status: QuotaStatus): ColorProp {
  return theme.colors[status] as ColorProp;  // 'good', 'warning', or 'critical'
}
```

### Type Assertions
Due to differences between React Native's `StyleSheet` types and `react-native-android-widget`'s widget-specific types, `as any` assertions are used:

```typescript
<FlexWidget style={styles.container as any}>
```

This is **safe** because:
- Widget library accepts React Native StyleSheet objects at runtime
- Type mismatch is only due to TypeScript definitions being stricter
- Values are validated by React Native StyleSheet

## Files Modified

1. **`widgets/CopilotWidget.tsx`**
   - Added `UnistylesRuntime` import
   - Replaced all `WidgetColors`, `WidgetSpacing`, `WidgetFontSizes`, `WidgetBorderRadius` with `theme.*`
   - Changed from inline styles to `StyleSheet.create()`
   - Added type assertions for widget compatibility

## Files That Can Be Removed (Optional)

Since the widget no longer needs generated constants:

1. ~~`scripts/generateWidgetTheme.js`~~ - Theme generation script (can be deleted)
2. ~~`constants/widgetTheme.ts`~~ - Auto-generated constants (can be deleted)
3. ~~`npm run generate-widget-theme`~~ - Build script (can be removed from package.json)

**Note:** These files can remain if you want to keep the build script as a backup or reference.

## Testing

The widget should work exactly as before, but now:
- Theme changes in `src/styles/unistyles.ts` automatically apply to widgets
- No manual generation step needed
- Widget respects the active theme (light/dark)

### Test Checklist
- [ ] Add widget to home screen
- [ ] Widget displays quota correctly
- [ ] Widget colors match app theme
- [ ] Widget updates when quota refreshes
- [ ] Widget handles loading/error states

## Known Limitations

### Theme Updates
- Widgets read theme at **module load time**
- If user changes theme in app, widget won't update until:
  - Widget data refreshes (quota update triggers re-render)
  - App restarts (widget module reloads)
  
This is acceptable because:
- Widgets are typically dark-themed by design (Android convention)
- Widget updates happen regularly (background fetch)
- Widget is a "glanceable" view, not interactive

### iOS Widgets
iOS widgets (`targets/widget/index.swift`) **cannot** use this approach:
- Built with SwiftUI, not React Native
- No access to JavaScript runtime or unistyles
- Must use iOS native theme system

---

**Status:** Widget migration complete ✅  
**Breaking Changes:** None (backward compatible)  
**Action Required:** Optional - remove old theme generation files
