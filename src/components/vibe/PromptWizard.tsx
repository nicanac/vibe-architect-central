"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  FileText,
  Target,
  Copy,
  Check,
  Wand2,
} from "lucide-react";
import { useVibeClipboard } from "@/lib/hooks/useVibeClipboard";

interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: WizardStep[] = [
  {
    id: 1,
    title: "Persona",
    description: "Define who the AI should be",
    icon: <User className="h-5 w-5" />,
  },
  {
    id: 2,
    title: "Context",
    description: "Set the scenario and background",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: 3,
    title: "Task",
    description: "Specify what you need done",
    icon: <Target className="h-5 w-5" />,
  },
  {
    id: 4,
    title: "Preview",
    description: "Review your orchestration prompt",
    icon: <Sparkles className="h-5 w-5" />,
  },
];

const personaPresets = [
  { label: "Senior Vibe Architect", value: "You are a Senior Vibe Architect—an expert AI-assisted developer who orchestrates multiple AI tools to build production-quality software." },
  { label: "Code Reviewer", value: "You are a meticulous senior code reviewer with 15+ years of experience. You focus on code quality, security, performance, and maintainability." },
  { label: "System Designer", value: "You are a principal software architect specializing in distributed systems, API design, and scalable infrastructure." },
  { label: "DevOps Engineer", value: "You are a seasoned DevOps engineer expert in CI/CD pipelines, containerization, cloud infrastructure, and automation." },
  { label: "Custom", value: "" },
];

const contextPresets = [
  { label: "Greenfield Project", value: "We are starting a new project from scratch with no legacy constraints. Modern best practices and latest stable versions should be used." },
  { label: "Legacy Modernization", value: "We are modernizing a legacy codebase. Changes must be incremental and backward-compatible. Existing patterns should be respected where sensible." },
  { label: "Production Hotfix", value: "This is a production system requiring an urgent fix. Changes must be minimal, well-tested, and low-risk. Rollback strategy is essential." },
  { label: "Prototype/MVP", value: "We are building a rapid prototype to validate an idea. Speed is prioritized over perfection, but the code should still be readable." },
  { label: "Custom", value: "" },
];

const targetAIOptions = [
  "Claude",
  "GPT-4",
  "Cursor",
  "GitHub Copilot",
  "Gemini",
  "Any AI",
];

export function PromptWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [persona, setPersona] = useState("");
  const [personaPreset, setPersonaPreset] = useState("");
  const [context, setContext] = useState("");
  const [contextPreset, setContextPreset] = useState("");
  const [task, setTask] = useState("");
  const [targetAI, setTargetAI] = useState("Any AI");
  const [copied, setCopied] = useState(false);
  const { copy } = useVibeClipboard();

  const generatePrompt = () => {
    const parts: string[] = [];
    
    if (persona) {
      parts.push(`## Persona\n${persona}`);
    }
    
    if (context) {
      parts.push(`## Context\n${context}`);
    }
    
    if (task) {
      parts.push(`## Task\n${task}`);
    }

    return parts.join("\n\n");
  };

  const handleCopy = async () => {
    const prompt = generatePrompt();
    await copy(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePresetChange = (
    type: "persona" | "context",
    value: string
  ) => {
    const presets = type === "persona" ? personaPresets : contextPresets;
    const preset = presets.find((p) => p.label === value);
    
    if (type === "persona") {
      setPersonaPreset(value);
      if (preset && preset.value) {
        setPersona(preset.value);
      }
    } else {
      setContextPreset(value);
      if (preset && preset.value) {
        setContext(preset.value);
      }
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return persona.trim().length > 0;
      case 2:
        return context.trim().length > 0;
      case 3:
        return task.trim().length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => setCurrentStep(step.id)}
              className={`flex flex-col items-center gap-2 transition-all ${
                currentStep === step.id
                  ? "text-primary-accent"
                  : currentStep > step.id
                  ? "text-neon-success"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  currentStep === step.id
                    ? "border-primary-accent bg-primary-accent/20"
                    : currentStep > step.id
                    ? "border-neon-success bg-neon-success/20"
                    : "border-white/20 bg-surface"
                }`}
              >
                {step.icon}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {step.title}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-all ${
                  currentStep > step.id ? "bg-neon-success" : "bg-white/10"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <Card className="vibe-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {steps[currentStep - 1].icon}
                Step {currentStep}: {steps[currentStep - 1].title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {steps[currentStep - 1].description}
              </p>
            </div>
            <Badge variant="outline" className="text-primary-accent border-primary-accent/50">
              {currentStep} / {steps.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Persona */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Choose a Preset (Optional)</Label>
                <Select value={personaPreset} onValueChange={(v) => handlePresetChange("persona", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a persona preset..." />
                  </SelectTrigger>
                  <SelectContent>
                    {personaPresets.map((preset) => (
                      <SelectItem key={preset.label} value={preset.label}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="persona">Persona Description</Label>
                <Textarea
                  id="persona"
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  placeholder="Describe who the AI should be (role, expertise, personality)..."
                  className="min-h-[150px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  A strong persona helps the AI understand the perspective and expertise level to adopt.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Context */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Choose a Preset (Optional)</Label>
                <Select value={contextPreset} onValueChange={(v) => handlePresetChange("context", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a context preset..." />
                  </SelectTrigger>
                  <SelectContent>
                    {contextPresets.map((preset) => (
                      <SelectItem key={preset.label} value={preset.label}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="context">Context & Background</Label>
                <Textarea
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Describe the project context, constraints, and relevant background..."
                  className="min-h-[150px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Context helps ground the AI&apos;s responses in your specific situation.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Task */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Target AI</Label>
                <Select value={targetAI} onValueChange={setTargetAI}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {targetAIOptions.map((ai) => (
                      <SelectItem key={ai} value={ai}>
                        {ai}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task">Task Description</Label>
                <Textarea
                  id="task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Describe what you need the AI to do. Be specific about deliverables and format..."
                  className="min-h-[150px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Clear, specific tasks with defined deliverables yield the best results.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Generated Orchestration Prompt</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{targetAI}</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="gap-2"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-neon-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
              <div className="relative">
                <pre className="p-4 rounded-lg bg-black/50 border border-white/10 text-sm font-mono whitespace-pre-wrap overflow-auto max-h-[400px]">
                  {generatePrompt() || "Complete the previous steps to generate your prompt."}
                </pre>
                <div className="absolute top-2 right-2">
                  <Wand2 className="h-4 w-4 text-primary-accent animate-pulse" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Copy this prompt and paste it into your preferred AI assistant to start your orchestrated workflow.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        {currentStep < steps.length ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="gap-2 bg-primary-accent hover:bg-primary-accent/80 text-white"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleCopy}
            className="gap-2 bg-neon-success hover:bg-neon-success/80 text-white"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Prompt"}
          </Button>
        )}
      </div>
    </div>
  );
}
