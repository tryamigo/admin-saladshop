"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { MenuItemForm, menuItemSchema } from "@/components/menu-form/types"
import { CoreInformation } from "@/components/menu-form/CoreInformation"
import { MarketingContent } from "@/components/menu-form/MarketingContent"
import { Ingredients } from "@/components/menu-form/Ingredients"
import { Nutrition } from "@/components/menu-form/Nutrition"
import { PricingAndAvailability } from "@/components/menu-form/PricingAndAvailability"
import { Media } from "@/components/menu-form/Media"
import { UXAndMerchandising } from "@/components/menu-form/UXAndMerchandising"
import { AdditionalInfo } from "@/components/menu-form/AdditionalInfo"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function MenuItemPage({ params }: { params: { id: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const isNewItem = params.id === "new"

  const form = useForm<MenuItemForm>({
    resolver: zodResolver(menuItemSchema) as any,
    defaultValues: {
      category: "Signature Salads",
      availability_type: "always",
      toppings: [],
      dressing_options: [],
      add_on_options: [],
      dietary_tags: [],
      allergens: [],
      price_variants: [],
      badges: [],
      cross_sell_ids: [],
    },
  })

  useEffect(() => {
    if (!isNewItem) {
      fetchMenuItem()
    } else {
      setIsLoading(false)
    }
  }, [params.id])

  const fetchMenuItem = async () => {
    try {
      const response = await fetch(`https://backend.thesaladhouse.co/menu/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch menu item')
      }
      const data = await response.json()
      
      // Transform API data to form data format with proper number conversions
      form.reset({
        name: data.name,
        category: data.category,
        slug: data.slug,
        short_description: data.shortDescription,
        long_description: data.longDescription,
        base_greens: data.baseGreens,
        toppings: data.toppings,
        dressing_default: data.dressingDefault,
        dressing_options: data.dressingOptions,
        add_on_options: data.addOnOptions,
        serving_size_g: data.servingSizeG ? Number(data.servingSizeG) : null,
        calories: data.calories ? Number(data.calories) : null,
        protein: data.protein ? Number(data.protein) : null,
        fat: data.fat ? Number(data.fat) : null,
        carbs: data.carbs ? Number(data.carbs) : null,
        fiber: data.fiber ? Number(data.fiber) : null,
        sugar: data.sugar ? Number(data.sugar) : null,
        sodium: data.sodium ? Number(data.sodium) : null,
        dietary_tags: data.dietaryTags,
        allergens: data.allergens,
        price: Number(data.price),
        price_variants: data.priceVariants?.map((variant: any) => ({
          ...variant,
          price: Number(variant.price)
        })) || [],
        tax_category: data.taxCategory,
        availability_type: data.availabilityType,
        availability_start: data.availabilityStart ? new Date(data.availabilityStart) : null,
        availability_end: data.availabilityEnd ? new Date(data.availabilityEnd) : null,
        image_hero: data.imageHero,
        image_thumb: data.imageThumb,
        alt_text: data.altText,
        video_url: data.videoUrl,
        display_order: data.displayOrder ? Number(data.displayOrder) : null,
        badges: data.badges,
        cross_sell_ids: data.crossSellIds,
        carbon_kg: data.carbonKg ? Number(data.carbonKg) : null,
        packaging: data.packaging,
        meta_title: data.metaTitle,
        meta_description: data.metaDescription,
      })
    } catch (error) {
      console.error('Error fetching menu item:', error)
      toast({
        title: "Error",
        description: "Failed to fetch menu item. Please try again.",
        variant: "destructive",
      })
      router.push('/menu')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: MenuItemForm) => {
    setIsSubmitting(true)
    try {
      // Transform the form data to match the API schema with proper number handling
      const menuItemData = {
        name: data.name,
        category: data.category,
        slug: data.slug,
        shortDescription: data.short_description || null,
        longDescription: data.long_description || null,
        baseGreens: data.base_greens || null,
        toppings: data.toppings || [],
        dressingDefault: data.dressing_default || null,
        dressingOptions: data.dressing_options || [],
        addOnOptions: data.add_on_options?.map(option => ({
          ...option,
          price: Number(option.price)
        })) || [],
        servingSizeG: data.serving_size_g ? Number(data.serving_size_g) : null,
        calories: data.calories ? Number(data.calories) : null,
        protein: data.protein ? Number(data.protein) : null,
        fat: data.fat ? Number(data.fat) : null,
        carbs: data.carbs ? Number(data.carbs) : null,
        fiber: data.fiber ? Number(data.fiber) : null,
        sugar: data.sugar ? Number(data.sugar) : null,
        sodium: data.sodium ? Number(data.sodium) : null,
        dietaryTags: data.dietary_tags || [],
        allergens: data.allergens || [],
        price: Number(data.price),
        priceVariants: data.price_variants?.map(variant => ({
          ...variant,
          price: Number(variant.price)
        })) || [],
        taxCategory: data.tax_category || null,
        availabilityType: data.availability_type || 'always',
        availabilityStart: data.availability_start || null,
        availabilityEnd: data.availability_end || null,
        imageHero: data.image_hero || null,
        imageThumb: data.image_thumb || null,
        altText: data.alt_text || null,
        videoUrl: data.video_url || null,
        displayOrder: data.display_order ? Number(data.display_order) : null,
        badges: data.badges || [],
        crossSellIds: data.cross_sell_ids || [],
        carbonKg: data.carbon_kg ? Number(data.carbon_kg) : null,
        packaging: data.packaging || null,
        metaTitle: data.meta_title || null,
        metaDescription: data.meta_description || null,
      }

      const url = isNewItem 
        ? 'https://backend.thesaladhouse.co/menu'
        : `https://backend.thesaladhouse.co/menu/${params.id}`
      
      const method = isNewItem ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItemData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${isNewItem ? 'create' : 'update'} menu item`)
      }

      toast({
        title: `Menu item ${isNewItem ? 'created' : 'updated'} successfully!`,
        description: `The menu item has been ${isNewItem ? 'created' : 'updated'} successfully.`,
      })
      router.push('/menu')
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: `Error ${isNewItem ? 'adding' : 'updating'} menu item`,
        description: error instanceof Error ? error.message : `Error ${isNewItem ? 'adding' : 'updating'} menu item. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">{isNewItem ? 'Add New Menu Item' : 'Edit Menu Item'}</h1>
              <p className="text-muted-foreground">
                {isNewItem ? 'Create a new item for the Salad House menu' : 'Update existing menu item details'}
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <CoreInformation form={form} />
                  <MarketingContent form={form} />
                  <Ingredients form={form} />
                  <Nutrition form={form} />
                  <PricingAndAvailability form={form} />
                  <Media form={form} />
                  <UXAndMerchandising form={form} />
                  <AdditionalInfo form={form} />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-4 sticky bottom-0 bg-background py-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                  >
                    Reset Form
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting 
                      ? (isNewItem ? "Adding Item..." : "Updating Item...") 
                      : (isNewItem ? "Add Menu Item" : "Update Menu Item")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}