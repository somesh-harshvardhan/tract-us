import { createClient } from "@/utils/supabase/server";
import ContractsView, { ContractT } from "@/components/views/Contracts";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
export const revalidate = 0;
const Contracts = async () => {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();
  const contractsUser: PostgrestSingleResponse<ContractT[]> = await supabase
    .from("contracts")
    .select()
    .eq("user_id", user.data.user?.id);
  const contracts = contractsUser.data;
  return <ContractsView contracts={contracts} />;
};

export default Contracts;
