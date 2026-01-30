# Widget Theme Sync Update

## Change Summary

Updated Android widget to read theme preference from MMKV storage, ensuring widgets respect user's theme selection.

## Implementation

### Previous Behavior
- Widget used `UnistylesRuntime.getTheme()` at module load time
- Always used the default theme (dark)
- Did not respect user's theme preference set in Settings

### New Behavior
- Widget reads `THEME_PREFERENCE` from MMKV storage
- Respects user's theme selection (Light/Dark/System)
- Updates when Android triggers widget refresh

## Code Changes

**File:** `widgets/CopilotWidget.tsx`

### Added Theme Resolution Function
```typescript
function getWidgetTheme() {
  const themePreference = storage.getString(StorageKeys.THEME_PREFERENCE) as 'light' | 'dark' | 'system' | undefined;
  
  if (themePreference === 'system' || !themePreference) {
    // Follow system theme
    const systemColorScheme = Appearance.getColorScheme();
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  }
  
  return themePreference;
}
```

### Theme Application at Module Load
```typescript
const themeName = getWidgetTheme();
UnistylesRuntime.setTheme(themeName);
const theme = UnistylesRuntime.getTheme();
```

## How It Works

### Theme Resolution Order
1. **Read from MMKV**: Check `THEME_PREFERENCE` storage key
2. **Check Value**:
   - If `'light'` → Use light theme
   - If `'dark'` → Use dark theme
   - If `'system'` or `null` → Check device theme via `Appearance.getColorScheme()`
3. **Apply Theme**: Call `UnistylesRuntime.setTheme(themeName)`
4. **Use Theme**: Get theme object with `UnistylesRuntime.getTheme()`

### Storage Integration
- Theme preference stored in MMKV by Settings screen
- Storage key: `THEME_PREFERENCE` (defined in `services/storage.ts`)
- Values: `'light'`, `'dark'`, or `'system'`
- Persists across app restarts

## When Widget Updates

Widget reads the theme preference when:
- Widget is added to home screen
- Android triggers a scheduled widget update
- App updates widget data (API refresh)
- Device restarts

**Note:** Widget does NOT update immediately when theme changes in Settings. It updates on the next widget refresh cycle (typically within seconds to minutes, depending on Android's widget update schedule).

## Testing

### Test Scenario 1: Light Theme
1. Open Settings → Select "Light" theme
2. Wait a few seconds for widget to refresh
3. **Expected**: Widget uses light background and colors

### Test Scenario 2: Dark Theme
1. Open Settings → Select "Dark" theme
2. Wait a few seconds for widget to refresh
3. **Expected**: Widget uses dark background and colors

### Test Scenario 3: System Theme
1. Open Settings → Select "System" theme
2. Change device theme (Light ↔ Dark) in system settings
3. Wait a few seconds for widget to refresh
4. **Expected**: Widget follows device theme

### Test Scenario 4: First Install (No Preference Stored)
1. Install app fresh (or clear app data)
2. Add widget to home screen
3. **Expected**: Widget follows device theme (default behavior)

## Limitations

### Update Delay (Expected)
- **Not immediate**: Widget updates on Android's refresh schedule, not instantly when Settings changed
- **Typical delay**: Few seconds to a few minutes
- **Why**: Widgets run in separate process, can't listen to app state changes in real-time
- **Standard behavior**: Same as other Android widgets (weather, calendar, etc.)

### Workarounds to Force Update
Users can force widget update by:
- Pulling to refresh in Dashboard (triggers data sync)
- Reopening the app (may trigger widget refresh)
- Removing and re-adding widget

## Technical Notes

### Module Load Time Execution
```typescript
// This code runs ONCE when widget module loads
const themeName = getWidgetTheme();
UnistylesRuntime.setTheme(themeName);
const theme = UnistylesRuntime.getTheme();
```

- Executes when Android loads widget process
- Re-executes on each widget refresh cycle
- Does NOT re-execute when app changes theme (different process)

### Storage Access
- Uses `react-native-mmkv` for fast synchronous storage access
- No async required - MMKV is synchronous by design
- Shared storage between app and widget

### Fallback Behavior
If no preference stored (`null` or `undefined`):
- Falls back to `'system'` mode
- Reads device theme via `Appearance.getColorScheme()`
- Ensures widget always has a valid theme

## Related Files

- `widgets/CopilotWidget.tsx` - Widget component (UPDATED)
- `services/storage.ts` - Storage utilities with `THEME_PREFERENCE` key
- `app/(tabs)/settings.tsx` - Theme selection UI (writes to storage)
- `src/styles/unistyles.ts` - Theme definitions

## Migration Status

✅ **Complete** - Widget now respects user theme preference from MMKV storage

---

**Last Updated:** Phase 3 Widget Enhancement
**Status:** Ready for testing
