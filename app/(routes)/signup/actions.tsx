"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const signUp = async function ({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const payload = {
    email,
    password,
  };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    ...payload,
    options: { emailRedirectTo: "/login" },
  });

  if (error) {
    return JSON.stringify(error);
  } else {
    revalidatePath("/", "layout");
    return JSON.stringify({ message: "success" });
  }
};
