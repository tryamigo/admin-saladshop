import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormFieldProps, MenuItemForm } from "./types"
import { UseFormReturn } from "react-hook-form"

interface MarketingContentProps {
  form: UseFormReturn<MenuItemForm>
}

export function MarketingContent({ form }: MarketingContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing Content</CardTitle>
        <CardDescription>Descriptions and marketing copy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="short_description"
          render={({ field, fieldState, formState }: FormFieldProps) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Input placeholder="Fresh Mediterranean flavors in every bite" {...field} />
              </FormControl>
              <FormDescription>Max 140 characters for quick previews</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="long_description"
          render={({ field, fieldState, formState }: FormFieldProps) => (
            <FormItem>
              <FormLabel>Long Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed description of the item, ingredients, and preparation..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
} 