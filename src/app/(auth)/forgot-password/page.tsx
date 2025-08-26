"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/auth/Input";
import Button from "@/components/Button";
import { verifyUsernameSchema, type VerifyUsernameInput } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<VerifyUsernameInput>({
    resolver: zodResolver(verifyUsernameSchema),
    mode: "onBlur",
  });

  const onVerifying = async (data: VerifyUsernameInput) => {
    try {
      const response = await fetch("/api/auth/verify-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: data.userName }),
      });
      const { question } = await response.json();
      
      if (response.ok) {
        setIsLoading(true);
        sessionStorage.setItem("userName", data.userName);
        sessionStorage.setItem("question", question);
        router.push("/forgot-password/question");
      } else {
        throw new Error("Failed to verify username");
      }
    } catch (error) {
      setError("root", {
        message: "Failed to verify username"
      });
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="No worries! Enter your email and we'll send you reset instructions."
      footer={
        <p>
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-[var(--accent)] hover:text-[var(--highlight)]">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onVerifying)} className="space-y-6">
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
          label="Username"
          type="text"
          placeholder="Enter your username"
          {...register("userName")}
          error={errors.userName?.message}
          required
        />

        <div className="text-sm text-[var(--text2)]">
          <p>
            We&apos;ll send password reset instructions to this username if it&apos;s associated with an account.
          </p>
        </div>

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
        >
          Send reset instructions
        </Button>

        <div className="text-center">
          <Link href="/register" className="text-sm text-[var(--accent)] hover:text-[var(--highlight)]">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
