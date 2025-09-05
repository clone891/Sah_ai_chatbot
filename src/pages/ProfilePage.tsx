import { useState } from "react"
import { motion } from "framer-motion"
import { User, Edit, Camera, Shield, Bell, Moon, Sun, Download, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/ThemeProvider"

const ProfilePage = () => {
  const { theme, setTheme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Movendu Hinde",
    email: "Hindexxx@email.com",
    phone: "xxxx xxxx 43",
    dateOfBirth: "2005-08-15",
    bio: "Focusing on mental health and personal growth. Interested in mindfulness and anxiety management.",
    emergencyContact: "Sarthak Gaur - 91-9876543210",
    therapist: "Dr. Amit Singh",
    joinDate: "January 2025"
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsReminders: false,
    weeklyReports: true,
    anonymousData: false,
    darkMode: theme === "dark"
  })

  const stats = {
    totalSessions: 24,
    streakDays: 12,
    journalEntries: 45,
    goalsAchieved: 8
  }

  const handleSave = () => {
    setIsEditing(false)
    // Handle save logic here
  }

  const handlePreferenceChange = (key: string, value: boolean) => {
    if (key === "darkMode") {
      setTheme(value ? "dark" : "light")
    }
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 bg-gradient-subtle">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <User className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Profile</h1>
            <p className="text-lg text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/api/placeholder/96/96" alt="Profile" />
                    <AvatarFallback className="text-2xl">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
                <Badge variant="secondary" className="mt-2">
                  Member since {profile.joinDate}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{stats.totalSessions}</p>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{stats.streakDays}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{stats.journalEntries}</p>
                    <p className="text-xs text-muted-foreground">Journal Entries</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{stats.goalsAchieved}</p>
                    <p className="text-xs text-muted-foreground">Goals Met</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input
                    id="emergency"
                    value={profile.emergencyContact}
                    onChange={(e) => setProfile({...profile, emergencyContact: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleSave} className="w-full sm:w-auto">Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full sm:w-auto">Cancel</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Settings & Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Settings & Preferences
                </CardTitle>
                <CardDescription>
                  Customize your app experience and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notifications */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Reminders</p>
                        <p className="text-sm text-muted-foreground">Get session reminders via text</p>
                      </div>
                      <Switch
                        checked={preferences.smsReminders}
                        onCheckedChange={(checked) => handlePreferenceChange("smsReminders", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Progress Reports</p>
                        <p className="text-sm text-muted-foreground">Weekly summary of your progress</p>
                      </div>
                      <Switch
                        checked={preferences.weeklyReports}
                        onCheckedChange={(checked) => handlePreferenceChange("weeklyReports", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Appearance */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    Appearance
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                    </div>
                    <Switch
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => handlePreferenceChange("darkMode", checked)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Privacy */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Privacy
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Anonymous Data Collection</p>
                      <p className="text-sm text-muted-foreground">Help improve our services</p>
                    </div>
                    <Switch
                      checked={preferences.anonymousData}
                      onCheckedChange={(checked) => handlePreferenceChange("anonymousData", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage your data and account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Exported data includes your session history, progress tracking, and personal information. 
                  Account deletion is permanent and cannot be undone.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfilePage
