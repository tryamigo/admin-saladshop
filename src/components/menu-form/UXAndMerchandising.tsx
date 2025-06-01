import { useState } from "react"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { FormFieldProps, MenuItemForm, badges } from "./types"
import { UseFormReturn } from "react-hook-form"

interface UXAndMerchandisingProps {
  form: UseFormReturn<MenuItemForm>
}

export function UXAndMerchandising({ form }: UXAndMerchandisingProps) {
  const [currentCrossSell, setCurrentCrossSell] = useState("")

  const addToArray = (fieldName: keyof MenuItemForm, value: string, setValue: (value: string) => void) => {
    if (!value.trim()) return
    
    const currentValues = form.getValues(fieldName) as string[] || []
    if (!currentValues.includes(value.trim())) {
      form.setValue(fieldName, [...currentValues, value.trim()] as any)
    }
    setValue("")
  }

  const removeFromArray = (fieldName: keyof MenuItemForm, index: number) => {
    const currentValues = form.getValues(fieldName) as string[] || []
    const newValues = currentValues.filter((_, i) => i !== index)
    form.setValue(fieldName, newValues as any)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>UX & Merchandising</CardTitle>
        <CardDescription>Display settings and cross-selling options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="display_order"
          render={({ field, fieldState, formState }: FormFieldProps) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="1"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                />
              </FormControl>
              <FormDescription>Lower numbers appear first in menus</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Badges */}
        <FormField
          control={form.control}
          name="badges"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Display Badges</FormLabel>
                <FormDescription>
                  Special badges to highlight this item
                </FormDescription>
              </div>
              <div className="flex gap-4">
                {badges.map((badge) => (
                  <FormField
                    key={badge}
                    control={form.control}
                    name="badges"
                    render={({ field, fieldState, formState }: FormFieldProps) => {
                      return (
                        <FormItem
                          key={badge}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(badge as any)}
                              onCheckedChange={(checked) => {
                                const current = field.value || []
                                if (checked) {
                                  field.onChange([...current, badge])
                                } else {
                                  field.onChange(current.filter((value: string) => value !== badge))
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {badge.replace('_', ' ')}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cross-sell IDs */}
        <div>
          <FormLabel>Cross-sell Items</FormLabel>
          <FormDescription className="mb-2">
            Enter item IDs for cross-selling recommendations
          </FormDescription>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Enter item ID"
              value={currentCrossSell}
              onChange={(e) => setCurrentCrossSell(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addToArray('cross_sell_ids', currentCrossSell, setCurrentCrossSell)
                }
              }}
            />
            <Button 
              type="button"
              onClick={() => addToArray('cross_sell_ids', currentCrossSell, setCurrentCrossSell)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(form.watch('cross_sell_ids') || []).map((id, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {id}
                <button
                  type="button"
                  onClick={() => removeFromArray('cross_sell_ids', index)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 