import { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { requirePermission } from "@/lib/permissions/guard";
import { getUsersAction } from "@/app/actions/user/get-users.action";
import { UserTable } from "@/components/users/user-table";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage application users, roles and access permissions.",
};

export default async function UsersPage() {
  await requirePermission("User.View");

  // TODO: Add search and filter params passing
  const result = await getUsersAction();

  if (!result.success) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-semibold">Unable to load users.</h2>
        <p className="text-muted-foreground">
          {result.error?.message || "Please try again."}
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage application users, roles and access permissions.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Note: Create User button is typically guarded by User.Create, 
              but we can render it and let the server guard the route as well.
              For true RBAC on the UI, we would fetch the user's permissions here. */}
          <Button asChild>
            <Link href="/users/new">
              <UserPlus className="mr-2 h-4 w-4" />
              New User
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Placeholder for Search Input and Filters */}
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search users..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            disabled
          />
        </div>
      </div>

      <UserTable users={result.data?.users || []} />
    </div>
  );
}
