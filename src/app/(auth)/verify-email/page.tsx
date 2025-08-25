"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/auth/Input";
import Button from "@/components/Button";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationState, setVerificationState] = useState<"input" | "success" | "error">("input");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token") || "";
    if (token) {
      setToken(token);
      // Auto-verify if token is provided in URL
      handleVerification(token);
    }
  }, []);

  const handleVerification = async (verificationToken: string) => {
    if (!verificationToken.trim()) {
      setErrorMessage("Please enter a verification token");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    // TODO: Implement API call to /api/auth/verify-email
    // Placeholder for verification logic
    console.log("Email verification attempt with token:", verificationToken);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Mock success for demo
      if (verificationToken.length > 10) {
        setVerificationState("success");
      } else {
        setVerificationState("error");
        setErrorMessage("Invalid or expired verification token");
      }
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerification(token);
  };

  if (verificationState === "success") {
    return (
      <AuthLayout
        title="Email verified successfully!"
        subtitle="Your email has been verified. You can now sign in to your account."
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
            <h3 className="text-lg font-medium text-[var(--text1)]">Verification complete!</h3>
            <p className="mt-2 text-sm text-[var(--text2)]">
              Your email address has been successfully verified. You can now access all features of your account.
            </p>
          </div>

          <div className="pt-4">
            <Link href="/login">
              <Button variant="secondary" size="lg" fullWidth>
                Sign in to your account
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (verificationState === "error") {
    return (
      <AuthLayout
        title="Verification failed"
        subtitle="There was a problem verifying your email address."
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
            <h3 className="text-lg font-medium text-[var(--text1)]">Verification failed</h3>
            <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
            <p className="mt-2 text-sm text-[var(--text2)]">
              The verification link may be expired or invalid. You can request a new verification email.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => {
                setVerificationState("input");
                setToken("");
                setErrorMessage("");
              }}
            >
              Try again
            </Button>
            
            <Link href="/register">
              <Button variant="secondary" size="lg" fullWidth>
                Request new verification email
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the verification token from your email or click the link in your email."
      footer={
        <p>
          Didn&apos;t receive an email?{" "}
          <Link href="/register" className="font-medium text-[var(--accent)] hover:text-[var(--highlight)]">
            Resend verification email
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Verification token"
          type="text"
          placeholder="Enter your verification token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          error={errorMessage}
          required
        />

        <div className="text-sm text-[var(--text2)]">
          <p>Check your email for a verification link. If you can&apos;t find it:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Check your spam or junk folder</li>
            <li>Make sure the email address is correct</li>
            <li>Wait a few minutes for the email to arrive</li>
          </ul>
        </div>

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading || !token.trim()}
        >
          Verify email
        </Button>
      </form>
    </AuthLayout>
  );
}
