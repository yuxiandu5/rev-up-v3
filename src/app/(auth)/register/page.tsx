"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/auth/Input";
import Button from "@/components/Button";
import { registerFormSchema, type RegisterFormInput } from "@/lib/validations";
import GreenTick from "@/components/GreenTick";

export default function RegisterPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
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
        body: JSON.stringify({ 
          userName: data.userName, 
          password: data.password, 
          confirmPassword: data.confirmPassword, 
          recoverQuestion: data.recoverQuestion, 
          answer: data.answer }),
        });
        
        if (response.ok) {
          setIsLoading(true);
          setShowSuccess(true);
      } else {
        const errorData = await response.json();
        
        if (response.status === 409) {
          setError("userName", {
            message: errorData.error || "Username already exists"
          });
        } 
        throw new Error("Failed to create account");
      }
    } catch (error) {
      setError("root", {
        message: "Failed to create account"
      });
    }
  };

  if (showSuccess) {
    return (
      <AuthLayout
        title="Account created successfully!"
      >
        <div className="text-center space-y-4">
          <GreenTick />
          <h3 className="text-lg font-medium text-[var(--text1)]">Account created successfully!</h3>
          <p className="mt-2 text-sm text-[var(--text2)]">
            Your account has been successfully created. You can now sign in with your new account.
          </p>

          <div className="pt-4">
            <Link href="/login">
              <Button variant="secondary" size="lg" fullWidth>
                Sign in
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <Input
          label="Recover question"
          type="text"
          placeholder="Enter your recover question"
          {...register("recoverQuestion")}
          error={errors.recoverQuestion?.message}
          required
        />

        <Input
          label="Answer"
          type="text"
          placeholder="Enter your answer"
          {...register("answer")}
          error={errors.answer?.message}
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
          loading={isLoading}
          disabled={isLoading}
        >
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
