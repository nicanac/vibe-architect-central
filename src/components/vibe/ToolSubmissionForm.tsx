'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Send, CheckCircle2 } from 'lucide-react'
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

import { toolSubmissionSchema, type ToolSubmission } from '@/lib/validations/submissions'
import { submitTool } from '@/lib/actions/submissions'

interface ToolSubmissionFormProps {
  onSuccess?: () => void
}

export function ToolSubmissionForm({ onSuccess }: ToolSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ToolSubmission>({
    resolver: zodResolver(toolSubmissionSchema),
    defaultValues: {
      name: '',
      description: '',
      url: '',
      pricing: '',
    },
  })

  const onSubmit = async (data: ToolSubmission) => {
    setIsSubmitting(true)
    
    const result = await submitTool(data)
    
    if (result.success) {
      setIsSuccess(true)
      toast.success('Tool submitted successfully!', {
        description: 'Thank you for contributing to the Vibe Architect community.',
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
        <CheckCircle2 className="w-16 h-16 text-neon-success mb-4" />
        <h3 className="text-xl font-semibold text-foreground">Submission Received!</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          Your tool has been submitted for review. Our team will verify it meets 
          Senior Architect standards before publishing.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setIsSuccess(false)}
        >
          Submit Another Tool
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tool Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Tool Name *</Label>
        <Input
          id="name"
          placeholder="e.g., Cursor, Bolt.new, v0.dev"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe what the tool does and why it's useful for vibe architects..."
          className="min-h-[100px]"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* URL */}
      <div className="space-y-2">
        <Label htmlFor="url">Website URL *</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          {...register('url')}
        />
        {errors.url && (
          <p className="text-sm text-red-500">{errors.url.message}</p>
        )}
      </div>

      {/* Vibe Level */}
      <div className="space-y-2">
        <Label>Vibe Level *</Label>
        <Select onValueChange={(value) => setValue('vibe_level', value as ToolSubmission['vibe_level'])}>
          <SelectTrigger>
            <SelectValue placeholder="Select vibe level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-code">No-Code - Visual builders, drag & drop</SelectItem>
            <SelectItem value="low-code">Low-Code - Minimal coding required</SelectItem>
            <SelectItem value="agentic">Agentic - AI-powered code generation</SelectItem>
            <SelectItem value="pro-orchestration">Pro Orchestration - Advanced prompt engineering</SelectItem>
          </SelectContent>
        </Select>
        {errors.vibe_level && (
          <p className="text-sm text-red-500">{errors.vibe_level.message}</p>
        )}
      </div>

      {/* Pricing */}
      <div className="space-y-2">
        <Label htmlFor="pricing">Pricing *</Label>
        <Input
          id="pricing"
          placeholder="e.g., Free, $20/mo, Free / $20/mo"
          {...register('pricing')}
        />
        {errors.pricing && (
          <p className="text-sm text-red-500">{errors.pricing.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full glow-primary"
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
            Submit Tool
          </>
        )}
      </Button>
    </form>
  )
}
