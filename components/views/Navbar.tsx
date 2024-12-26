"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, Menu } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserResponse } from "@supabase/supabase-js";
import { extractNameFromEmail } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface NavI {
  user: UserResponse | string;
}

export default function Navbar({ user }: NavI) {
  const router = useRouter();
  const signOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    router.push("/");
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-1">
      <div className=" w-full flex justify-between h-14 items-center">
        <div className=" flex justify-between">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className=" font-bold uppercase inline-block">Tract Us</span>
          </Link>
        </div>
        {user !== "" && (
          <div className="flex items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-10 w-10 text-lg">
                      <AvatarImage src="/avatars/01.png" alt="@username" />
                      <AvatarFallback>
                        {extractNameFromEmail(
                          typeof user === "object"
                            ? user?.data?.user?.email!
                            : ""
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs leading-none text-muted-foreground">
                        {typeof user === "object"
                          ? user?.data?.user?.email!
                          : ""}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
