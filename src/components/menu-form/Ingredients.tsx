import { useState } from "react"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { FormFieldProps, MenuItemForm } from "./types"
import { UseFormReturn } from "react-hook-form"

interface IngredientsProps {
  form: UseFormReturn<MenuItemForm>
}

export function Ingredients({ form }: IngredientsProps) {
  const [currentTopping, setCurrentTopping] = useState("")
  const [currentDressing, setCurrentDressing] = useState("")

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
        <CardTitle>Ingredients & Components</CardTitle>
        <CardDescription>Base ingredients, toppings, and dressings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="base_greens"
          render={({ field, fieldState, formState }: FormFieldProps) => (
            <FormItem>
              <FormLabel>Base Greens</FormLabel>
              <FormControl>
                <Input placeholder="Mixed greens, romaine lettuce" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Toppings Array */}
        <div>
          <FormLabel>Toppings</FormLabel>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add topping"
              value={currentTopping}
              onChange={(e) => setCurrentTopping(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addToArray('toppings', currentTopping, setCurrentTopping)
                }
              }}
            />
            <Button 
              type="button"
              onClick={() => addToArray('toppings', currentTopping, setCurrentTopping)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(form.watch('toppings') || []).map((topping, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {topping}
                <button
                  type="button"
                  onClick={() => removeFromArray('toppings', index)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dressing_default"
            render={({ field, fieldState, formState }: FormFieldProps) => (
              <FormItem>
                <FormLabel>Default Dressing</FormLabel>
                <FormControl>
                  <Input placeholder="Greek vinaigrette" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dressing Options Array */}
        <div>
          <FormLabel>Dressing Options</FormLabel>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add dressing option"
              value={currentDressing}
              onChange={(e) => setCurrentDressing(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addToArray('dressing_options', currentDressing, setCurrentDressing)
                }
              }}
            />
            <Button 
              type="button"
              onClick={() => addToArray('dressing_options', currentDressing, setCurrentDressing)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(form.watch('dressing_options') || []).map((dressing, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {dressing}
                <button
                  type="button"
                  onClick={() => removeFromArray('dressing_options', index)}
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