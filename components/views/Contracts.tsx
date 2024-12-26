"use client";

import React, { FormEvent, useState, useTransition } from "react";
import { useUser } from "../context/UserContext";
import { ContractCard, getStatusBadge } from "./ContractCard";
import useSupaRealtime from "../hooks/useSupaRealtime";
import { Button } from "../ui/button";
import { LayoutGrid, List, Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  handleContractAction,
  handleDeleteAction,
} from "@/app/(routes)/contracts/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSearchFilterSort } from "../hooks/useSearchFilterSort";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Separator } from "../ui/separator";
export type ContractT = {
  id: string;
  created_at: string;
  client_name: string;
  status: number;
  user_id: string;
  start_date: string | undefined;
  end_date: string | undefined;
};

export type ContractsT = {
  contracts: ContractT[] | null;
};

export enum TYPES {
  CREATE = "create",
  EDIT = "edit",
}
export enum VIEWS {
  TABLE = "table",
  CARD = "card",
}

const Contracts = ({ contracts: c }: ContractsT) => {
  const { user } = useUser();
  const [contracts, setContracts] = useState(c);
  const [open, setOpen] = useState<boolean>(false);
  const [dialogContent, setDialogContent] = useState<ContractT | null>(null);
  const [type, setType] = useState<TYPES>(TYPES.CREATE);
  const [view, setView] = useState<VIEWS>(VIEWS.CARD);

  let [pending, startTransition] = useTransition();

  const {
    search,
    setSearch,
    filter,
    setFilter,
    sortKey,
    setSortKey,
    filteredData,
  } = useSearchFilterSort({
    data: contracts || [],
    searchBy: (contract, query) =>
      contract.client_name.toLowerCase().includes(query.toLowerCase()),
    filterBy: (contract, filter) =>
      filter === "0" ? true : String(contract.status) === filter,
    sortBy: (a, b, sortKey) => {
      if (sortKey === "name") return a.client_name.localeCompare(b.client_name);
      if (sortKey === "start_date")
        return (
          new Date(a.start_date || "").getTime() -
          new Date(b.start_date || "").getTime()
        );
      if (sortKey === "end_date")
        return (
          new Date(a.end_date || "").getTime() -
          new Date(b.end_date || "").getTime()
        );
      return 0;
    },
  });
  useSupaRealtime({
    table: "contracts",
    setState: (payload, type) => {
      if (type === "INSERT") {
        setContracts((prev) => prev && [...prev, payload]);
      } else if (type === "UPDATE") {
        setContracts(
          (prev) =>
            prev && [...prev].map((c) => (c.id === payload.id ? payload : c))
        );
      } else if (type === "DELETE") {
        setContracts(
          (prev) => prev && [...prev].filter((p) => p.id !== payload.id)
        );
      }
    },
  });

  const handleEditButton = (
    contract: ContractT,
    type: TYPES = TYPES.CREATE
  ) => {
    setOpen(true);
    setDialogContent(contract);
    setType(type);
  };
  const handleCreateButton = () => {
    setOpen(true);
    setDialogContent(null);
    setType(TYPES.CREATE);
  };
  const handleForm = (form: FormData) => {
    startTransition(async () => {
      const actionType = type;

      form.append("action_type", actionType);
      form.append("contract_id", dialogContent?.id!);
      form.append(
        "user_id",
        typeof user === "object" ? user?.data.user?.id! : ""
      );
      setDialogContent(null);
      setType(type);
      try {
        const res = await handleContractAction(form);
        if (res.success) setOpen(false);
      } catch (error) {
        console.error("Error handling form:", error);
      }
    });
  };
  const tableView = () => setView(VIEWS.TABLE);
  const cardView = () => setView(VIEWS.CARD);
  return (
    <div className="p-4">
      <div className=" flex justify-between items-center">
        <h3 className=" text-2xl font-bold ">Contracts</h3>

        <div>
          <Button variant={"outline"} onClick={handleCreateButton}>
            <Plus /> Create Contract
          </Button>
        </div>
      </div>
      <div className=" flex items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 mb-4 basis-1/2 my-7">
          {/* Search Input */}
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Filter by Status */}
          <Select onValueChange={setFilter} value={filter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All</SelectItem>
              <SelectItem value="1">Active</SelectItem>
              <SelectItem value="2">Pending</SelectItem>
              <SelectItem value="3">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {/* Sort by Attribute */}
          <Select onValueChange={setSortKey} value={sortKey}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="start_date">Start Date</SelectItem>
              <SelectItem value="end_date">End Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className=" basis-1/2 flex justify-end items-center gap-x-3">
          <Button
            variant={view === VIEWS.CARD ? "default" : "outline"}
            onClick={cardView}
          >
            <LayoutGrid className=" w-4 h-4" />
          </Button>
          <Separator orientation={"vertical"} className=" h-[25px]" />
          <Button
            variant={view === VIEWS.TABLE ? "default" : "outline"}
            onClick={tableView}
          >
            <List />
          </Button>
        </div>
      </div>
      {view === VIEWS.CARD ? (
        <div className=" flex items-center justify-start flex-wrap gap-6 mt-3">
          {filteredData?.map((contract) => (
            <ContractCard
              key={contract.id}
              created_at={contract.created_at}
              client_name={contract.client_name}
              start_date={contract.start_date}
              end_date={contract.end_date}
              id={contract.id}
              user_id={contract.user_id}
              status={contract.status}
              handleEditButton={handleEditButton}
              contract={contract}
              handleDeleteButton={handleDeleteAction}
            />
          ))}
        </div>
      ) : (
        <div>
          <Table className=" border rounded">
            <TableHeader>
              <TableRow>
                <TableCell className="px-6 py-3">Name</TableCell>
                <TableCell className="px-6 py-3">Status</TableCell>
                <TableCell className="px-6 py-3">Start Date</TableCell>
                <TableCell className="px-6 py-3">End Date</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="px-6 py-3">
                    {contract.client_name}
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    {getStatusBadge(contract.status)}
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    {contract.start_date}
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    {contract.end_date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent>
          <DialogTitle>{type === TYPES.CREATE ? "Create" : "Edit"}</DialogTitle>
          <DialogDescription>
            <form className=" text-black " action={handleForm}>
              <div className=" my-5">
                <Label>Client Name</Label>
                <Input
                  required
                  name="client_name"
                  placeholder="Enter client's name"
                  defaultValue={dialogContent?.client_name}
                />
              </div>
              <div className=" my-5">
                <Label>Status</Label>
                <Select
                  required
                  name="status"
                  defaultValue={String(dialogContent?.status || 1)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="2">Pending</SelectItem>
                      <SelectItem value="3">Inactive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className=" my-5">
                <Label>Start Date</Label>
                <Input
                  required
                  name="start_date"
                  placeholder="Enter client's name"
                  type="date"
                  defaultValue={dialogContent?.start_date}
                />
              </div>
              <div className=" my-5">
                <Label>End Date</Label>
                <Input
                  required
                  name="end_date"
                  placeholder="Enter client's name"
                  type="date"
                  defaultValue={dialogContent?.end_date}
                />
              </div>
              <div className=" flex gap-x-6">
                <Button type="submit" disabled={pending}>
                  {pending && <Loader2 className="animate-spin" />}
                  {type === TYPES.CREATE ? "Create" : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contracts;
