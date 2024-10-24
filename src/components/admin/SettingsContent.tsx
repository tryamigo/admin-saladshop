import React,{useState} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from "@/components/ui/button"
const SettingsContent: React.FC = () => {
    const [siteName, setSiteName] = useState('Food Delivery Admin')
    const [minimumOrder, setMinimumOrder] = useState('10')
    const [enableNotifications, setEnableNotifications] = useState(true)
  
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
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
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
                  value={minimumOrder}
                  onChange={(e) => setMinimumOrder(e.target.value)}
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
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                />
                <Label htmlFor="notifications">Enable Push Notifications</Label>
              </div>
              {/* Add more notification settings here */}
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6">
          <Button>Save Settings</Button>
        </div>
      </div>
    )
  }
  export default SettingsContent