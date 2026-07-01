import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requirePermission } from "@/lib/permissions/guard";
import { createServerClient } from "@/lib/supabase/server";
import { EditUserForm } from "@/components/users/edit-user-form";

export const metadata: Metadata = {
  title: "Edit User - User Management",
};

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // In a real app, you might also have User.Edit
  // For this exercise we use User.View or higher permission defined in the system
  await requirePermission("SystemAdministrator");

  const { id } = await params;
  const supabase = await createServerClient();

  const { data: user, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !user) {
    notFound();
  }

  const initialData = {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone || "",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/users" className="hover:text-foreground">
          Users
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/users/${user.id}`} className="hover:text-foreground">
          {user.first_name} {user.last_name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Edit Profile</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
        <p className="text-muted-foreground">
          Update personal information for {user.first_name} {user.last_name}.
        </p>
      </div>

      <EditUserForm initialData={initialData} />
    </div>
  );
}
