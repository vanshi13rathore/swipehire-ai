"use client";

import * as React from "react";
import { Button } from "@/components/shared";
import { Input, Card, CardContent, CardFooter } from "@/components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Globe, Code } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <Card variant="elevated" className="w-full border-border/50 bg-card/60 backdrop-blur-md shadow-2xl p-2 sm:p-4 rounded-[2rem]">
      <CardContent className="space-y-5 pt-4">
        <form onSubmit={handleSignup} className="space-y-4">
          <Input 
            type="text" 
            placeholder="John Doe" 
            label="Full Name"
            leftIcon={<User className="w-4 h-4 text-muted-foreground" />}
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input 
            type="email" 
            placeholder="name@example.com" 
            label="Email"
            leftIcon={<Mail className="w-4 h-4 text-muted-foreground" />}
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input 
            type="password" 
            placeholder="••••••••" 
            label="Password"
            leftIcon={<Lock className="w-4 h-4 text-muted-foreground" />}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          {errorMsg && (
            <div className="p-3 mt-4 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {errorMsg}
            </div>
          )}

          <Button 
            type="submit" 
            size="lg" 
            fullWidth 
            className="mt-8 font-bold text-base shadow-lg shadow-primary/20"
            disabled={isLoading}
            loading={isLoading}
          >
            Create Account
          </Button>
        </form>

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
          <Button disabled={isLoading} variant="outline" type="button" fullWidth leftIcon={<Globe className="w-4 h-4" />} className="font-semibold shadow-sm hover:bg-secondary/50">
            Continue with Google
          </Button>
          <Button disabled={isLoading} variant="outline" type="button" fullWidth leftIcon={<Code className="w-4 h-4" />} className="font-semibold shadow-sm hover:bg-secondary/50">
            Continue with GitHub
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t border-border/50 pt-6 mt-6 pb-2">
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80 hover:underline font-bold transition-colors">
            Log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
