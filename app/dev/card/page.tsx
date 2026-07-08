"use client";

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardSubtitle, 
  CardDescription, 
  CardContent, 
  CardFooter, 
  CardImage, 
  CardBadge 
} from "@/components/ui";
import { Button } from "@/components/shared";
import { MapPin, Briefcase } from "lucide-react";

export default function CardDevPage() {
  return (
    <div className="min-h-screen p-8 bg-background text-foreground pb-20">
      <h1 className="text-3xl font-bold mb-8">Card Component Testing</h1>

      <div className="space-y-12 max-w-5xl">
        <section>
          <h2 className="text-xl font-semibold mb-6 border-b border-border pb-2">Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Standard styling</CardDescription>
              </CardHeader>
              <CardContent>
                <p>The standard card looks like this.</p>
              </CardContent>
            </Card>
            
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>Drop shadow styling</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card has more prominent shadows.</p>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Outlined Card</CardTitle>
                <CardDescription>Stronger border</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Transparent background, bold border.</p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>Glass Card</CardTitle>
                <CardDescription>Backdrop blur</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Frosted glass effect on the background.</p>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Gradient Card</CardTitle>
                <CardDescription>Brand styling</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Subtle gradient background effect.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6 border-b border-border pb-2">Sizes</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Card size="sm" className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle>Small Size</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Compact padding (p-4)</p>
              </CardContent>
            </Card>
            
            <Card size="md" className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle>Medium Size</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Default padding (p-6)</p>
              </CardContent>
            </Card>
            
            <Card size="lg" className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle>Large Size</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Generous padding (p-8)</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6 border-b border-border pb-2">States & Interactions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card clickable variant="elevated">
              <CardHeader>
                <CardTitle>Clickable / Hover State</CardTitle>
                <CardDescription>Hover over me</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Notice the subtle lift and cursor change.</p>
              </CardContent>
            </Card>
            
            <Card loading>
              <CardHeader>
                <CardTitle>Loading State</CardTitle>
                <CardDescription>Fetching data...</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This content is obscured by the loading spinner.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6 border-b border-border pb-2">Composition Showcase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="default">
              <CardBadge>New Match</CardBadge>
              <CardImage src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team" className="h-48" />
              <CardHeader>
                <CardTitle className="text-2xl">Senior Frontend Engineer</CardTitle>
                <CardSubtitle>Stripe • New York, NY</CardSubtitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Briefcase className="w-4 h-4" /> Full-time
                  <MapPin className="w-4 h-4 ml-2" /> Hybrid
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Join our team to build the future of payments. We are looking for an experienced React engineer.</p>
              </CardContent>
              <CardFooter className="gap-4">
                <Button variant="outline" fullWidth>Skip</Button>
                <Button variant="primary" fullWidth>Apply</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
