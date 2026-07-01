"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { UserRole, UserStatus } from "@/lib/types/auth.types";
import { UserStatusBadge } from "./user-status-badge";
import { UserRoleBadge } from "./user-role-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusDialog } from "./status-dialog";
import { MoreHorizontal, Edit, Eye, Lock, Shield, Unlock } from "lucide-react";
import { AssignRoleDialog } from "./assign-role-dialog";

export interface UserRow {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  last_login_at: string | null;
}

interface UserTableProps {
  users: UserRow[];
}

export function UserTable({ users }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  const openStatusDialog = (user: UserRow) => {
    setSelectedUser(user);
    setStatusDialogOpen(true);
  };

  const openRoleDialog = (user: UserRow) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer group hover:bg-slate-50"
                >
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {user.first_name?.[0]}
                        {user.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/users/${user.id}`}
                      className="hover:underline"
                    >
                      {user.first_name} {user.last_name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <UserRoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge status={user.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {user.last_login_at
                      ? format(new Date(user.last_login_at), "MMM d, yyyy")
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(user.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/users/${user.id}`}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/users/${user.id}/edit`}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit User
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openRoleDialog(user)}
                          className="cursor-pointer"
                        >
                          <Shield className="mr-2 h-4 w-4" /> Assign Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openStatusDialog(user)}
                          className="cursor-pointer"
                        >
                          {user.status === UserStatus.ACTIVE ? (
                            <>
                              <Lock className="mr-2 h-4 w-4 text-rose-500" />{" "}
                              <span className="text-rose-500">
                                Lock Account
                              </span>
                            </>
                          ) : (
                            <>
                              <Unlock className="mr-2 h-4 w-4 text-emerald-500" />{" "}
                              <span className="text-emerald-500">
                                Activate Account
                              </span>
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <>
          <StatusDialog
            userId={selectedUser.id}
            userName={`${selectedUser.first_name} ${selectedUser.last_name}`}
            currentStatus={selectedUser.status}
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
          />
          <AssignRoleDialog
            userId={selectedUser.id}
            userName={`${selectedUser.first_name} ${selectedUser.last_name}`}
            currentRole={selectedUser.role}
            open={roleDialogOpen}
            onOpenChange={setRoleDialogOpen}
          />
        </>
      )}
    </>
  );
}
