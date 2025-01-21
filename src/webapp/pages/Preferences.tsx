import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AVAILABLE_FONTS = [
  { name: "Inter", value: "font-inter" },
  { name: "Roboto", value: "font-roboto" },
  { name: "Open Sans", value: "font-opensans" },
];

const AVAILABLE_LANGUAGES = [
  { name: "English", value: "en" },
  { name: "Spanish", value: "es" },
  { name: "French", value: "fr" },
];

const Preferences = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [font, setFont] = React.useState("font-inter");
  const [language, setLanguage] = React.useState("en");
  const [isDirty, setIsDirty] = React.useState(false);

  React.useEffect(() => {
    document.body.className = `${font} ${theme}`;
  }, [font, theme]);

  const handleChange = (key: string, value: string) => {
    switch (key) {
      case "theme":
        setTheme(value as "light" | "dark" | "system");
        break;
      case "font":
        setFont(value);
        break;
      case "language":
        setLanguage(value);
        break;
    }
    setIsDirty(true);
  };

  const handleSave = () => {
    // Save preferences to localStorage or backend
    localStorage.setItem("preferences", JSON.stringify({ theme, font, language }));
    toast({
      title: "Preferences saved",
      description: "Your preferences have been updated successfully.",
    });
    setIsDirty(false);
  };

  return (
    <div className="container max-w-4xl py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <Select value={theme} onValueChange={(value) => handleChange("theme", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Font</label>
              <Select value={font} onValueChange={(value) => handleChange("font", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_FONTS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={language} onValueChange={(value) => handleChange("language", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={!isDirty}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Preferences;
