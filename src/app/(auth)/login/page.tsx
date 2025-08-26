"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/auth/Input";
import Button from "@/components/Button";
import { loginFormSchema, type LoginFormInput } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormInput) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: data.userName, password: data.password }),
      });
      
      if (response.ok) {
        setIsLoading(true);
        const result = await response.json();
        
        login(result.accessToken, result.user);
        router.push("/");
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      setError("root", {
        message: "Invalid email or password"
      });
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-[var(--accent)] hover:text-[var(--highlight)]">
            Sign up
          </Link>
        </p>
      }
    >

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.root && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-500 font-medium">
                {errors.root.message}
              </p>
            </div>
          </div>
        )}

        <Input
          label="User name"
          type="text"
          placeholder="Enter your user name"
          {...register("userName")}
          error={errors.userName?.message}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          error={errors.password?.message}
          required
        />

        <div className="text-sm text-[var(--text2)] text-right">
          <Link href="/forgot-password" className="font-medium text-[var(--accent)] hover:text-[var(--highlight)]">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
        >
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
