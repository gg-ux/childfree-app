"use client";

import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface PromptOption {
  value: string;
  text: string;
}

interface PromptPickerProps {
  prompts: PromptOption[];
  selectedPrompt: string;
  answer: string;
  onPromptChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  label?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
}

export function PromptPicker({
  prompts,
  selectedPrompt,
  answer,
  onPromptChange,
  onAnswerChange,
  label,
  required,
  maxLength = 300,
  className,
}: PromptPickerProps) {
  const promptOptions = prompts.map((p) => ({
    value: p.value,
    label: p.text,
  }));

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-3">
          {label}
          {required && <span className="text-coral ml-1">*</span>}
        </label>
      )}
      <div className="space-y-3">
        <Select
          value={selectedPrompt}
          onChange={onPromptChange}
          options={promptOptions}
          placeholder="Choose a prompt..."
        />
        {selectedPrompt && (
          <div className="animate-fadeIn">
            <Textarea
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Your answer..."
              rows={3}
              maxLength={maxLength}
              showCount
            />
          </div>
        )}
      </div>
    </div>
  );
}
