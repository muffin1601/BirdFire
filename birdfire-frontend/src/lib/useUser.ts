"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

interface Profile {
  id: string;
  email?: string | null;
  phone?: string | null;
  full_name?: string | null;
  role?: string | null;
  is_active?: boolean | null;
}

export function useUser() {
  const { user: authUser, loading: authLoading } = useAuth();
  const authUserId = authUser?.id;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getProfile = async () => {
      if (!authUserId) {
        if (isMounted) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUserId)
          .maybeSingle();

        if (error) {
          console.error("Profile fetch error:", error);
        }

        if (isMounted) setProfile(profileData || null);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getProfile();

    return () => {
      isMounted = false;
    };
  }, [authUserId]);

  return {
    user: authUser,
    profile,
    loading: authLoading || loading,
    isAuthenticated: !!authUser,
  };
}
