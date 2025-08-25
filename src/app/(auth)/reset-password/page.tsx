"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/auth/Input";
import Button from "@/components/Button";
import { resetPasswordFormSchema, type ResetPasswordFormInput } from "@/lib/validations";

export default function ResetPasswordPage() {
  const [resetState, setResetState] = useState<"form" | "success" | "error">("form");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    reset,
    setError,
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token") || "";
    if (token) {
      setValue("token", token);
    }
  }, [setValue]);

  const onSubmit = async (data: ResetPasswordFormInput) => {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: getValues("token"), 
          newPassword: data.newPassword 
        }),
      });

      if (response.ok) {
        setResetState("success");
        reset();
      } else {
        const errorData = await response.json();
        
        if (response.status === 400 || response.status === 401) {
          // Invalid or expired token
          setResetState("error");
          setErrorMessage(errorData.error || "Invalid or expired reset token");
        } else {
          // Other errors - show in form
          setError("root", {
            message: errorData.error || "Failed to reset password"
          });
        }
      }
    } catch {
      setError("root", {
        message: "Network error. Please check your connection and try again."
      });
    }
  };

  if (resetState === "success") {
    return (
      <AuthLayout
        title="Password reset successful!"
        subtitle="Your password has been successfully reset."
        footer={
          <p>
            Continue to{" "}
            <Link href="/login" className="font-medium text-[var(--accent)] hover:text-[var(--highlight)]">
              Sign in
            </Link>
          </p>
        }
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-[var(--green)]/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-[var(--text1)]">Password updated!</h3>
            <p className="mt-2 text-sm text-[var(--text2)]">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
          </div>

          <div className="pt-4">
            <Link href="/login">
              <Button variant="secondary" size="lg" fullWidth>
                Sign in with new password
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (resetState === "error") {
    return (
      <AuthLayout
        title="Reset failed"
        subtitle="There was a problem resetting your password."
        footer={
          <p>
            Need help?{" "}
            <Link href="/contact" className="font-medium text-[var(--accent)] hover:text-[var(--highlight)]">
              Contact support
            </Link>
          </p>
        }
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-[var(--text1)]">Reset failed</h3>
            <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
            <p className="mt-2 text-sm text-[var(--text2)]">
              The reset link may be expired or invalid. You can request a new password reset.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Link href="/forgot-password">
              <Button variant="secondary" size="lg" fullWidth>
                Request new reset link
              </Button>
            </Link>
            
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => {
                setResetState("form");
                reset();
                setErrorMessage("");
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your reset token and choose a new password."
      footer={
        <p>
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-[var(--accent)] hover:text-[var(--highlight)]">
            Sign in
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
          label="New password"
          type="password"
          placeholder="Enter your new password"
          {...register("newPassword")}
          error={errors.newPassword?.message}
          required
        />

        <Input
          label="Confirm new password"
          type="password"
          placeholder="Confirm your new password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          required
        />

        <div className="text-sm text-[var(--text2)]">
          <p className="font-medium mb-2">Password requirements:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>At least 8 characters long</li>
            <li>Include a mix of letters, numbers, and symbols</li>
            <li>Avoid common passwords</li>
          </ul>
        </div>

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Reset password
        </Button>

        <div className="text-center">
          <Link href="/forgot-password" className="text-sm text-[var(--accent)] hover:text-[var(--highlight)]">
            Didn&apos;t receive a reset token?
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
