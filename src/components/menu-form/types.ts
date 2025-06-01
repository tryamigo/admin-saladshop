import * as z from "zod"
import { ControllerRenderProps, ControllerFieldState, FormState } from "react-hook-form"

export const menuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  category: z.enum(["Signature Salads", "Wraps", "Warm Bowls", "Add-Ons", "Drinks", "Desserts"]),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  short_description: z.string().max(140, "Max 140 characters").optional().nullable(),
  long_description: z.string().optional().nullable(),
  base_greens: z.string().optional().nullable(),
  toppings: z.array(z.string()).default([]),
  dressing_default: z.string().optional().nullable(),
  dressing_options: z.array(z.string()).default([]),
  add_on_options: z.array(z.object({
    name: z.string().min(1, "Add-on name required"),
    price: z.number().min(0, "Price must be positive")
  })).default([]),
  serving_size_g: z.number().int().min(0).optional().nullable(),
  calories: z.number().int().min(0).optional().nullable(),
  protein: z.number().min(0).optional().nullable(),
  fat: z.number().min(0).optional().nullable(),
  carbs: z.number().min(0).optional().nullable(),
  fiber: z.number().min(0).optional().nullable(),
  sugar: z.number().min(0).optional().nullable(),
  sodium: z.number().min(0).optional().nullable(),
  dietary_tags: z.array(z.enum(["vegan", "vegetarian", "gluten-friendly", "dairy-free", "nut-free", "keto", "paleo"])).default([]),
  allergens: z.array(z.enum(["Milk", "Eggs", "Fish", "Shellfish", "Peanuts", "Tree nuts", "Soy", "Wheat", "Sesame"])).default([]),
  price: z.number().min(0, "Price must be positive"),
  price_variants: z.array(z.object({
    size: z.string().min(1, "Size required"),
    price: z.number().min(0, "Price must be positive")
  })).default([]),
  tax_category: z.string().optional().nullable(),
  availability_type: z.enum(["always", "seasonal"]).default("always"),
  availability_start: z.date().optional().nullable(),
  availability_end: z.date().optional().nullable(),
  image_hero: z.string().url().optional().nullable(),
  image_thumb: z.string().url().optional().nullable(),
  alt_text: z.string().optional().nullable(),
  video_url: z.string().url().optional().nullable(),
  display_order: z.number().int().optional().nullable(),
  badges: z.array(z.enum(["new", "best_seller", "seasonal"])).default([]),
  cross_sell_ids: z.array(z.string()).default([]),
  carbon_kg: z.number().min(0).optional().nullable(),
  packaging: z.string().optional().nullable(),
  meta_title: z.string().max(60, "Max 60 characters").optional().nullable(),
  meta_description: z.string().max(155, "Max 155 characters").optional().nullable(),
})

export type MenuItemForm = z.infer<typeof menuItemSchema>

export type FormFieldProps = {
  field: ControllerRenderProps<MenuItemForm, any>
  fieldState: ControllerFieldState
  formState: FormState<MenuItemForm>
}

export const categories = ["Signature Salads", "Wraps", "Warm Bowls", "Add-Ons", "Drinks", "Desserts"]
export const dietaryTags = ["vegan", "vegetarian", "gluten-friendly", "dairy-free", "nut-free", "keto", "paleo"]
export const allergens = ["Milk", "Eggs", "Fish", "Shellfish", "Peanuts", "Tree nuts", "Soy", "Wheat", "Sesame"]
export const badges = ["new", "best_seller", "seasonal"] 