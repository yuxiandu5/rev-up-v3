"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/auth/Input";
import Button from "@/components/Button";
import { registerFormSchema, type RegisterFormInput } from "@/lib/validations";

export default function RegisterPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (response.ok) {
        setShowSuccess(true);
        reset();
      } else {
        const errorData = await response.json();
        
        if (response.status === 409) {
          setError("email", {
            message: errorData.error || "Email already exists"
          });
        } else {
          setError("root", {
            message: errorData.error || "Something went wrong. Please try again."
          });
        }
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
        subtitle="We've sent a verification link to your email address."
        footer={
          <p>
            Already have an account?{" "}
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
            <h3 className="text-lg font-medium text-[var(--text1)]">Account created successfully!</h3>
            <p className="mt-2 text-sm text-[var(--text2)]">
              Please check your email and click the verification link to complete your registration.
            </p>
          </div>

          <div className="pt-4">
            <Link href="/login">
              <Button variant="primary" size="lg" fullWidth>
                Go to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      footer={
        <p>
          Already have an account?{" "}
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
          placeholder="Enter your email"
          {...register("email")}
          error={errors.email?.message}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          {...register("password")}
          error={errors.password?.message}
          required
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="Confirm your password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          required
        />

        <div className="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 mt-1 rounded border-[var(--bg-dark3)] bg-[var(--bg-dark3)] text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-0"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-[var(--text2)]">
            I agree to the{" "}
            <Link href="/terms" className="text-[var(--accent)] hover:text-[var(--highlight)]">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[var(--accent)] hover:text-[var(--highlight)]">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
