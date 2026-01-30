# Widget Theme Not Updating - Fix

## Problem

User reported: "I selected the dark theme but the widget is still using the light one. I tried also to refresh but nothing changed."

## Root Cause

**Module-level code execution timing issue:**

### Before (Broken):
```typescript
// ❌ Executes ONCE when module loads (at app startup)
const themeName = getWidgetTheme();
UnistylesRuntime.setTheme(themeName);
const theme = UnistylesRuntime.getTheme();

export function CopilotWidget({ ... }) {
  // Uses old theme from module load time
  const statusColor = theme.colors[status];
  // ...
}
```

**Why it failed:**
1. Theme was read **once** when the widget module first loaded
2. Changing theme in Settings updated MMKV storage
3. Widget refresh called `buildWidget()` → rendered `<CopilotWidget />`
4. But `theme` variable was still the **old value** from module load
5. Widget never re-read from storage

## Solution

**Read theme on every widget render:**

### After (Fixed):
```typescript
// ✅ Function that reads fresh theme on every call
function applyWidgetTheme() {
  const themePreference = storage.getString(StorageKeys.THEME_PREFERENCE);
  
  let themeName: 'light' | 'dark';
  if (themePreference === 'system' || !themePreference) {
    const systemColorScheme = Appearance.getColorScheme();
    themeName = systemColorScheme === 'dark' ? 'dark' : 'light';
  } else {
    themeName = themePreference;
  }
  
  UnistylesRuntime.setTheme(themeName);
  return UnistylesRuntime.getTheme();
}

export function CopilotWidget({ ... }) {
  // ✅ Reads fresh theme on EVERY render
  const theme = applyWidgetTheme();
  
  // ✅ Create styles dynamically with current theme
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      // ... uses fresh theme values
    },
  });
  
  // ...
}
```

**Why it works:**
1. User changes theme in Settings → Updates MMKV storage
2. Widget refresh calls `buildWidget()` → renders `<CopilotWidget />`
3. `CopilotWidget()` calls `applyWidgetTheme()` → **reads fresh value from MMKV**
4. Applies correct theme via `UnistylesRuntime.setTheme(themeName)`
5. Returns theme object with correct colors
6. Widget renders with new theme

## Code Changes

**File:** `widgets/CopilotWidget.tsx`

### 1. Moved theme reading into function (line 18-32)
```typescript
function applyWidgetTheme() {
  const themePreference = storage.getString(StorageKeys.THEME_PREFERENCE);
  // ... logic to determine theme
  UnistylesRuntime.setTheme(themeName);
  return UnistylesRuntime.getTheme();
}
```

### 2. Call in every widget component
```typescript
export function CopilotWidget({ ... }) {
  const theme = applyWidgetTheme(); // ✅ Fresh theme on every render
  const styles = StyleSheet.create({ /* use theme */ });
  // ...
}

export function CopilotWidgetLoading() {
  const theme = applyWidgetTheme(); // ✅ Fresh theme
  const styles = StyleSheet.create({ /* use theme */ });
  // ...
}

export function CopilotWidgetError() {
  const theme = applyWidgetTheme(); // ✅ Fresh theme
  const styles = StyleSheet.create({ /* use theme */ });
  // ...
}
```

### 3. Moved styles inside component functions
- **Before:** Module-level `const styles = StyleSheet.create(...)` with stale theme
- **After:** Component-level `const styles = StyleSheet.create(...)` with fresh theme

### 4. Added debug logging (temporary)
```typescript
console.log('[Widget] Theme preference:', themePreference, '→ Applying:', themeName);
```

## Testing Instructions

### 1. Rebuild the app
```bash
npx expo run:android
```

### 2. Test theme switching

**Step-by-step:**
1. Open app → Settings
2. Select "Dark" theme
3. Go to Home screen
4. **Observe widget** → Should now show dark background/colors
5. Go back to Settings
6. Select "Light" theme
7. Go to Home screen
8. **Observe widget** → Should now show light background/colors

### 3. Check logs

Open Android logcat to see debug output:
```bash
adb logcat | grep "Widget"
```

**Expected output:**
```
[Widget] Theme preference: dark → Applying: dark
```

### 4. Test system theme

1. Settings → Select "System"
2. Change Android system theme (Settings → Display → Dark mode)
3. Check widget follows system theme

## Expected Behavior Now

✅ Widget updates immediately when data refreshes  
✅ Widget reads fresh theme preference from MMKV  
✅ Theme changes in Settings apply on next widget update  
✅ No app restart needed  
✅ All three widget states (normal/loading/error) respect theme  

## Why Widget Still Doesn't Update "Instantly"

The widget updates when **Android triggers a widget refresh**, which happens:
- When widget data updates (API call)
- Every few seconds/minutes (Android's schedule)
- On app restart
- When widget is re-added

**This is normal Android widget behavior** - they don't have real-time reactivity like app UI.

## Performance Note

Calling `applyWidgetTheme()` on every render is **acceptable** because:
1. Widgets render infrequently (only on refresh cycles)
2. MMKV reads are extremely fast (synchronous, < 1ms)
3. `UnistylesRuntime.setTheme()` is lightweight
4. No network calls or heavy computation

## Rollback Plan

If this causes issues, revert to:
```bash
git checkout HEAD~1 -- widgets/CopilotWidget.tsx
```

## Related Files

- `widgets/CopilotWidget.tsx` - Widget component (FIXED)
- `widgets/widgetTaskHandler.tsx` - Widget refresh logic (unchanged)
- `services/storage.ts` - MMKV storage with theme key (unchanged)
- `app/(tabs)/settings.tsx` - Theme selection UI (unchanged)

---

**Status:** ✅ Fixed - Ready for testing  
**Next Step:** User needs to rebuild and test
