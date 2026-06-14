'use client';

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, Camera } from "lucide-react";
import { updateProfile } from "@/app/actions/user";

export function ProfileSettingsForm({ initialName, initialAvatar }: { initialName: string, initialAvatar?: string }) {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState(initialAvatar || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile({ name, avatar_url: avatar });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        return toast.error("File is too large (max 800KB)");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 grid place-items-center overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-primary/40" />
            )}
          </div>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-primary text-primary-foreground grid place-items-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>
        
        <div className="flex-1 space-y-1 text-center sm:text-left">
          <h3 className="font-semibold text-white">Profile Picture</h3>
          <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
          <div className="flex gap-2 mt-2 justify-center sm:justify-start">
            <Button 
              variant="outline" 
              size="sm" 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 text-xs border-white/10"
            >
              Upload New
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              type="button"
              onClick={() => setAvatar("")}
              className="h-8 text-xs text-destructive hover:bg-destructive/10"
            >
              Remove
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            className="bg-background/50 border-white/10"
          />
        </div>
        
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <User className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </form>
    </div>
  );
}
