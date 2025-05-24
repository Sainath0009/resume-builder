import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { Button} from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { User, Settings, CreditCard, Bell, Shield } from "lucide-react"
export default async function AccountPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-zinc-600 mt-1">Manage your account preferences and settings</p>
        </div>
        <Link href="/user-profile">
          <Button className="mt-4 md:mt-0 bg-teal-600 hover:bg-teal-700 text-white">Edit Profile</Button>
        </Link>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>View and manage your basic account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 mb-1">Full Name</h3>
                  <p className="text-base">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 mb-1">Email Address</h3>
                  <p className="text-base">{user.emailAddresses[0]?.emailAddress}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 mb-1">Account Created</h3>
                  <p className="text-base">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 mb-1">Account ID</h3>
                  <p className="text-base text-zinc-600">{user.id}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/user-profile">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your security preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Visit your profile settings to change your password and manage two-factor authentication.</p>
            </CardContent>
            <CardFooter>
              <Link href="/user-profile">
                <Button variant="outline">Security Settings</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <p>You are currently on the Free plan. Upgrade to unlock premium features.</p>
            </CardContent>
            <CardFooter>
              <Link href="/pricing">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">Upgrade Plan</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how we contact you</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Manage your notification settings in your profile.</p>
            </CardContent>
            <CardFooter>
              <Link href="/user-profile">
                <Button variant="outline">Notification Settings</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Manage your application preferences and settings.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
