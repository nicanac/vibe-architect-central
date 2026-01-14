'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Send, CheckCircle2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { promptSubmissionSchema, type PromptSubmission } from '@/lib/validations/submissions'
import { submitPrompt } from '@/lib/actions/submissions'

interface PromptSubmissionFormProps {
  onSuccess?: () => void
}

export function PromptSubmissionForm({ onSuccess }: PromptSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PromptSubmission>({
    resolver: zodResolver(promptSubmissionSchema),
    defaultValues: {
      title: '',
      content: '',
      target_ai: '',
    },
  })

  const onSubmit = async (data: PromptSubmission) => {
    setIsSubmitting(true)
    
    const result = await submitPrompt(data)
    
    if (result.success) {
      setIsSuccess(true)
      toast.success('Prompt submitted successfully!', {
        description: 'Your orchestration technique has been added to the Vault.',
      })
      reset()
      onSuccess?.()
    } else {
      toast.error('Submission failed', {
        description: result.error,
      })
    }
    
    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="relative">
          <CheckCircle2 className="w-16 h-16 text-neon-success mb-4" />
          <Sparkles className="w-6 h-6 text-primary-accent absolute -top-1 -right-1 animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Prompt Added to the Vault!</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          Thank you for sharing your orchestration technique. 
          Keep building, keep vibing. 🚀
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setIsSuccess(false)}
        >
          Submit Another Prompt
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Prompt Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Prompt Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Chain of Thought Reasoning, Senior Architect Persona"
          {...register('title')}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Prompt Content */}
      <div className="space-y-2">
        <Label htmlFor="content">Prompt Content *</Label>
        <Textarea
          id="content"
          placeholder="Enter your orchestration prompt here..."
          className="min-h-[200px] font-mono"
          {...register('content')}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      {/* Target AI */}
      <div className="space-y-2">
        <Label htmlFor="target_ai">Target AI *</Label>
        <Input
          id="target_ai"
          placeholder="e.g., Claude 3.5, GPT-4, Gemini Pro"
          {...register('target_ai')}
        />
        {errors.target_ai && (
          <p className="text-sm text-red-500">{errors.target_ai.message}</p>
        )}
      </div>

      {/* Technique */}
      <div className="space-y-2">
        <Label>Technique Category *</Label>
        <Select onValueChange={(value) => setValue('technique', value as PromptSubmission['technique'])}>
          <SelectTrigger>
            <SelectValue placeholder="Select technique" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Chain of Thought">Chain of Thought</SelectItem>
            <SelectItem value="ReAct">ReAct (Reasoning + Acting)</SelectItem>
            <SelectItem value="Persona">Persona / Role-Playing</SelectItem>
            <SelectItem value="Tree of Thoughts">Tree of Thoughts</SelectItem>
            <SelectItem value="Few-Shot">Few-Shot Learning</SelectItem>
            <SelectItem value="Zero-Shot">Zero-Shot</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.technique && (
          <p className="text-sm text-red-500">{errors.technique.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        className="w-full bg-neon-success hover:bg-neon-success/90 glow-success"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit to Vault
          </>
        )}
      </Button>
    </form>
  )
}
