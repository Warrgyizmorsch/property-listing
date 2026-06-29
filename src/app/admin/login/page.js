"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation";
import { loginUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Retrieve callback URL to redirect users back to their intended protected page
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  // Initialize form validation using react-hook-form + Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    setError("");

    startTransition(async () => {
      const response = await loginUser(data);

      if (!response.success) {
        setError(response.error || "Failed to log in.");
        return;
      }

      // Refresh router and push to dashboard to trigger middleware update
      router.refresh();
      router.push(callbackUrl);
    });
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-neutral-200">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-[var(--brand-primary)] p-3 text-white">
            <Lock className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-neutral-900">
          Admin Portal
        </CardTitle>
        <CardDescription className="text-neutral-500">
          Enter your credentials to access the management dashboard
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Error Message Alert */}
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                id="email"
                type="email"
                placeholder="admin@yourdomain.com"
                className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                disabled={isPending}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`pl-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                disabled={isPending}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 mt-2">
          <Button
            type="submit"
            className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 text-white font-medium h-11 transition-all cursor-pointer"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying session...
              </span>
            ) : (
              "Log In"
            )}
          </Button>
          <p className="text-xs text-center text-neutral-400">
            Authorized personnel only. Access attempt logs are monitored.
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <Card className="w-full max-w-md shadow-lg border-neutral-200">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-2">
                <div className="rounded-full bg-[var(--brand-primary)] p-3 text-white">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-neutral-900">
                Loading...
              </CardTitle>
              <CardDescription className="text-neutral-500">
                Initializing secure session validation
              </CardDescription>
            </CardHeader>
            <CardContent className="h-48 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </CardContent>
          </Card>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
