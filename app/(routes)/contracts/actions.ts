"use server";

import { createClient } from "@/utils/supabase/server";

const createContract = async (contract: {
  client_name: string;
  status: number;
  start_date: Date | null;
  end_date: Date | null;
  user_id: string | null;
}) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("contracts").insert([contract]);

  if (error) {
    throw new Error(`Error creating contract: ${error.message}`);
  }

  return data?.[0];
};
const updateContract = async (
  contractId: string,
  updates: {
    client_name: string;
    status: number;
    start_date: Date | null;
    end_date: Date | null;
  }
) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contracts")
    .update(updates)
    .eq("id", contractId);

  if (error) {
    throw new Error(`Error updating contract: ${error.message}`);
  }

  return data?.[0];
};

export const handleContractAction = async (form: FormData) => {
  const client_name = form.get("client_name") as string | null;
  const status = form.get("status") as string | null;
  const start_date = form.get("start_date") as string | null;
  const end_date = form.get("end_date") as string | null;
  const user_id = form.get("user_id") as string | null;

  if (!client_name || !status) {
    throw new Error("Client name and status are required.");
  }

  const contract = {
    client_name,
    status: parseInt(status, 10),
    start_date: start_date ? new Date(start_date) : null,
    end_date: end_date ? new Date(end_date) : null,
    user_id,
  };

  if (form.get("action_type") === "create") {
    const newContract = await createContract(contract);
    return {
      message: "Contract created successfully",
      newContract,
      success: true,
    };
  } else if (form.get("action_type") === "edit") {
    const contractId = form.get("contract_id") as string | null;

    if (!contractId) {
      throw new Error("Contract ID is required for updates.");
    }

    const updatedContract = await updateContract(contractId, contract);
    return {
      message: "Contract updated successfully",
      updatedContract,
      success: true,
    };
  }

  throw new Error("Invalid action type.");
};

export const handleDeleteAction = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contracts")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Error deleting contract: ${error.message}`);
  }
};
