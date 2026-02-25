# Lessons Learned

## RTK Query & API Design

- **Endpoint Naming Conflicts**: When injecting endpoints into a base API from multiple slices, ensured endpoint names are unique across the entire application to avoid "already exists" errors.
- **Auto-generated Hooks**: Renaming an endpoint in an RTK Query slice requires updating all components that use the generated hook (e.g., `useGetLanguagesQuery` -> `useGetAdminLanguagesQuery`).

## Backend Architecture

- **Maintenance Operations**: Grouped system-level operations (clear logs, seed, reset) into a dedicated `MaintenanceService` and `MaintenanceController` for better organization and security (SUPERADMIN role).
- **Graceful Error Handling**: Used `execPromise` for shell commands (prisma seeding) with proper error logging and safer error message extraction.
