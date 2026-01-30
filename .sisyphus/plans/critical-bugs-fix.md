# Critical Bugs Fix - copilot-status

## TL;DR

> **Quick Summary**: Fix 3 critical bugs: OAuth flow not working (async/await issue), app crash on theme toggle (ThemeProvider mismatch), and widget theme not updating (missing sync triggers).
> 
> **Deliverables**:
> - Fixed OAuth callback with proper error handling
> - Dynamic React Navigation theme synced with Unistyles
> - Widget theme refresh on both Android and iOS
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 → (independent) | Task 2 → (independent) | Task 3 → Task 4 → Task 5 → Task 6

---

## Context

### Original Request
Fix 3 critical bugs in the React Native Expo app:
1. OAuth flow not working at all
2. App crashes when switching light → dark → light
3. Widget doesn't immediately update theme when app theme changes

### Interview Summary
**Key Discussions**:
- User provided comprehensive root cause analysis with code snippets
- All bugs have been traced to specific files and lines
- iOS widget fix requires native module creation

**Research Findings**:
- OAuth bug: `app/oauth.tsx` - navigation happens before `signIn(code)` completes (line 17-19)
- Theme crash: `app/_layout.tsx` - static `DarkTheme` in ThemeProvider (line 82)
- Widget sync: `app/(tabs)/settings.tsx` - no call to `syncToAndroidWidget()` after theme change
- iOS widget: `targets/widget/index.swift` - hardcoded background color (line 118)
- Current Unistyles themes: `src/styles/unistyles.ts` - light/dark theme definitions available

### Guardrails
- Do NOT change the OAuth authentication logic itself - only fix the await/error handling
- Do NOT modify Unistyles theme definitions - only map them to React Navigation format
- Do NOT change Android widget rendering logic - only add sync trigger
- iOS native module should be minimal - only expose WidgetCenter.reloadTimelines()

---

## Work Objectives

### Core Objective
Fix 3 critical user-facing bugs to restore OAuth login, prevent theme toggle crashes, and enable widget theme synchronization.

### Concrete Deliverables
- `app/oauth.tsx` - Fixed async/await with try-catch error handling
- `app/_layout.tsx` - Dynamic ThemeProvider computed from UnistylesRuntime
- `app/(tabs)/settings.tsx` - Call widget sync after theme changes
- `services/widgetSync.ts` - Add theme sync function for iOS
- `targets/widget/index.swift` - Theme-aware colors
- New native module for WidgetCenter.reloadTimelines()

### Definition of Done
- [ ] OAuth flow completes successfully with proper error handling
- [ ] Theme toggle (light→dark→light) works without crashes
- [ ] Android widget updates theme immediately after app theme change
- [ ] iOS widget updates theme immediately after app theme change

### Must Have
- Proper async/await pattern in OAuth callback
- Error boundary for OAuth failures
- Dynamic theme computation for React Navigation
- Widget sync trigger after theme changes

### Must NOT Have (Guardrails)
- Changes to OAuth token exchange logic (only fix await/error handling)
- Changes to Unistyles theme definitions
- Changes to Android widget rendering components
- Complex native module - keep it single-purpose
- Any breaking changes to existing API

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (no test infrastructure detected)
- **User wants tests**: Not specified - defaulting to Manual verification
- **Framework**: None
- **QA approach**: Manual verification with specific steps

### Manual Verification Procedures

Each task includes verification steps that can be executed manually to confirm the fix works.

---

## Task Dependency Graph

| Task | Depends On | Reason |
|------|------------|--------|
| Task 1 | None | Standalone OAuth fix, no dependencies |
| Task 2 | None | Standalone theme fix, no dependencies |
| Task 3 | None | Android widget sync, no dependencies |
| Task 4 | None | iOS native module creation, independent foundation |
| Task 5 | Task 4 | Swift widget needs native module to exist first for theme data |
| Task 6 | Task 4, Task 5 | Settings integration requires native module + Swift widget ready |

---

## Parallel Execution Graph

```
Wave 1 (Start immediately - all independent):
├── Task 1: Fix OAuth async/await (no dependencies)
├── Task 2: Fix ThemeProvider mismatch (no dependencies)
├── Task 3: Add Android widget theme sync (no dependencies)
└── Task 4: Create iOS WidgetCenter native module (no dependencies)

Wave 2 (After Task 4 completes):
└── Task 5: Update iOS Swift widget for theme support (depends: Task 4)

Wave 3 (After Tasks 4+5 complete):
└── Task 6: Integrate iOS widget sync in settings (depends: Task 4, Task 5)

Critical Path: Task 4 → Task 5 → Task 6
Parallel Speedup: ~60% faster than sequential (3 tasks run in parallel)
```

---

## TODOs

- [ ] 1. Fix OAuth Callback Async/Await Pattern

  **What to do**:
  - Restore proper try-catch error handling around `signIn(code)` call
  - Ensure `router.replace` only happens AFTER signIn completes or fails
  - Handle OAuth failure gracefully by redirecting to login

  **Code Change** (app/oauth.tsx lines 11-23):
  ```typescript
  useEffect(() => {
    const handleCallback = async () => {
      const code = params.code as string;
      if (code) {
        try {
          await signIn(code);
          router.replace('/(tabs)');
        } catch (error) {
          console.error('OAuth sign-in failed:', error);
          router.replace('/(auth)/login');
        }
      } else {
        router.replace('/(auth)/login');
      }
    };

    handleCallback();
  }, [params, signIn]);
  ```

  **Must NOT do**:
  - Change the signIn function implementation
  - Modify the OAuth configuration
  - Add retry logic (out of scope)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file, ~15 lines change, straightforward async/await pattern fix
  - **Skills**: [`git-master`]
    - `git-master`: Atomic commit with clear message for this isolated fix
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: No UI changes, just control flow fix
    - `playwright`: Not needed for code fix, verification is manual

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: None
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `app/oauth.tsx:11-23` - Current broken implementation to fix

  **API/Type References**:
  - `stores/auth.ts:signIn` - The async function being called

  **Documentation References**:
  - Git history: commit 61e5131 "fix: login" - shows what was broken

  **WHY Each Reference Matters**:
  - oauth.tsx shows the exact code pattern to fix
  - The signIn function signature confirms it's async and needs await

  **Acceptance Criteria**:

  **Automated Verification (Bash):**
  ```bash
  # Verify the code structure after fix:
  grep -A 10 "if (code)" app/oauth.tsx | grep -q "try {" && echo "PASS: try-catch exists" || echo "FAIL: missing try-catch"
  grep -A 15 "if (code)" app/oauth.tsx | grep -q "catch (error)" && echo "PASS: catch block exists" || echo "FAIL: missing catch"
  grep -A 5 "await signIn" app/oauth.tsx | grep -q "router.replace" && echo "PASS: navigation after await" || echo "FAIL: navigation structure wrong"
  ```

  **Manual Verification (Frontend/OAuth flow):**
  ```
  1. Start app: npx expo start
  2. Navigate to login screen
  3. Tap "Sign in with GitHub"
  4. Complete OAuth in browser
  5. Verify: App navigates to tabs screen after auth completes
  6. Verify: No premature navigation during token exchange
  ```

  **Evidence to Capture:**
  - [ ] Terminal output from grep verification commands
  - [ ] Console logs showing OAuth flow completion

  **Commit**: YES
  - Message: `fix(oauth): await signIn before navigation to prevent race condition`
  - Files: `app/oauth.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 2. Fix React Navigation ThemeProvider Dynamic Theme

  **What to do**:
  - Import LightTheme from @react-navigation/native
  - Create a hook or state to track current Unistyles theme
  - Map Unistyles theme to React Navigation theme format
  - Update ThemeProvider value dynamically
  - Update StatusBar style based on current theme

  **Code Change** (app/_layout.tsx):
  ```typescript
  import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
  import { StyleSheet, UnistylesRuntime, useUnistyles } from 'react-native-unistyles';
  
  // Inside RootLayout:
  const { theme: unistylesTheme } = useUnistyles();
  
  // Compute navigation theme from current Unistyles theme
  const navigationTheme = UnistylesRuntime.themeName === 'dark' ? DarkTheme : DefaultTheme;
  
  // In return:
  <ThemeProvider value={navigationTheme}>
    ...
    <StatusBar style={UnistylesRuntime.themeName === 'dark' ? 'light' : 'dark'} />
  </ThemeProvider>
  ```

  **Must NOT do**:
  - Modify Unistyles theme definitions in src/styles/unistyles.ts
  - Create custom React Navigation theme (use built-in DarkTheme/DefaultTheme)
  - Change the theme toggle logic in settings.tsx

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file change, ~10 lines, straightforward theme mapping
  - **Skills**: [`frontend-ui-ux`, `git-master`]
    - `frontend-ui-ux`: Understanding theme systems and proper integration
    - `git-master`: Clean atomic commit
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not needed for this code change

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4)
  - **Blocks**: None
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `app/_layout.tsx:82` - Current static DarkTheme usage to fix
  - `app/_layout.tsx:57-67` - Existing UnistylesRuntime usage pattern
  - `app/(tabs)/settings.tsx:17` - Example of useUnistyles hook usage

  **API/Type References**:
  - `src/styles/unistyles.ts:76-112` - Light/dark theme color definitions

  **External References**:
  - React Navigation theming docs: https://reactnavigation.org/docs/themes/

  **WHY Each Reference Matters**:
  - _layout.tsx line 82 shows exactly where to make the change
  - settings.tsx shows how to use useUnistyles hook pattern
  - unistyles.ts shows available theme names ('light', 'dark')

  **Acceptance Criteria**:

  **Automated Verification (Bash):**
  ```bash
  # Verify dynamic theme usage:
  grep -q "DefaultTheme" app/_layout.tsx && echo "PASS: DefaultTheme imported" || echo "FAIL: missing DefaultTheme"
  grep -q "UnistylesRuntime.themeName" app/_layout.tsx && echo "PASS: theme detection exists" || echo "FAIL: no theme detection"
  ! grep -q 'value={DarkTheme}' app/_layout.tsx && echo "PASS: no static DarkTheme" || echo "FAIL: still using static DarkTheme"
  ```

  **Manual Verification (Frontend/Theme toggle):**
  ```
  1. Start app: npx expo start
  2. Go to Settings tab
  3. Select "Light" theme - verify entire app changes including navigation
  4. Select "Dark" theme - verify theme changes
  5. Select "System" theme - verify follows system
  6. Rapidly toggle: Light → Dark → Light → Dark (5+ times)
  7. Verify: NO crash occurs during rapid toggling
  ```

  **Evidence to Capture:**
  - [ ] Terminal output from grep verification commands
  - [ ] No crash logs during theme toggle testing

  **Commit**: YES
  - Message: `fix(theme): dynamically sync React Navigation theme with Unistyles`
  - Files: `app/_layout.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 3. Add Android Widget Theme Sync Trigger

  **What to do**:
  - Import syncToAndroidWidget from widgetSync (or call directly)
  - Call widget sync after theme change in handleThemeChange function
  - Ensure widget updates immediately when theme changes

  **Code Change** (app/(tabs)/settings.tsx):
  ```typescript
  import { syncQuotaToWidgets } from '@/services/widgetSync';
  import { Platform } from 'react-native';
  
  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setThemePreference(newTheme);
    themeStorage.setThemePreference(newTheme);

    if (newTheme === 'system') {
      UnistylesRuntime.setAdaptiveThemes(true);
    } else {
      UnistylesRuntime.setAdaptiveThemes(false);
      UnistylesRuntime.setTheme(newTheme);
    }
    
    // Trigger widget update for theme change
    if (Platform.OS === 'android') {
      const { updateWidget } = await import('@/widgets/widgetTaskHandler');
      await updateWidget();
    }
  };
  ```

  **Must NOT do**:
  - Modify the Android widget rendering component
  - Change how theme preference is stored
  - Add iOS widget sync here (separate task)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file, ~5 lines addition, simple function call
  - **Skills**: [`git-master`]
    - `git-master`: Atomic commit for this small change
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: No UI changes, just adding a function call

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4)
  - **Blocks**: None
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `app/(tabs)/settings.tsx:35-45` - Current handleThemeChange function to modify
  - `widgets/widgetTaskHandler.tsx:92-97` - updateWidget function to call

  **API/Type References**:
  - `services/widgetSync.ts:41-46` - Alternative syncToAndroidWidget function

  **WHY Each Reference Matters**:
  - settings.tsx shows exactly where to add the widget update call
  - widgetTaskHandler.tsx shows the updateWidget export to use

  **Acceptance Criteria**:

  **Automated Verification (Bash):**
  ```bash
  # Verify widget sync is called:
  grep -A 15 "handleThemeChange" app/\(tabs\)/settings.tsx | grep -q "updateWidget" && echo "PASS: updateWidget called" || echo "FAIL: missing updateWidget call"
  grep -q "Platform.OS === 'android'" app/\(tabs\)/settings.tsx && echo "PASS: platform check exists" || echo "FAIL: missing platform check"
  ```

  **Manual Verification (Android device/emulator):**
  ```
  1. Install app on Android: npx expo run:android
  2. Add Copilot Status widget to home screen
  3. Open app → Settings → Change theme to Light
  4. Verify: Widget immediately updates (background color changes)
  5. Change theme to Dark
  6. Verify: Widget immediately updates (background color changes)
  ```

  **Evidence to Capture:**
  - [ ] Terminal output from grep verification
  - [ ] Widget visually updates after theme change

  **Commit**: YES
  - Message: `fix(widget): trigger Android widget update on theme change`
  - Files: `app/(tabs)/settings.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [ ] 4. Create iOS WidgetCenter Native Module

  **What to do**:
  - Create a new native module to expose WidgetCenter.reloadTimelines()
  - Register the module with React Native
  - Export a function callable from JavaScript

  **Implementation**:
  
  Create `ios/CopilotStatus/WidgetModule.swift`:
  ```swift
  import Foundation
  import WidgetKit
  
  @objc(WidgetModule)
  class WidgetModule: NSObject {
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
      return false
    }
    
    @objc
    func reloadAllTimelines() {
      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadAllTimelines()
      }
    }
  }
  ```
  
  Create `ios/CopilotStatus/WidgetModule.m`:
  ```objc
  #import <React/RCTBridgeModule.h>
  
  @interface RCT_EXTERN_MODULE(WidgetModule, NSObject)
  
  RCT_EXTERN_METHOD(reloadAllTimelines)
  
  @end
  ```

  **Must NOT do**:
  - Add complex logic to the native module
  - Modify existing iOS native code
  - Add error handling beyond iOS version check

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Native iOS module requires Swift/ObjC knowledge, not complex but specialized
  - **Skills**: [`git-master`]
    - `git-master`: Atomic commit for native module
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: This is native iOS code, not frontend
    - No Swift-specific skill available

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3)
  - **Blocks**: Task 5, Task 6
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `ios/` directory - Location for native modules

  **External References**:
  - React Native Native Modules (iOS): https://reactnative.dev/docs/native-modules-ios
  - WidgetKit WidgetCenter: https://developer.apple.com/documentation/widgetkit/widgetcenter

  **WHY Each Reference Matters**:
  - Native Modules docs show the Swift/ObjC bridge pattern
  - WidgetCenter docs confirm the API: reloadAllTimelines()

  **Acceptance Criteria**:

  **Automated Verification (Bash):**
  ```bash
  # Verify files created:
  test -f ios/CopilotStatus/WidgetModule.swift && echo "PASS: Swift file exists" || echo "FAIL: missing Swift file"
  test -f ios/CopilotStatus/WidgetModule.m && echo "PASS: ObjC bridge file exists" || echo "FAIL: missing ObjC file"
  grep -q "WidgetCenter.shared.reloadAllTimelines" ios/CopilotStatus/WidgetModule.swift && echo "PASS: reloadAllTimelines call exists" || echo "FAIL: missing reload call"
  ```

  **Build Verification:**
  ```bash
  # Verify iOS build succeeds:
  cd ios && xcodebuild -workspace CopilotStatus.xcworkspace -scheme CopilotStatus -configuration Debug -sdk iphonesimulator build | tail -5
  # Should show: ** BUILD SUCCEEDED **
  ```

  **Evidence to Capture:**
  - [ ] Native module files exist in ios/ directory
  - [ ] iOS build succeeds with native module

  **Commit**: YES
  - Message: `feat(ios): add native module for WidgetCenter.reloadTimelines`
  - Files: `ios/CopilotStatus/WidgetModule.swift`, `ios/CopilotStatus/WidgetModule.m`
  - Pre-commit: iOS build check

---

- [ ] 5. Update iOS Swift Widget for Theme Support

  **What to do**:
  - Add theme preference reading from App Group UserDefaults
  - Create light/dark theme color sets
  - Apply theme colors based on stored preference
  - Update widgetSync.ts to write theme preference to iOS

  **Code Changes**:

  **services/widgetSync.ts** - Add theme sync for iOS:
  ```typescript
  async function syncThemeToiOSWidget(theme: 'light' | 'dark' | 'system'): Promise<void> {
    try {
      await SharedGroupPreferences.setItem(
        'theme_preference',
        theme,
        IOS_APP_GROUP
      );
    } catch {}
  }
  
  export async function syncThemeToWidgets(theme: 'light' | 'dark' | 'system'): Promise<void> {
    if (Platform.OS === 'ios') {
      await syncThemeToiOSWidget(theme);
      // Trigger widget reload via native module
      const { NativeModules } = require('react-native');
      NativeModules.WidgetModule?.reloadAllTimelines?.();
    }
  }
  ```

  **targets/widget/index.swift** - Add theme support:
  ```swift
  // Add theme struct
  struct WidgetTheme {
      let background: Color
      let text: Color
      let secondaryText: Color
      
      static let dark = WidgetTheme(
          background: Color(red: 0.08, green: 0.09, blue: 0.09),
          text: Color(red: 0.93, green: 0.93, blue: 0.93),
          secondaryText: .secondary
      )
      
      static let light = WidgetTheme(
          background: Color(red: 0.98, green: 0.98, blue: 0.98),
          text: Color(red: 0.07, green: 0.09, blue: 0.11),
          secondaryText: .secondary
      )
  }
  
  // In Provider, add theme loading:
  private func loadTheme() -> WidgetTheme {
      guard let userDefaults = UserDefaults(suiteName: appGroupId),
            let theme = userDefaults.string(forKey: "theme_preference") else {
          return .dark
      }
      
      switch theme {
      case "light": return .light
      case "dark": return .dark
      default: return .dark // system defaults to dark
      }
  }
  
  // Update containerBackground in QuotaView and ErrorView to use theme
  ```

  **Must NOT do**:
  - Change widget layout or size
  - Modify quota data display logic
  - Add complex theme interpolation

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Requires Swift knowledge + TypeScript, moderate complexity
  - **Skills**: [`git-master`]
    - `git-master`: Atomic commit across Swift + TS files
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Swift widget is native, not React

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential after Wave 1)
  - **Blocks**: Task 6
  - **Blocked By**: Task 4 (native module must exist first)

  **References**:

  **Pattern References**:
  - `targets/widget/index.swift:117-119` - Current hardcoded background color
  - `targets/widget/index.swift:32-36` - UserDefaults reading pattern
  - `services/widgetSync.ts:30-39` - iOS sync pattern to follow
  - `src/styles/unistyles.ts:76-112` - Theme colors to replicate in Swift

  **API/Type References**:
  - `services/widgetSync.ts:IOS_APP_GROUP` - App group identifier

  **WHY Each Reference Matters**:
  - Swift widget shows where to add theme colors
  - widgetSync.ts shows the pattern for writing to App Group
  - unistyles.ts provides the exact color values to use

  **Acceptance Criteria**:

  **Automated Verification (Bash):**
  ```bash
  # Verify Swift theme support:
  grep -q "WidgetTheme" targets/widget/index.swift && echo "PASS: WidgetTheme struct exists" || echo "FAIL: missing WidgetTheme"
  grep -q "theme_preference" targets/widget/index.swift && echo "PASS: theme preference reading" || echo "FAIL: no theme reading"
  grep -q "syncThemeToWidgets" services/widgetSync.ts && echo "PASS: theme sync function" || echo "FAIL: missing theme sync"
  ```

  **Evidence to Capture:**
  - [ ] Swift widget contains theme definitions
  - [ ] widgetSync.ts contains theme sync function

  **Commit**: YES
  - Message: `feat(widget): add theme support to iOS widget`
  - Files: `targets/widget/index.swift`, `services/widgetSync.ts`
  - Pre-commit: iOS build + `npx tsc --noEmit`

---

- [ ] 6. Integrate iOS Widget Theme Sync in Settings

  **What to do**:
  - Import syncThemeToWidgets from widgetSync
  - Call it in handleThemeChange for iOS platform
  - Combine with existing Android logic

  **Code Change** (app/(tabs)/settings.tsx):
  ```typescript
  import { syncThemeToWidgets } from '@/services/widgetSync';
  
  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setThemePreference(newTheme);
    themeStorage.setThemePreference(newTheme);

    if (newTheme === 'system') {
      UnistylesRuntime.setAdaptiveThemes(true);
    } else {
      UnistylesRuntime.setAdaptiveThemes(false);
      UnistylesRuntime.setTheme(newTheme);
    }
    
    // Sync theme to widgets (works for both platforms)
    if (Platform.OS === 'android') {
      const { updateWidget } = await import('@/widgets/widgetTaskHandler');
      await updateWidget();
    } else if (Platform.OS === 'ios') {
      await syncThemeToWidgets(newTheme);
    }
  };
  ```

  **Must NOT do**:
  - Change Android sync logic (already done in Task 3)
  - Modify theme preference storage
  - Add error handling beyond what exists

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small addition to existing function, ~5 lines
  - **Skills**: [`git-master`]
    - `git-master`: Atomic commit for final integration
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: No UI changes

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (final)
  - **Blocks**: None (final task)
  - **Blocked By**: Task 4, Task 5 (native module + Swift widget must be ready)

  **References**:

  **Pattern References**:
  - `app/(tabs)/settings.tsx:35-45` - handleThemeChange function (after Task 3)
  - `services/widgetSync.ts:syncThemeToWidgets` - Function to call (created in Task 5)

  **WHY Each Reference Matters**:
  - settings.tsx shows where to add the iOS sync call
  - widgetSync.ts provides the function to import and call

  **Acceptance Criteria**:

  **Automated Verification (Bash):**
  ```bash
  # Verify iOS sync integration:
  grep -q "syncThemeToWidgets" app/\(tabs\)/settings.tsx && echo "PASS: syncThemeToWidgets imported" || echo "FAIL: missing import"
  grep -q "Platform.OS === 'ios'" app/\(tabs\)/settings.tsx && echo "PASS: iOS platform check" || echo "FAIL: missing iOS check"
  ```

  **Manual Verification (iOS device/simulator):**
  ```
  1. Install app on iOS: npx expo run:ios
  2. Add Copilot Status widget to home screen
  3. Open app → Settings → Change theme to Light
  4. Verify: Widget immediately updates (background becomes light)
  5. Change theme to Dark
  6. Verify: Widget immediately updates (background becomes dark)
  ```

  **Evidence to Capture:**
  - [ ] Terminal output from grep verification
  - [ ] iOS widget visually updates after theme change

  **Commit**: YES
  - Message: `fix(widget): trigger iOS widget update on theme change`
  - Files: `app/(tabs)/settings.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `fix(oauth): await signIn before navigation to prevent race condition` | `app/oauth.tsx` | `npx tsc --noEmit` |
| 2 | `fix(theme): dynamically sync React Navigation theme with Unistyles` | `app/_layout.tsx` | `npx tsc --noEmit` |
| 3 | `fix(widget): trigger Android widget update on theme change` | `app/(tabs)/settings.tsx` | `npx tsc --noEmit` |
| 4 | `feat(ios): add native module for WidgetCenter.reloadTimelines` | `ios/CopilotStatus/Widget*.{swift,m}` | iOS build |
| 5 | `feat(widget): add theme support to iOS widget` | `targets/widget/index.swift`, `services/widgetSync.ts` | iOS build + tsc |
| 6 | `fix(widget): trigger iOS widget update on theme change` | `app/(tabs)/settings.tsx` | `npx tsc --noEmit` |

---

## Success Criteria

### Verification Commands
```bash
# TypeScript check
npx tsc --noEmit
# Expected: No errors

# iOS build (from project root)
npx expo run:ios --no-install
# Expected: BUILD SUCCEEDED

# Android build
npx expo run:android --no-install
# Expected: BUILD SUCCESSFUL
```

### Final Checklist
- [ ] OAuth flow completes without race condition
- [ ] Theme toggle (rapid light↔dark) causes no crash
- [ ] Android widget updates immediately on theme change
- [ ] iOS widget updates immediately on theme change
- [ ] All TypeScript compiles without errors
- [ ] iOS native build succeeds
- [ ] Android native build succeeds
