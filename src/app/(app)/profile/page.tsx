"use client";

import Button from "@/components/Button";
import { useAuthStore } from "@/stores/authStore";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, logout, isLoading } = useAuthStore();
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 bg-[var(--accent)] rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Button 
      onClick={() => router.push("/login")}
      variant="secondary"
      size="lg"
      >
        Sign in to view your profile
      </Button>
    );
  }

  return (
    <div className="min-h-full w-full bg-[var(--bg-dark2)] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-[var(--bg-dark1)] rounded-xl p-8 mb-8 border border-[var(--bg-dark3)]">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-[var(--accent)] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {user.userName.charAt(0).toUpperCase()}
              </span>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[var(--text1)] mb-2">
                Welcome back!
              </h1>
              <p className="text-[var(--text2)] mb-4">
                Manage your account settings and preferences
              </p>
              <div className="flex items-center space-x-2 text-[var(--text2)]">
                <Mail size={16} />
                <span>{user.userName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Account Information */}
          <div className="bg-[var(--bg-dark1)] rounded-xl p-6 border border-[var(--bg-dark3)]">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-[var(--accent)]/20 rounded-lg flex items-center justify-center">
                <User className="text-[var(--accent)]" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-[var(--text1)]">
                Account Information
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text2)] mb-1">
                  Username
                </label>
                <div className="p-3 bg-[var(--bg-dark3)] rounded-lg border border-[var(--bg-dark3)]">
                  <span className="text-[var(--text1)]">{user.userName}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text2)] mb-1">
                  User ID
                </label>
                <div className="p-3 bg-[var(--bg-dark3)] rounded-lg border border-[var(--bg-dark3)]">
                  <span className="text-[var(--text1)] font-mono text-sm">{user.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-[var(--bg-dark1)] rounded-xl p-6 border border-[var(--bg-dark3)]">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-[var(--green)]/20 rounded-lg flex items-center justify-center">
                <Shield className="text-[var(--green)]" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-[var(--text1)]">
                Account Status
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[var(--bg-dark3)] rounded-lg">
                <span className="text-[var(--text2)]">Account Status</span>
                <span className="px-2 py-1 bg-[var(--green)]/20 text-[var(--green)] rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-[var(--bg-dark3)] rounded-lg">
                <span className="text-[var(--text2)]">Member Since</span>
                <span className="text-[var(--text1)] text-sm">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--bg-dark1)] rounded-xl p-6 border border-[var(--bg-dark3)]">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-[var(--highlight)]/20 rounded-lg flex items-center justify-center">
              <Calendar className="text-[var(--highlight)]" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text1)]">
              Quick Actions
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-4 bg-[var(--bg-dark3)] hover:bg-[var(--bg-dark2)] rounded-lg border border-[var(--bg-dark3)] transition-colors text-left">
              <h3 className="font-medium text-[var(--text1)] mb-1">Update Username</h3>
              <p className="text-sm text-[var(--text2)]">Change your username</p>
            </button>
            
            <button className="p-4 bg-[var(--bg-dark3)] hover:bg-[var(--bg-dark2)] rounded-lg border border-[var(--bg-dark3)] transition-colors text-left">
              <h3 className="font-medium text-[var(--text1)] mb-1">Change Password</h3>
              <p className="text-sm text-[var(--text2)]">Update your password</p>
            </button>
            
            <button 
              onClick={handleLogout}
              className="p-4 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition-colors text-left"
            >
              <h3 className="font-medium text-red-500 mb-1">Sign Out</h3>
              <p className="text-sm text-red-400">Log out of your account</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}