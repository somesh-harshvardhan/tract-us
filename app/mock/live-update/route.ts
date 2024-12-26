import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: contracts } = await supabase.from("contracts").select();

  if (!contracts || !contracts.length)
    return NextResponse.json({ message: "No contracts to randomize" });

  const contract =
    contracts && contracts[Math.floor(Math.random() * contracts?.length)];

  const statusRand = Math.floor(Math.random() * 3) + 1;
  contract.status = statusRand;

  await supabase.from("contracts").update(contract).eq("id", contract.id);

  return NextResponse.json({
    message: "Some random status changed",
  });
}
