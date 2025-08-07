# Preskok UI Component Dependency Audit

This document tracks the analysis of component dependencies and identifies missing `registryDependencies`.

## Components with Missing registryDependencies

### 🔴 Missing Dependencies Found

#### 1. color-area

- **Current**: `dependencies: ["react-aria-components", "tailwind-merge"]`
- **Missing**: `registryDependencies: ["color-thumb"]`
- **Reason**: Imports `ColorThumb` from `./color-thumb`
- **Status**: ✅ FIXED

#### 2. color-wheel

- **Current**: `registryDependencies: ["color-thumb"]`
- **Reason**: Imports `ColorThumb` from `./color-thumb`
- **Status**: ✅ FIXED

#### 3. color-slider

- **Current**: `registryDependencies: ["color-thumb", "field"]`
- **Reason**: Imports `ColorThumb` and `Label` from field
- **Status**: ✅ FIXED

#### 4. color-swatch-picker

- **Current**: `registryDependencies: ["color-swatch"]`
- **Reason**: Imports `ColorSwatch` from `./color-swatch`
- **Status**: ✅ FIXED

#### 5. tracker

- **Current**: `registryDependencies: ["tooltip"]` ✅ CORRECT
- **Status**: ✅ ALREADY CORRECT

#### 6. tag-field

- **Current**: `registryDependencies: ["field", "tag-group"]` ✅ CORRECT
- **Status**: ✅ ALREADY CORRECT

#### 7. show-more

- **Current**: `registryDependencies: ["button"]`
- **Reason**: Imports `buttonStyles` from `./button`
- **Status**: ✅ FIXED

#### 8. range-calendar

- **Current**: `registryDependencies: ["calendar"]` ✅ CORRECT
- **Status**: ✅ ALREADY CORRECT

#### 9. context-menu

- **Current**: `registryDependencies: ["menu"]` ✅ CORRECT
- **Status**: ✅ ALREADY CORRECT

#### 10. choicebox

- **Current**: No `registryDependencies` field
- **Missing**: `registryDependencies: ["checkbox"]`
- **Reason**: Imports `Checkbox` from `./checkbox`
- **Status**: ❌ NEEDS FIX

#### 11. command-menu

- **Current**: `registryDependencies: ["dropdown", "loader", "menu"]` ✅ CORRECT
- **Status**: ✅ ALREADY CORRECT

#### 12. tree

- **Current**: No `registryDependencies` field
- **Missing**: `registryDependencies: ["checkbox"]`
- **Reason**: Imports `Checkbox` from `./checkbox`
- **Status**: ❌ NEEDS FIX

#### 13. text-field

- **Current**: `registryDependencies: ["field", "loader"]` ✅ CORRECT
- **Status**: ✅ ALREADY CORRECT

#### 14. table

- **Current**: No `registryDependencies` field
- **Missing**: `registryDependencies: ["checkbox"]`
- **Reason**: Imports `Checkbox` from `./checkbox`
- **Status**: ❌ NEEDS FIX

#### 15. file-trigger

- **Current**: `registryDependencies: ["button"]` ✅ CORRECT
- **Status**: ✅ ALREADY CORRECT

#### 16. dropdown

- **Current**: `registryDependencies: ["keyboard", "separator"]` ✅ CORRECT
- **Status**: ✅ ALREADY CORRECT

#### 17. color-field

- **Current**: `registryDependencies: ["color-picker", "field", "loader"]` ✅ CORRECT
- **Status**: ✅ ALREADY CORRECT

## Summary

### Components Needing Fixes: 6

1. **color-wheel** - needs `["color-thumb"]`
2. **color-slider** - needs `["color-thumb", "field"]`
3. **color-swatch-picker** - needs `["color-swatch"]`
4. **show-more** - needs `["button"]`
5. **choicebox** - needs `["checkbox"]`
6. **tree** - needs `["checkbox"]`
7. **table** - needs `["checkbox"]`

### Components Already Correct: 67

Most components already have correct `registryDependencies` declarations.

## Next Steps

1. Fix the 7 components with missing `registryDependencies`
2. Verify all dependencies are properly declared
3. Update the implementation plan
