import { createClient } from "@/utils/supabase/server";
import ContractsView from "@/components/views/Contracts";
const Contracts = async () => {
  return <ContractsView />;
};

export default Contracts;
