"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FileText, User, Plus, Search } from "lucide-react";
import { SalespersonStatusBadge } from "./salesperson-status-badge";
import { format } from "date-fns";

interface SalespersonProfile {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  designation: string;
  mobile_number: string;
  status: "active" | "inactive";
  created_at: string;
}

interface SalespersonTableProps {
  salespersons: SalespersonProfile[];
}

export function SalespersonTable({ salespersons }: SalespersonTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSalespersons = salespersons.filter(
    (sp) =>
      sp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.employee_code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button asChild>
          <Link href="/salespersons/new">
            <Plus className="mr-2 h-4 w-4" /> Add Salesperson
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSalespersons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No salespersons found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSalespersons.map((sp) => (
                <TableRow key={sp.id}>
                  <TableCell className="font-medium">
                    {sp.employee_code}
                  </TableCell>
                  <TableCell>
                    {sp.first_name} {sp.last_name}
                  </TableCell>
                  <TableCell>{sp.designation}</TableCell>
                  <TableCell>{sp.mobile_number}</TableCell>
                  <TableCell>
                    <SalespersonStatusBadge status={sp.status} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(sp.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/salespersons/${sp.id}`)}
                        >
                          <User className="mr-2 h-4 w-4" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/salespersons/${sp.id}`)}
                        >
                          <FileText className="mr-2 h-4 w-4" /> Statement
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
    </div>
  );
}
