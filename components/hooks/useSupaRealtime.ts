"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const useSupaRealtime = ({
  channel = "*",
  schema = "public",
  table,
  setState,
}: {
  channel?: string;
  setState: (obj: any, type: string) => void;
  schema?: string;
  table: string;
}) => {
  const supabase = createClient();

  useEffect(() => {
    const chann = supabase
      .channel(channel)
      .on(
        "postgres_changes",
        {
          event: "*",
          table: table,
          schema: schema,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setState({ id: payload.old.id }, payload.eventType);
          } else {
            setState(payload.new, payload.eventType);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chann);
    };
  }, []);
};

export default useSupaRealtime;
