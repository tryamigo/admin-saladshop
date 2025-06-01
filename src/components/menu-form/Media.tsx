import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormFieldProps, MenuItemForm } from "./types"
import { UseFormReturn } from "react-hook-form"

interface MediaProps {
  form: UseFormReturn<MenuItemForm>
}

export function Media({ form }: MediaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media & Assets</CardTitle>
        <CardDescription>Images, videos, and visual content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="image_hero"
            render={({ field, fieldState, formState }: FormFieldProps) => (
              <FormItem>
                <FormLabel>Hero Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/hero.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_thumb"
            render={({ field, fieldState, formState }: FormFieldProps) => (
              <FormItem>
                <FormLabel>Thumbnail Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/thumb.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="alt_text"
          render={({ field, fieldState, formState }: FormFieldProps) => (
            <FormItem>
              <FormLabel>Alt Text</FormLabel>
              <FormControl>
                <Input placeholder="Fresh Greek salad with feta cheese and olives" {...field} />
              </FormControl>
              <FormDescription>Accessibility description for images</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="video_url"
          render={({ field, fieldState, formState }: FormFieldProps) => (
            <FormItem>
              <FormLabel>Video URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/video.mp4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
} 