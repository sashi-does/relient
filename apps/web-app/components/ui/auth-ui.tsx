"use client";

import * as React from "react";
import { useState, useId } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import axios from "axios";
import { Button } from "@repo/ui/button";
import Input from "@repo/ui/input";
import { cn } from "@repo/ui/utils";
import { Label } from "@repo/ui/label";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, ...props }, ref) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="grid w-full items-center gap-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          <Input
            id={id}
            type={showPassword ? "text" : "password"}
            className={cn("pe-10", className)}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute cursor-pointer inset-y-0 end-0 flex h-full w-10 items-center justify-center text-muted-foreground/80 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

function SignInForm() {
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <form
      onSubmit={handleSignIn}
      autoComplete="on"
      className="flex flex-col gap-8"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to sign in
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <PasswordInput name="password" label="Password" required />
        <Button size="lg" className="rounded-sm px-2 py-2 text-base cursor-pointer" type="submit">
          Sign In
        </Button>
      </div>
    </form>
  );
}

function SignUpForm() {
  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = form.get("user") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      const res = await axios.post("/api/user/create", {
        username,
        email,
        password,
      });

      if (res.data.success) {
        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/dashboard",
        });
      } else {
        alert("Signup failed: " + res.data.message);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      alert("An error occurred during signup.");
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      autoComplete="on"
      className="flex flex-col gap-8"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to sign up
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="user">Username</Label>
          <Input id="user" name="user" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <PasswordInput name="password" label="Password" required />
        
        <Button size="lg" className="rounded-sm px-2 py-2 text-base cursor-pointer" type="submit">
          Sign Up
        </Button>
      </div>
    </form>
  );
}

function AuthFormContainer() {
  const [isSignIn, setIsSignIn] = useState(true);
  return (
    <div className="mx-auto grid w-[350px] gap-2">
      <Image
        className="mx-auto my-4"
        src={"/relient.png"}
        width={30}
        height={30}
        alt="logo"
      />
      {isSignIn ? <SignInForm /> : <SignUpForm />}
      <div className="text-center text-sm">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}
        <Button
          variant="link"
          className="pl-1 cursor-pointer"
          onClick={() => setIsSignIn(!isSignIn)}
        >
          {isSignIn ? "Sign up" : "Sign in"}
        </Button>
      </div>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
      <Button
        className="cursor-pointer"
        variant="outline"
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="mr-2 h-4 w-4"
        />
        Continue with Google
      </Button>
    </div>
  );
}

interface AuthUIProps {
  image?: { src: string; alt: string };
  quote?: { text: string; author: string };
}
const defaultImage = {
  src: "/form.jpg",
  alt: "Interior design",
};
const defaultQuote = {
  text: "We finally have a simple way to update clients without email clutter.",
  author: "Relient",
};

export function AuthUI({
  image = defaultImage,
  quote = defaultQuote,
}: AuthUIProps) {
  return (
    <div className="w-full bg-[#010201] min-h-screen md:grid md:grid-cols-2">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>

      <div className="flex h-screen items-center justify-center p-6 md:h-auto md:p-0 md:py-12">
        <AuthFormContainer />
      </div>

      <div
        className="hidden md:block relative bg-cover bg-center"
        style={{ backgroundImage: `url(${image.src})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex h-full items-end justify-center p-10">
          <blockquote className="space-y-2 text-center text-white">
            <p className="text-lg font-medium">“{quote.text}”</p>
            <cite className="block text-sm font-light text-neutral-300 not-italic">
              — {quote.author}
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
