"use client";

import { Button } from "@/components/ui/button";
import { LogIn, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface ShowSignInProps {
  message?: string;
  buttonText?: string;
}

export default function ShowSignIn({
  message = "Please sign in to proceed to checkout",
  buttonText = "Sign In to Continue",
}: ShowSignInProps) {
  const router = useRouter();

  return (
    <div className="lg:col-span-1">
      <div className="flex flex-col justify-between bg-[var(--bg-dark3)] rounded-lg p-6 sticky top-4 h-full">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--text1)] mb-6 flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            Order Summary
          </h2>

          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-dark2)] flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-[var(--text2)]" />
            </div>

            <h3 className="text-lg font-medium text-[var(--text1)]">Sign In Required</h3>

            <p className="text-[var(--text2)] text-sm max-w-xs leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-8">
          <Button
            className="w-full py-3 text-base font-semibold bg-[var(--highlight)] hover:bg-[var(--highlight)]/90 text-white"
            onClick={() => router.push("/login")}
          >
            <LogIn className="w-4 h-4 mr-2" />
            {buttonText}
          </Button>

          <p className="text-center text-[var(--text2)] text-xs mt-3">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-[var(--highlight)] hover:underline font-medium"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
