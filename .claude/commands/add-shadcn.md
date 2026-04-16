# Add shadcn Component

Add a new shadcn/ui component to the admin section.

Usage: /add-shadcn [component-name]

Example: /add-shadcn calendar

1. Run `npx shadcn@latest add [component-name]`
2. Move the component to `src/components/admin/ui/` if needed
3. Update import paths to use `@/components/admin/ui/`
4. Update `@/lib/utils` imports to `@/lib/admin-utils`

The component will be available for use in admin pages.
