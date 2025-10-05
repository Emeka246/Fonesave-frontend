# React.Children.only Error Fix Guide

## The Error
```
Error: React.Children.only expected to receive a single React element child.
```

This error occurs when using Radix UI components (like Button with `asChild`) that expect a single child element but receive multiple children.

## Common Causes & Fixes

### 1. Button with asChild and Multiple Children
❌ **Problem:**
```tsx
<Button asChild>
  <Link to="/path">
    <Icon />
    Text
    <span>Additional content</span>
  </Link>
</Button>
```

✅ **Solution:**
```tsx
<Button asChild>
  <Link to="/path">
    <span className="flex items-center gap-2">
      <Icon />
      Text
      <span>Additional content</span>
    </span>
  </Link>
</Button>
```

### 2. DropdownMenuTrigger with Multiple Children
❌ **Problem:**
```tsx
<DropdownMenuTrigger asChild>
  <Button>
    <Icon1 />
    <Icon2 />
    Text
  </Button>
</DropdownMenuTrigger>
```

✅ **Solution:** Already handled correctly in most cases, but ensure Button handles multiple children properly.

### 3. DialogTrigger with Multiple Children
❌ **Problem:**
```tsx
<DialogTrigger asChild>
  <div>
    <Button>Click me</Button>
    <span>Extra text</span>
  </div>
</DialogTrigger>
```

✅ **Solution:**
```tsx
<DialogTrigger asChild>
  <Button>
    <span className="flex items-center gap-2">
      Click me
      <span>Extra text</span>
    </span>
  </Button>
</DialogTrigger>
```

## Prevention Tips

1. **Wrap multiple children in a single container:**
   ```tsx
   <ComponentWithAsChild asChild>
     <SingleElement>
       <span>Multiple children go here</span>
     </SingleElement>
   </ComponentWithAsChild>
   ```

2. **Use React.Fragment sparingly with asChild:**
   ```tsx
   // Avoid this with asChild
   <ComponentWithAsChild asChild>
     <>
       <Element1 />
       <Element2 />
     </>
   </ComponentWithAsChild>
   ```

3. **Check component composition:**
   - Always ensure the immediate child of an `asChild` component is a single React element
   - Use wrapper elements when you need multiple children

## Debugging Steps

1. **Identify the component:** Look for components using `asChild` prop
2. **Check children count:** Ensure only one immediate child
3. **Wrap if necessary:** Use a wrapper element for multiple children
4. **Test the fix:** Verify the component renders without errors

## Fixed Implementation

The error in your dashboard was caused by:
```tsx
<Button asChild variant="outline" size="sm">
  <Link to="/error-boundary-test">
    <Bug className="mr-2 h-4 w-4" />
    Test ErrorBoundary
  </Link>
</Button>
```

The Link component had multiple children (Icon + Text), which caused the Slot (from asChild) to fail.

**Solution:** Use the SimpleErrorTest component instead, which avoids the asChild pattern entirely for testing purposes.
