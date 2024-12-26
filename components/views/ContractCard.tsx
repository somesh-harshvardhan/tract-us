import { FC, useTransition } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  UserIcon,
  ClockIcon,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { ContractT, TYPES } from "./Contracts";
import { Button } from "../ui/button";

export const getStatusBadge = (status: number) => {
  switch (status) {
    case 1:
      return <Badge variant="active">Active</Badge>;
    case 2:
      return <Badge variant="pending">Pending</Badge>;
    case 3:
      return <Badge variant="destructive">Inactive</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};
interface ContractCardI extends ContractT {
  handleEditButton: (contract: ContractT, type: TYPES) => void;
  handleDeleteButton: (id: string) => Promise<void>;
  contract: ContractT;
}
export const ContractCard: FC<ContractCardI> = ({
  created_at,
  client_name,
  status,
  user_id,
  start_date,
  end_date,
  contract,
  handleEditButton,
  handleDeleteButton,
}) => {
  let [delPending, setDelTransition] = useTransition();
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-bold">{client_name}</CardTitle>
        {getStatusBadge(status)}
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <UserIcon className="mr-2 h-4 w-4" />
            User ID: <span className=" text-black ml-1">{user_id}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <ClockIcon className="mr-2 h-4 w-4" />
            Created:{" "}
            <span className=" text-black ml-1">
              {format(new Date(created_at), "PPP")}
            </span>
          </div>
          {start_date && (
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Start:{" "}
              <span className=" text-black ml-1">
                {format(new Date(start_date), "PPP")}
              </span>
            </div>
          )}
          {end_date && (
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              End:{" "}
              <span className=" text-black ml-1">
                {format(new Date(end_date), "PPP")}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className=" justify-end">
        <div className=" flex gap-6 items-center justify-between">
          <Button
            disabled={delPending}
            className=" py-2 px-3"
            onClick={() =>
              setDelTransition(async () => {
                await handleDeleteButton(contract.id);
              })
            }
          >
            {delPending && <Loader2 className=" animate-spin" />}
            <Trash2 className=" h-4 w-4 hover:scale-105 transition-transform cursor-pointer" />
          </Button>

          <Edit
            className=" h-6 w-6 hover:scale-105 transition-transform cursor-pointer"
            onClick={() => handleEditButton(contract, TYPES.EDIT)}
          />
        </div>
      </CardFooter>
    </Card>
  );
};
