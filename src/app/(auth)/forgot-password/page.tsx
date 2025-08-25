"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/auth/Input";
import Button from "@/components/Button";
import { requestPasswordResetFormSchema, type RequestPasswordResetFormInput } from "@/lib/validations";

export default function ForgotPasswordPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<RequestPasswordResetFormInput>({
    resolver: zodResolver(requestPasswordResetFormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RequestPasswordResetFormInput) => {
    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        setSubmittedEmail(data.email);
        setShowSuccess(true);
        reset();
      } else {
        const errorData = await response.json();
        setError("email", {
          message: errorData.error || "Failed to send reset email"
        });
      }
    } catch {
      setError("root", {
        message: "Network error. Please check your connection and try again."
      });
    }
  };

  if (showSuccess) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent password reset instructions to your email address."
        footer={
          <p>
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-[var(--accent)] hover:text-[var(--highlight)]">
              Sign in
            </Link>
          </p>
        }
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-[var(--accent)]/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-[var(--text1)]">Reset link sent!</h3>
            <p className="mt-2 text-sm text-[var(--text2)]">
              If an account with email <span className="font-medium text-[var(--text1)]">{submittedEmail}</span> exists, 
              you will receive password reset instructions.
            </p>
          </div>

          <div className="text-sm text-[var(--text2)] space-y-2">
            <p>Didn&apos;t receive the email? Check:</p>
            <ul className="space-y-1 list-disc list-inside text-left">
              <li>Your spam or junk folder</li>
              <li>The email address is spelled correctly</li>
              <li>Wait a few minutes for the email to arrive</li>
            </ul>
          </div>

          <div className="space-y-3 pt-4">
            <Link href="/login">
              <Button variant="secondary" size="lg" fullWidth className="mb-4">
                Back to Sign In
              </Button>
            </Link>
            
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => {
                setShowSuccess(false);
                setSubmittedEmail("");
              }}
            >
              Try different email
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

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
          label="Email address"
          type="email"
          placeholder="Enter your email address"
          {...register("email")}
          error={errors.email?.message}
          required
        />

        <div className="text-sm text-[var(--text2)]">
          <p>
            We&apos;ll send password reset instructions to this email address if it&apos;s associated with an account.
          </p>
        </div>

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
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
