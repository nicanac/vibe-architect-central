
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StepDetails } from './steps/step-details';
import { StepStack } from './steps/step-stack';
import { StepWorkflows } from './steps/step-workflows';
import { StepReview } from './steps/step-review';

export type WizardData = {
  projectName: string;
  description: string;
  techStack: string[];
  selectedWorkflows: string[];
};

const initialData: WizardData = {
  projectName: '',
  description: '',
  techStack: [],
  selectedWorkflows: [],
};

const steps = [
  { id: 'details', title: 'Project Info' },
  { id: 'stack', title: 'Tech Stack' },
  { id: 'workflows', title: 'Workflows' },
  { id: 'review', title: 'Review & Build' },
];

export function ProjectWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WizardData>(initialData);

  const updateData = (updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="w-full space-y-8">
      {/* Stepper Header */}
      <div className="flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10" />
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isActive
                    ? 'border-[var(--terminal-purple)] bg-[var(--terminal-purple)] text-black'
                    : isCompleted
                    ? 'border-[var(--terminal-purple)] bg-background text-[var(--terminal-purple)]'
                    : 'border-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-[var(--terminal-purple)]' : 'text-muted-foreground'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="min-h-[400px] p-6 relative overflow-hidden backdrop-blur-md bg-background/50 border-[var(--color-border)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {currentStep === 0 && <StepDetails data={data} updateData={updateData} />}
            {currentStep === 1 && <StepStack data={data} updateData={updateData} />}
            {currentStep === 2 && <StepWorkflows data={data} updateData={updateData} />}
            {currentStep === 3 && <StepReview data={data} />}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="border-[var(--terminal-purple)] text-[var(--terminal-purple)] hover:bg-[var(--terminal-purple)] hover:text-black"
        >
          Back
        </Button>
        
        {!isLastStep ? (
          <Button 
            onClick={nextStep}
            className="bg-[var(--terminal-purple)] text-black hover:bg-[var(--terminal-purple)]/90"
            disabled={currentStep === 0 && !data.projectName} // Simple validation
          >
            Next
          </Button>
        ) : (
             // The Review step handles the generation action itself
            <span />
        )}
      </div>
    </div>
  );
}
