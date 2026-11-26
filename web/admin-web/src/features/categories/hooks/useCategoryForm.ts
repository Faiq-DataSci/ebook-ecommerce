import { useCallback, useState, type FormEvent } from 'react'
import type {
  CategoryFormData,
  CategoryFormErrors,
  CategoryFormField,
  CategoryListItem,
} from '../types/category'
import { generateSlug, validateCategoryForm } from '../utils/category.utils'

const FIELD_ORDER: CategoryFormField[] = ['name', 'slug', 'description']

function createInitialFormData(category?: CategoryListItem | null): CategoryFormData {
  if (!category) {
    return {
      name: '',
      slug: '',
      description: '',
      isActive: true,
    }
  }

  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? '',
    isActive: category.isActive,
  }
}

interface UseCategoryFormOptions {
  category?: CategoryListItem | null
  existingCategories: CategoryListItem[]
  onSubmit: (data: CategoryFormData) => void | Promise<void>
  onFirstErrorField?: (field: CategoryFormField) => void
}

export function useCategoryForm({
  category,
  existingCategories,
  onSubmit,
  onFirstErrorField,
}: UseCategoryFormOptions) {
  const isEditMode = Boolean(category)

  const [formData, setFormData] = useState<CategoryFormData>(() =>
    createInitialFormData(category),
  )
  const [errors, setErrors] = useState<CategoryFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSlugTouched, setIsSlugTouched] = useState<boolean>(() =>
    Boolean(category),
  )

  const resetForm = useCallback(() => {
    setFormData(createInitialFormData(category))
    setIsSlugTouched(Boolean(category))
    setErrors({})
    setSubmitError(null)
    setIsSubmitting(false)
  }, [category])

  const handleNameChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: !isEditMode && !isSlugTouched ? generateSlug(value) : prev.slug,
      }))
      setErrors((prev) =>
        prev.name || (!isEditMode && !isSlugTouched && prev.slug)
          ? {
              ...prev,
              name: undefined,
              slug: !isEditMode && !isSlugTouched ? undefined : prev.slug,
            }
          : prev,
      )
      setSubmitError(null)
    },
    [isEditMode, isSlugTouched],
  )

  const handleSlugChange = useCallback((value: string) => {
    setIsSlugTouched(true)
    setFormData((prev) => ({ ...prev, slug: value }))
    setErrors((prev) => (prev.slug ? { ...prev, slug: undefined } : prev))
    setSubmitError(null)
  }, [])

  const handleRegenerateSlug = useCallback(() => {
    setIsSlugTouched(false)
    setFormData((prev) => ({
      ...prev,
      slug: generateSlug(prev.name),
    }))
    setErrors((prev) => (prev.slug ? { ...prev, slug: undefined } : prev))
  }, [])

  const handleDescriptionChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, description: value }))
    setErrors((prev) =>
      prev.description ? { ...prev, description: undefined } : prev,
    )
    setSubmitError(null)
  }, [])

  const handleActiveChange = useCallback((checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }, [])

  const handleBlur = useCallback(
    (field: CategoryFormField) => {
      const validationErrors = validateCategoryForm(
        formData,
        existingCategories,
        category?.id,
      )
      setErrors((prev) => ({
        ...prev,
        [field]: validationErrors[field],
      }))
    },
    [formData, existingCategories, category?.id],
  )

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (isSubmitting) return

      const validationErrors = validateCategoryForm(
        formData,
        existingCategories,
        category?.id,
      )

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        const firstInvalidField = FIELD_ORDER.find(
          (field) => Boolean(validationErrors[field]),
        )
        if (firstInvalidField && onFirstErrorField) {
          onFirstErrorField(firstInvalidField)
        }
        return
      }

      setIsSubmitting(true)
      setSubmitError(null)

      try {
        await onSubmit({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim(),
          isActive: formData.isActive,
        })
      } catch (err) {
        const message =
          err instanceof Error && err.message
            ? err.message
            : 'Kategori belum dapat disimpan. Periksa kembali isian lalu coba lagi.'
        setSubmitError(message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      isSubmitting,
      formData,
      existingCategories,
      category?.id,
      onFirstErrorField,
      onSubmit,
    ],
  )

  return {
    isEditMode,
    formData,
    errors,
    submitError,
    isSubmitting,
    handleNameChange,
    handleSlugChange,
    handleRegenerateSlug,
    handleDescriptionChange,
    handleActiveChange,
    handleBlur,
    handleSubmit,
    resetForm,
  }
}
