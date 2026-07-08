import { Button } from "@/components/shared";
import { Mail, ArrowRight } from "lucide-react";

export default function ButtonDevPage() {
  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-8">Button Component Testing</h1>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">Variants</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="success">Success</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">Sizes (Primary Variant)</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm">Small (sm)</Button>
          <Button size="md">Medium (md)</Button>
          <Button size="lg">Large (lg)</Button>
          <Button size="xl">Extra Large (xl)</Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">States & Icons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button disabled>Disabled</Button>
          <Button loading>Loading State</Button>
          <Button leftIcon={<Mail className="w-4 h-4" />}>Left Icon</Button>
          <Button rightIcon={<ArrowRight className="w-4 h-4" />}>Right Icon</Button>
          <Button 
            variant="outline" 
            leftIcon={<Mail className="w-4 h-4" />} 
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Both Icons
          </Button>
        </div>
      </section>
      
      <section className="mb-12 max-w-md">
        <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">Full Width</h2>
        <div className="flex flex-col gap-4">
          <Button fullWidth>Full Width Button</Button>
          <Button fullWidth variant="outline" loading>Full Width Loading</Button>
        </div>
      </section>
    </div>
  );
}
