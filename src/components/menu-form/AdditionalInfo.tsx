import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FormFieldProps, MenuItemForm } from "./types"
import { UseFormReturn } from "react-hook-form"

interface AdditionalInfoProps {
  form: UseFormReturn<MenuItemForm>
}

export function AdditionalInfo({ form }: AdditionalInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
        <CardDescription>Sustainability data and SEO settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="carbon_kg"
            render={({ field, fieldState, formState }: FormFieldProps) => (
              <FormItem>
                <FormLabel>Carbon Footprint (kg)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.001"
                    placeholder="0.125"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormDescription>Environmental impact in kg CO₂</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="packaging"
            render={({ field, fieldState, formState }: FormFieldProps) => (
              <FormItem>
                <FormLabel>Packaging</FormLabel>
                <FormControl>
                  <Input placeholder="Compostable bowl with recyclable lid" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm font-medium">SEO Settings</h4>
          <FormField
            control={form.control}
            name="meta_title"
            render={({ field, fieldState, formState }: FormFieldProps) => (
              <FormItem>
                <FormLabel>Meta Title</FormLabel>
                <FormControl>
                  <Input placeholder="Fresh Greek Garden Salad - Salad House" {...field} />
                </FormControl>
                <FormDescription>Max 60 characters for search results</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meta_description"
            render={({ field, fieldState, formState }: FormFieldProps) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Authentic Greek flavors with fresh vegetables, creamy feta, and house-made vinaigrette. Order online for pickup or delivery."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Max 155 characters for search results</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
} 