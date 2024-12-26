"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { register, getValues } = useForm({
    defaultValues: {
      email: "" as string,
      password: "" as string,
    },
  });
  const [error, setError] = useState<boolean>(false);

  const handleEmailLogin = useCallback(async () => {
    startTransition(async () => {
      const res = await login({
        email: getValues().email,
        password: getValues().password,
      });

      const parsedRes = JSON.parse(res);
      if (parsedRes.__isAuthError) {
        setError(true);
      } else {
        toast.success("Login Success!");
        router.push("/");
      }
    });
  }, [getValues]);
  return (
    <div className=" min-h-screen flex items-center justify-center">
      <Card className=" w-[500px]">
        <CardHeader>
          <CardTitle>Log in or Sign Up</CardTitle>
          <CardDescription>
            To continue to app you either need to login or signup!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Email</Label>
            <Input
              placeholder=" Enter your email"
              {...register("email", { required: true })}
            />
          </div>
          <div className=" mt-3">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder=" Enter your password"
              {...register("password", { required: true })}
            />
          </div>
        </CardContent>
        <CardFooter className=" block">
          {error && (
            <div className=" block text-sm text-destructive my-1">
              Email or password entered is invalid/not exists
            </div>
          )}
          <div className=" w-full">
            <Button
              onClick={() => handleEmailLogin()}
              className=" w-full"
              disabled={pending}
            >
              {pending && <Loader2 className=" animate-spin" />}
              <Mail /> Login with email
            </Button>
            <div className=" text-sm text-center mt-1">
              Don&apos;t have an account?
              <span className=" underline text-blue-600">
                <Link href={"/signup"}>Sign-Up</Link>{" "}
              </span>
            </div>
          </div>
          {/* <div className=" block text-center text-sm my-2">Or</div>
          <Button className=" w-full">Login with google</Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}
