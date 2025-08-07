# Preskok Registry Dependency Order Analysis

## Current Dependency Violations Found

After analyzing the registry, here are the components that reference dependencies not yet declared:

### ❌ VIOLATIONS FOUND

#### 1. number-field (line ~237)

- **Declares**: `registryDependencies: ["button", "field"]`
- **Issue**: `button` is declared at line 30, `field` at line 181 ✅
- **Status**: ✅ OK - both dependencies declared before use

#### 2. search-field (line ~264)

- **Declares**: `registryDependencies: ["field", "loader"]`
- **Issue**: `field` at line 181, `loader` at line 105 ✅
- **Status**: ✅ OK - both dependencies declared before use

#### 3. slider (line ~278)

- **Declares**: `registryDependencies: ["field", "tooltip"]`
- **Issue**: `field` at line 181, `tooltip` at line 341 ❌
- **Status**: ❌ VIOLATION - `tooltip` used before declared

#### 4. text-field (line ~292)

- **Declares**: `registryDependencies: ["field", "loader"]`
- **Status**: ✅ OK

#### 5. dialog (line ~358)

- **Declares**: `registryDependencies: ["button"]`
- **Status**: ✅ OK

#### 6. modal (line ~371)

- **Declares**: `registryDependencies: ["dialog"]`
- **Issue**: `dialog` at line 353, `modal` at line 367
- **Status**: ✅ OK

#### 7. drawer (line ~384)

- **Declares**: `registryDependencies: ["button", "dialog"]`
- **Status**: ✅ OK

#### 8. sheet (line ~398)

- **Declares**: `registryDependencies: ["dialog"]`
- **Status**: ✅ OK

#### 9. dropdown (line ~413)

- **Declares**: `registryDependencies: ["keyboard", "separator"]`
- **Issue**: `keyboard` at line 80, `separator` at line 130 ✅
- **Status**: ✅ OK

#### 10. menu (line ~431)

- **Declares**: `registryDependencies: ["button", "dropdown", "popover"]`
- **Issue**: `popover` at line 329, `menu` at line 422
- **Status**: ✅ OK

#### 11. context-menu (line ~444)

- **Declares**: `registryDependencies: ["menu"]`
- **Status**: ✅ OK

#### 12. select (line ~460)

- **Declares**: `registryDependencies: ["button", "field", "list-box", "popover"]`
- **Issue**: `list-box` at line 469 ❌
- **Status**: ❌ VIOLATION - `list-box` used before declared

#### 13. combo-box (line ~485)

- **Declares**: `registryDependencies: ["field", "list-box", "popover"]`
- **Status**: ✅ OK (after fixing list-box)

#### 14. date-picker (line ~647)

- **Declares**: `registryDependencies: ["calendar", "date-field", "popover"]`
- **Issue**: `calendar` at line 612, `date-field` at line 628
- **Status**: ✅ OK

#### 15. date-range-picker (line ~660)

- **Declares**: `registryDependencies: ["calendar", "date-field", "popover"]`
- **Status**: ✅ OK

#### 16. range-calendar (line ~673)

- **Declares**: `registryDependencies: ["calendar"]`
- **Status**: ✅ OK

#### 17. multiple-select (line ~702)

- **Declares**: `registryDependencies: ["dropdown", "field", "popover", "tag-group"]`
- **Issue**: `tag-group` at line 724 ❌
- **Status**: ❌ VIOLATION - `tag-group` used before declared

#### 18. tag-field (line ~715)

- **Declares**: `registryDependencies: ["field", "tag-group"]`
- **Status**: ❌ VIOLATION - `tag-group` used before declared

#### 19. toggle-group (line ~757)

- **Declares**: `registryDependencies: ["toggle"]`
- **Issue**: `toggle` at line 737 ✅
- **Status**: ✅ OK

#### 20. sidebar (line ~816)

- **Declares**: `registryDependencies: ["button", "disclosure", "link", "sheet", "tooltip"]`
- **Issue**: `disclosure` at line 522, `sheet` at line 393, `tooltip` at line 341
- **Status**: ✅ OK

## Summary of Violations

### 🔴 CRITICAL ISSUES (4 violations):

1. **slider** → references `tooltip` (line 341) before it's declared
2. **select** → references `list-box` (line 469) before it's declared
3. **multiple-select** → references `tag-group` (line 724) before it's declared
4. **tag-field** → references `tag-group` (line 724) before it's declared

## Required Reordering

### Move these components earlier in the registry:

1. **tooltip** - move before `slider` (before line 273)
2. **list-box** - move before `select` (before line 455)
3. **tag-group** - move before `multiple-select` (before line 697)

### Suggested Order Sections:

1. Foundation Components (no dependencies)
2. Core utilities (tooltip, keyboard, separator, etc.)
3. Form field components
4. Layout components
5. Complex components with multiple dependencies
