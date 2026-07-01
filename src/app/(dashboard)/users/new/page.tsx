import { Metadata } from "next";
import { requirePermission } from "@/lib/permissions/guard";
import { CreateUserForm } from "@/components/users/create-user-form";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "New User - User Management",
};

export default async function NewUserPage() {
  await requirePermission("User.Create");

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/users" className="hover:text-foreground">
          Users
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">New User</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create User</h1>
        <p className="text-muted-foreground">
          Create a new application user and assign an initial role.
        </p>
      </div>

      <CreateUserForm />
    </div>
  );
}
