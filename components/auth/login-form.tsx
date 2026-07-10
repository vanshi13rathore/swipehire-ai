"use client";

import * as React from "react";
import { Button } from "@/components/shared";
import { Input, Card, CardContent, CardFooter } from "@/components/ui";
import Link from "next/link";
import { Mail, Lock, Globe, Code } from "lucide-react";

export function LoginForm() {
  return (
    <Card variant="elevated" className="w-full border-border/50 bg-card/60 backdrop-blur-md shadow-2xl p-2 sm:p-4 rounded-[2rem]">
      <CardContent className="space-y-5 pt-4">
        <div className="space-y-4">
          <Input 
            type="email" 
            placeholder="name@example.com" 
            label="Email"
            leftIcon={<Mail className="w-4 h-4 text-muted-foreground" />}
            fullWidth
          />
          <Input 
            type="password" 
            placeholder="••••••••" 
            label="Password"
            leftIcon={<Lock className="w-4 h-4 text-muted-foreground" />}
            fullWidth
          />
        </div>

        <div className="flex items-center justify-between text-sm pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none group">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-primary focus:ring-offset-background accent-primary transition-all group-hover:border-primary/50" 
            />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button size="lg" fullWidth className="mt-8 font-bold text-base shadow-lg shadow-primary/20">
          Login
        </Button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
            <span className="bg-card px-4 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Button variant="outline" type="button" fullWidth leftIcon={<Globe className="w-4 h-4" />} className="font-semibold shadow-sm hover:bg-secondary/50">
            Continue with Google
          </Button>
          <Button variant="outline" type="button" fullWidth leftIcon={<Code className="w-4 h-4" />} className="font-semibold shadow-sm hover:bg-secondary/50">
            Continue with GitHub
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t border-border/50 pt-6 mt-6 pb-2">
        <div className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-primary/80 hover:underline font-bold transition-colors">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
