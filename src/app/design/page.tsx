"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ChipSelector } from "@/components/ui/chip-selector";
import { RangeSlider } from "@/components/ui/range-slider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";

const NAV_ITEMS = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons" },
  { id: "forms", label: "Form Elements" },
  { id: "cards", label: "Cards" },
  { id: "spacing", label: "Spacing" },
  { id: "radius", label: "Border Radius" },
  { id: "effects", label: "Effects" },
];

export default function DesignSystemPage() {
  // State for interactive demos
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [rangeMin, setRangeMin] = useState(25);
  const [rangeMax, setRangeMax] = useState(45);

  const selectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const chipOptions = [
    { value: "travel", label: "Travel" },
    { value: "hiking", label: "Hiking" },
    { value: "cooking", label: "Cooking" },
    { value: "reading", label: "Reading" },
    { value: "gaming", label: "Gaming" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container-main py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="hover:opacity-80 transition-opacity">
              <Logo variant="icon" size="sm" />
            </a>
            <h1 className="text-xl font-semibold">Design System</h1>
          </div>
          <a href="/" className="text-sm font-[450] text-muted hover:text-foreground transition-colors">
            Back to Home
          </a>
        </div>
      </header>

      <div className="container-main py-16 flex gap-16">
        {/* Left Nav */}
        <nav className="hidden lg:block w-48 flex-shrink-0">
          <div className="sticky top-24">
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block text-sm font-[450] text-muted hover:text-foreground transition-colors py-1"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-24">
        {/* Colors Section */}
        <section id="colors">
          <SectionHeader title="Colors" description="The color palette for Chosn" />

          <div className="space-y-8">
            {/* Primary */}
            <div>
              <h3 className="theme-caption mb-4">Primary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ColorSwatch name="Forest" value="#2F7255" className="bg-forest" />
                <ColorSwatch name="Forest Light" value="#419161" className="bg-forest-light" />
              </div>
            </div>

            {/* Secondary */}
            <div>
              <h3 className="theme-caption mb-4">Secondary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ColorSwatch name="Coral" value="#E06E3D" className="bg-coral" />
                <ColorSwatch name="Marigold" value="#F5AA3D" className="bg-marigold" />
                <ColorSwatch name="Cream" value="#F5F0E8" className="bg-cream" textDark />
                <ColorSwatch name="Navy" value="#19131D" className="bg-navy" />
              </div>
            </div>

            {/* Neutral */}
            <div>
              <h3 className="theme-caption mb-4">Neutral</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ColorSwatch name="Foreground" value="#111111" className="bg-foreground" />
                <ColorSwatch name="Muted" value="#555555" className="bg-muted" />
                <ColorSwatch name="Muted Light" value="#888888" className="bg-muted-light" />
                <ColorSwatch name="Background" value="#FFFFFF" className="bg-background border border-border" textDark />
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section id="typography">
          <SectionHeader title="Typography" description="Satoshi is our primary typeface for all text" />

          <div className="space-y-12">
            {/* Headings */}
            <div>
              <h3 className="theme-caption mb-6">Headings</h3>
              <div className="space-y-6">
                <TypographyRow
                  label="Display / Fluid"
                  weight="700"
                  size="clamp(3rem, 8vw, 5rem)"
                  className="text-fluid-display font-display leading-[0.9]"
                >
                  Find Your People
                </TypographyRow>
                <TypographyRow
                  label="H1 / Fluid"
                  weight="700"
                  size="clamp(2.5rem, 7vw, 4.5rem)"
                  className="text-fluid-h1 font-display leading-[0.9]"
                >
                  Thrive Childfree
                </TypographyRow>
                <TypographyRow
                  label="H2 / Fluid"
                  weight="700"
                  size="clamp(2rem, 5vw, 3rem)"
                  className="text-fluid-h2 font-display leading-[0.9]"
                >
                  A family you choose
                </TypographyRow>
                <TypographyRow
                  label="H3"
                  weight="600"
                  size="24px"
                  className="text-2xl font-semibold"
                >
                  Section heading
                </TypographyRow>
                <TypographyRow
                  label="H4"
                  weight="600"
                  size="20px"
                  className="text-xl font-semibold"
                >
                  Subsection heading
                </TypographyRow>
              </div>
            </div>

            {/* Body */}
            <div>
              <h3 className="theme-caption mb-6">Body Text</h3>
              <div className="space-y-6">
                <TypographyRow
                  label="Body Large"
                  weight="450"
                  size="18px"
                  className="text-lg theme-body"
                >
                  The modern platform for childfree adults seeking meaningful connections—dating, friendship, and chosen family.
                </TypographyRow>
                <TypographyRow
                  label="Body"
                  weight="450"
                  size="16px"
                  className="text-base theme-body"
                >
                  Connect with people who understand that a fulfilling life doesn&apos;t require children. Build your community, find your people.
                </TypographyRow>
                <TypographyRow
                  label="Body Small"
                  weight="450"
                  size="14px"
                  className="text-sm theme-body"
                >
                  Join thousands of childfree individuals building meaningful connections.
                </TypographyRow>
              </div>
            </div>

            {/* Utility */}
            <div>
              <h3 className="theme-caption mb-6">Utility Text</h3>
              <div className="space-y-6">
                <TypographyRow
                  label="Caption"
                  weight="500"
                  size="12px"
                  extras="uppercase, tracking 0.05em"
                  className="theme-caption"
                >
                  Early Access
                </TypographyRow>
                <TypographyRow
                  label="Secondary"
                  weight="450"
                  size="14px"
                  extras="muted color"
                  className="theme-secondary"
                >
                  Optional helper text for forms and descriptions
                </TypographyRow>
                <TypographyRow
                  label="Button"
                  weight="600"
                  size="12px"
                  extras="uppercase, tracking wide"
                  className="font-mono text-[12px] font-semibold uppercase tracking-wide"
                >
                  Join Waitlist
                </TypographyRow>
              </div>
            </div>

            {/* Font Weights */}
            <div>
              <h3 className="theme-caption mb-6">Font Weights</h3>
              <div className="space-y-4">
                <div className="flex items-baseline gap-4 border-b border-border pb-4">
                  <span className="text-xs font-[450] text-muted w-28">Body (450)</span>
                  <span className="text-2xl font-[450]">Satoshi Body</span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-border pb-4">
                  <span className="text-xs font-[450] text-muted w-28">Medium (500)</span>
                  <span className="text-2xl font-medium">Satoshi Medium</span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-border pb-4">
                  <span className="text-xs font-[450] text-muted w-28">Semibold (600)</span>
                  <span className="text-2xl font-semibold">Satoshi Semibold</span>
                </div>
                <div className="flex items-baseline gap-4 border-b border-border pb-4">
                  <span className="text-xs font-[450] text-muted w-28">Bold (700)</span>
                  <span className="text-2xl font-bold">Satoshi Bold</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section id="buttons">
          <SectionHeader title="Buttons" description="Interactive button components with variants and sizes" />

          <div className="space-y-8">
            {/* Variants */}
            <div>
              <h3 className="theme-caption mb-4">Variants</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="default">Default</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="theme-caption mb-4">Sizes</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="theme-caption mb-4">States</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Form Elements Section */}
        <section id="forms">
          <SectionHeader title="Form Elements" description="Input fields and form controls" />

          <div className="space-y-8 max-w-md">
            {/* Input */}
            <div>
              <h3 className="theme-caption mb-4">Input</h3>
              <div className="space-y-4">
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Input
                  label="With Hint"
                  hint="optional"
                  placeholder="Enter something..."
                />
                <Input
                  label="Error State"
                  error="This field is required"
                  placeholder="Enter something..."
                />
              </div>
            </div>

            {/* Textarea */}
            <div>
              <h3 className="theme-caption mb-4">Textarea</h3>
              <Textarea
                label="Bio"
                placeholder="Tell us about yourself..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                maxLength={200}
                showCount
                rows={4}
              />
            </div>

            {/* Select */}
            <div>
              <h3 className="theme-caption mb-4">Select</h3>
              <label className="block text-sm font-medium text-foreground mb-2">
                Choose an option
              </label>
              <Select
                value={selectValue}
                onChange={setSelectValue}
                options={selectOptions}
                placeholder="Select..."
              />
            </div>

            {/* Chip Selector */}
            <div>
              <h3 className="theme-caption mb-4">Chip Selector</h3>
              <ChipSelector
                options={chipOptions}
                selected={selectedChips}
                onChange={setSelectedChips}
                max={3}
                label="Interests"
                hint="select up to 3"
              />
            </div>

            {/* Range Slider */}
            <div>
              <h3 className="theme-caption mb-4">Range Slider</h3>
              <RangeSlider
                label="Age range"
                min={18}
                max={99}
                minValue={rangeMin}
                maxValue={rangeMax}
                onMinChange={setRangeMin}
                onMaxChange={setRangeMax}
              />
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section id="cards">
          <SectionHeader title="Cards" description="Container components for grouping content" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>A simple card with header and content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted">
                  Cards provide a flexible container for grouping related content and actions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-forest/20 bg-forest/5">
              <CardHeader>
                <CardTitle className="text-forest">Accent Card</CardTitle>
                <CardDescription>Card with accent styling</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted">
                  Use accent colors for cards that need emphasis.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Card with a button action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted">
                  Combine cards with other components.
                </p>
                <Button variant="accent" size="sm">Learn More</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Spacing Section */}
        <section id="spacing">
          <SectionHeader title="Spacing" description="Consistent spacing scale used throughout the app" />

          <div className="space-y-4">
            {[
              { name: "2", value: "8px", class: "w-2" },
              { name: "3", value: "12px", class: "w-3" },
              { name: "4", value: "16px", class: "w-4" },
              { name: "6", value: "24px", class: "w-6" },
              { name: "8", value: "32px", class: "w-8" },
              { name: "12", value: "48px", class: "w-12" },
              { name: "16", value: "64px", class: "w-16" },
              { name: "24", value: "96px", class: "w-24" },
            ].map((space) => (
              <div key={space.name} className="flex items-center gap-4">
                <div className={`${space.class} h-4 bg-forest rounded`} />
                <span className="text-sm font-[450] text-muted w-20">{space.name}</span>
                <span className="text-sm font-[450] text-foreground">{space.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius Section */}
        <section id="radius">
          <SectionHeader title="Border Radius" description="Rounded corners for UI elements" />

          <div className="flex flex-wrap gap-6">
            {[
              { name: "sm", value: "4px", class: "rounded-sm" },
              { name: "md", value: "6px", class: "rounded-md" },
              { name: "lg", value: "8px", class: "rounded-lg" },
              { name: "xl", value: "12px", class: "rounded-xl" },
              { name: "2xl", value: "16px", class: "rounded-2xl" },
              { name: "full", value: "9999px", class: "rounded-full" },
            ].map((radius) => (
              <div key={radius.name} className="text-center">
                <div className={`w-20 h-20 bg-forest/20 border-2 border-forest ${radius.class} mb-2`} />
                <p className="text-sm font-medium">{radius.name}</p>
                <p className="text-xs font-[450] text-muted">{radius.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Effects Section */}
        <section id="effects">
          <SectionHeader title="Effects" description="Visual effects and animations" />

          <div className="space-y-8">
            {/* Frosted Glass */}
            <div>
              <h3 className="theme-caption mb-4">Frosted Glass</h3>
              <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-forest/30 to-coral/30">
                <div className="absolute inset-4 frosted rounded-xl flex items-center justify-center">
                  <p className="text-foreground font-medium text-sm">Frosted Glass Effect</p>
                </div>
              </div>
            </div>

            {/* Animations */}
            <div>
              <h3 className="theme-caption mb-4">Animations</h3>
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-forest rounded-xl animate-float mb-2" />
                  <p className="text-xs font-[450] text-muted">Float</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-coral rounded-xl animate-float-delayed mb-2" />
                  <p className="text-xs font-[450] text-muted">Float Delayed</p>
                </div>
              </div>
            </div>

            {/* Transitions */}
            <div>
              <h3 className="theme-caption mb-4">Easing</h3>
              <div className="flex gap-4">
                <Button className="ease-organic">Organic Easing</Button>
                <p className="text-sm font-[450] text-muted self-center">
                  cubic-bezier(0.22, 1, 0.36, 1)
                </p>
              </div>
            </div>
          </div>
        </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container-main text-center text-sm font-[450] text-muted">
          Chosn Design System
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="theme-secondary">{description}</p>
    </div>
  );
}

function ColorSwatch({
  name,
  value,
  className,
  textDark = false
}: {
  name: string;
  value: string;
  className: string;
  textDark?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className={`h-24 rounded-xl ${className} flex items-end p-3`}>
        <span className={`text-sm font-medium ${textDark ? "text-foreground" : "text-white"}`}>
          {name}
        </span>
      </div>
      <p className="text-xs font-[450] text-muted">{value}</p>
    </div>
  );
}

function TypographyRow({
  label,
  weight,
  size,
  extras,
  className,
  children
}: {
  label: string;
  weight: string;
  size: string;
  extras?: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border pb-6">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-[450] text-muted mb-2">
        <span>{label}</span>
        <span>{size}</span>
        <span>wt {weight}</span>
        {extras && <span>{extras}</span>}
      </div>
      <p className={className}>{children}</p>
    </div>
  );
}
