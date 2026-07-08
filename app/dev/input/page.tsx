"use client";

import { useState } from "react";
import { Input } from "@/components/ui";
import { Mail, Search, Lock, User, CreditCard, Calendar } from "lucide-react";

export default function InputDevPage() {
  const [searchValue, setSearchValue] = useState("React Engineer");

  return (
    <div className="min-h-screen p-8 bg-background text-foreground pb-20">
      <h1 className="text-3xl font-bold mb-8">Input Component Testing</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
        <section>
          <h2 className="text-xl font-semibold mb-6 border-b border-border pb-2">Basic Variations</h2>
          <div className="space-y-6">
            <Input label="Default Input" placeholder="Type here..." />
            
            <Input 
              label="With Helper Text" 
              placeholder="e.g. john@example.com" 
              helperText="We'll never share your email with anyone else." 
            />
            
            <Input 
              label="Required Field" 
              placeholder="Enter your name" 
              required 
            />
            
            <Input 
              label="Disabled State" 
              placeholder="You cannot edit this" 
              disabled 
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6 border-b border-border pb-2">Validation States</h2>
          <div className="space-y-6">
            <Input 
              label="Error State" 
              placeholder="Enter username" 
              defaultValue="invalid-user"
              error="Username is already taken." 
            />
            
            <Input 
              label="Success State" 
              placeholder="Enter username" 
              defaultValue="valid-user"
              success 
              helperText="This username is available!" 
            />
            
            <Input 
              label="Loading State" 
              placeholder="Checking availability..." 
              loading 
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6 border-b border-border pb-2">Icons & Adornments</h2>
          <div className="space-y-6">
            <Input 
              label="Left Icon" 
              placeholder="Enter email" 
              type="email"
              leftIcon={<Mail className="h-4 w-4" />} 
            />
            
            <Input 
              label="Right Icon" 
              placeholder="Card number" 
              rightIcon={<CreditCard className="h-4 w-4" />} 
            />
            
            <Input 
              label="Both Icons" 
              placeholder="Search users..." 
              leftIcon={<User className="h-4 w-4" />} 
              rightIcon={<Search className="h-4 w-4" />} 
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6 border-b border-border pb-2">Special Types</h2>
          <div className="space-y-6">
            <Input 
              label="Password Input" 
              type="password" 
              placeholder="Enter your password" 
              leftIcon={<Lock className="h-4 w-4" />}
            />
            
            <Input 
              label="Search with Clear" 
              type="search" 
              placeholder="Search..." 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
              leftIcon={<Search className="h-4 w-4" />}
            />
            
            <Input 
              label="Date Picker" 
              type="date" 
              leftIcon={<Calendar className="h-4 w-4" />}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
