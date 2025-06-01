'use client'
import React,{useState,useEffect} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from "@/components/ui/button"
import {useToast } from '@/hooks/use-toast'

interface Settings {
  siteName: string
  minimumOrder: string
  enableNotifications: boolean
  // Add more settings as needed
}
const SettingsContentPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'Food Delivery Admin',
    minimumOrder: '10',
    enableNotifications: true,
  })
  const {toast} =useToast()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    // Load settings from API or local storage
    const loadSettings = async () => {
      setIsLoading(true)
      try {
        // const response = await fetch('/api/settings')
        // const data = await response.json()
        // setSettings(data)
        // For now, we'll use local storage
        const storedSettings = localStorage.getItem('adminSettings')
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings))
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
        toast({
          title: "Error",
          description: "Failed to load settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [toast])

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Implement API call to save settings
      // await fetch('/api/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // })
      // For now, we'll use local storage
      localStorage.setItem('adminSettings', JSON.stringify(settings))
      toast({
        title: "Success",
        description: "Settings saved successfully.",
      })
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  const handleChange = (key: keyof Settings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Settings</h3>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="space-y-4">
              <div>
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  />
              </div>
              {/* Add more general settings here */}
            </div>
          </TabsContent>
          <TabsContent value="orders">
            <div className="space-y-4">
              <div>
                <Label htmlFor="minimum-order">Minimum Order Amount ($)</Label>
                <Input
                  id="minimum-order"
                  type="number"
                  value={settings.minimumOrder}
                  onChange={(e) => handleChange('minimumOrder', e.target.value)}
                  />
              </div>
              {/* Add more order settings here */}
            </div>
          </TabsContent>
          <TabsContent value="notifications">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="notifications"
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => handleChange('enableNotifications', checked)}
                  />
                <Label htmlFor="notifications">Enable Push Notifications</Label>
              </div>
              {/* Add more notification settings here */}
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
      </div>
    )
  }
  export default SettingsContentPage