# Role Management System Walkthrough

## 1. Overview
The **Role Management System** introduces dynamic Role-Based Access Control (RBAC) to the "Artisan Concierge" staff hub. Moving away from a static, hardcoded team list, the application now leverages a robust database table to manage staff details, roles, and administrative privileges.

## 2. Infrastructure Changes

### Supabase Table: `salon_team`
A new table, `salon_team`, has been provisioned to store all staff-related data securely. This centralizes employee management and allows for real-time updates without requiring application redeploys.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL | Unique identifier for the team member. |
| `name` | TEXT | Full name of the staff member. |
| `role` | TEXT | Displayed role (e.g., "Creative Director"). |
| `seniority` | TEXT | RBAC access level (`Executive`, `Senior`, `Master`, `Artisan`). |
| `specialty` | TEXT | Highlighted skill or specialty. |
| `bio` | TEXT | Short biography for their profile. |
| `pin` | TEXT | 4-digit numeric code used for terminal login (Currently defaulted to `1111` for all staff). |

## 3. Dynamic Application Integration
The `/staff` page (`app/staff/page.tsx`) was refactored to fetch the staff roster directly from Supabase upon component mount. This enables the terminal login screen to automatically update whenever a new team member is added or removed from the database.

## 4. Role-Based Capabilities
Access to dashboard features is strictly governed by the staff member's `seniority` level.

### `Executive` Access (e.g., Callena, Rebecca)
Executives hold maximum administrative privileges and have access to all features:
- **Executive Overview**: High-level statistical breakdown of the salon.
- **Inquiries & Backstage**: Global access to all incoming leads and inter-staff messaging.
- **Appointments & Gallery**: Full calendar and portfolio visibility.
- **VIPs**: Access to the high-tier client loyalty metrics.
- **Team Management**: A dedicated tab to view, audit, and modify staff roles and capabilities.

### Standard Access (e.g., Senior, Master, Artisan)
Standard staff members receive a focused, distraction-free environment:
- **Inquiries**: Filtered to only display leads assigned to them.
- **Appointments**: Filtered to show their personal daily schedule.
- **Backstage**: Access to internal communication.
- *(Hidden)*: Overview, VIPs, and Team Management tabs are completely hidden from the UI.

## 5. The "Team & Roles" Hub
Within the Executive dashboard, a new **Role Management** tab provides a real-time directory of all active staff.
- Displays headshots, names, and hierarchical roles.
- Provides placeholder actions for `Edit Role` and `Reset PIN` which can be wired to Supabase mutations in the future.
