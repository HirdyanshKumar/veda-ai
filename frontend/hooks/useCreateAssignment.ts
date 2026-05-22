import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '../store/assignmentStore';
import { api } from '../lib/api';

export const useCreateAssignment = () => {
  const router = useRouter();
  
  const { 
    currentStep, 
    formData, 
    setStep,
    resetForm,
    assignments,
    setAssignments
  } = useAssignmentStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateStepOne = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title || !formData.title.trim()) {
      errors.title = "Assignment Title is required";
    } else if (formData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters long";
    }

    if (!formData.subject || !formData.subject.trim()) {
      errors.subject = "Subject is required";
    }

    if (!formData.difficulty) {
      errors.difficulty = "Difficulty must be set";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStepTwo = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.dueDate || !formData.dueDate.trim()) {
      errors.dueDate = "Due Date is required";
    } else {
      // Basic future date validation
      const parts = formData.dueDate.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const inputDate = new Date(year, month, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (isNaN(inputDate.getTime())) {
          errors.dueDate = "Please enter a valid date in DD-MM-YYYY format";
        } else if (inputDate < today) {
          errors.dueDate = "Due Date must be a future date";
        }
      } else {
        errors.dueDate = "Date format must be DD-MM-YYYY";
      }
    }

    if (!formData.questionTypeRows || formData.questionTypeRows.length === 0) {
      errors.questionTypeRows = "At least one question type is required";
    } else {
      // Validate individual rows
      const rowTypes = new Set<string>();
      formData.questionTypeRows.forEach((row) => {
        if (!row.type || !row.type.trim()) {
          errors[`row_${row.id}_type`] = "Question Type cannot be empty";
        } else if (rowTypes.has(row.type)) {
          errors[`row_${row.id}_type`] = "Duplicate question types are not allowed";
        } else {
          rowTypes.add(row.type);
        }

        if (row.questions < 1) {
          errors[`row_${row.id}_questions`] = "Must have at least 1 question";
        }
        if (row.marks < 1) {
          errors[`row_${row.id}_marks`] = "Marks must be at least 1";
        }
      });
    }

    if (formData.additionalInstructions && formData.additionalInstructions.length > 500) {
      errors.additionalInstructions = "Instructions must be under 500 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goNext = () => {
    if (currentStep === 1) {
      if (validateStepOne()) {
        setStep(2);
      }
    }
  };

  const goPrev = () => {
    if (currentStep === 2) {
      setStep(1);
      setValidationErrors({});
    } else {
      router.push('/assignments');
    }
  };

  const submitForm = async (): Promise<string | null> => {
    if (!validateStepTwo()) return null;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const assignment = await api.createAssignment(formData);
      
      // Update local state in store
      setAssignments([assignment, ...assignments]);
      
      // Reset wizard form
      resetForm();
      
      setIsSubmitting(false);
      router.push(`/assignments/${assignment._id}`);
      return assignment._id;
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to submit assignment");
      setIsSubmitting(false);
      return null;
    }
  };

  return {
    currentStep,
    formData,
    isSubmitting,
    submitError,
    goNext,
    goPrev,
    submitForm,
    validationErrors,
    setValidationErrors,
    resetForm
  };
};
export default useCreateAssignment;
