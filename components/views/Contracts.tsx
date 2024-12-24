"use client";

import React from "react";
import { useUser } from "../context/UserContext";

const Contracts = () => {
  const { user } = useUser();
  console.log(user);
  return <div>Contracts</div>;
};

export default Contracts;
