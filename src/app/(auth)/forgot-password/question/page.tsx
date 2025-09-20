"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/auth/Input";
import { verifyAnswerFormSchema, type VerifyAnswerFormInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useEffect, useState } from "react";

export default function ForgotPasswordQuestionPage() {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userName = sessionStorage.getItem("userName");
    const question = sessionStorage.getItem("question");
    if (!userName || !question) {
      router.push("/forgot-password");
    } else {
      setQuestion(question);
      setUserName(userName);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<VerifyAnswerFormInput>({
    resolver: zodResolver(verifyAnswerFormSchema),
    mode: "onBlur",
  });

  const onVerifying = async (data: VerifyAnswerFormInput) => {
    try {
      const response = await fetch("/api/auth/verify-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, answer: data.answer }),
      });

      if (response.ok) {
        setIsLoading(true);
        router.push("/forgot-password/question/reset-password");
      } else {
        throw new Error("Failed to verify answer");
      }
    } catch (error) {
      setError("root", {
        message: "Failed to verify answer",
      });
    }
  };

  return (
    <AuthLayout title="Forgot your password?">
      <h2 className="text-lg font-bold text-[var(--text1)] mb-4 text-center">{question} ?</h2>
      <p className="text-sm text-[var(--text2)] mb-4 text-center">
        Please enter the answer to the question above.
      </p>

      {errors.root && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-sm text-red-500 font-medium">{errors.root.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onVerifying)} className="space-y-6">
        <Input
          label="Answer"
          type="text"
          placeholder="Enter your answer"
          {...register("answer")}
          error={errors.answer?.message}
          required
        />

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
        >
          Verify
        </Button>
      </form>
    </AuthLayout>
  );
}
