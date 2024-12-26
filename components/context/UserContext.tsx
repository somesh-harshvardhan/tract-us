"use client";

import { UserResponse } from "@supabase/supabase-js";
import React, { createContext, useContext } from "react";
const UserContext = createContext<{ user: UserResponse | string }>({
  user: "",
});
const UserProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserResponse | string;
}) => {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);
export default UserProvider;
