"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { signUp } from "./actions";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const { register, getValues } = useForm({
    defaultValues: {
      email: "" as string,
      password: "" as string,
      "confirm-password": "" as string,
    },
  });
  const [error, setError] = useState<boolean>(false);

  const handleEmailLogin = useCallback(async () => {
    const res = await signUp({
      email: getValues().email,
      password: getValues().password,
    });

    const parsedRes = JSON.parse(res);
    if (parsedRes.__isAuthError) {
      setError(true);
    } else {
      toast.success("Sign up Success!");
      router.push("/");
    }
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
              placeholder=" Enter your password"
              type="password"
              {...register("password", { required: true })}
            />
          </div>
          <div className=" mt-3">
            <Label>Confirm Password</Label>
            <Input
              placeholder="Re-Enter your password"
              type="password"
              {...register("confirm-password", { required: true })}
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
            <Button onClick={() => handleEmailLogin()} className=" w-full">
              <Mail /> Create Account
            </Button>
            <div className=" text-sm text-center mt-1">
              Have an account?
              <span className=" underline text-blue-600">
                <Link href={"/login"}>Log in</Link>
              </span>
            </div>
          </div>
          <div className=" block text-center text-sm my-2">Or</div>
          <Button className=" w-full">Login with google</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
