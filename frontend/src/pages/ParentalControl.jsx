import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Users,
  Settings,
  AlertTriangle,
  Clock,
  Eye,
  MessageCircle,
  Bell,
  Filter,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const ParentalControl = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasParentalConsent, setHasParentalConsent] = useState(false);
  const [settings, setSettings] = useState({
    contentFilter: true,
    ageRestriction: true,
    timeLimit: 60,
    supervisionRequired: true,
    // New detailed settings
    filterLevel: "strict", // strict, moderate, low
    notificationsEnabled: true,
    blockedTopics: [],
    monitoringHours: {
      start: "09:00",
      end: "17:00",
    },
    weekendAccess: true,
    requireApproval: true,
    chatRestrictions: "supervised", // supervised, friends-only, disabled
    reportFrequency: "weekly", // daily, weekly, monthly
  });

  // Blocked topics options
  const availableTopics = [
    "Dating",
    "Social Media",
    "External Links",
    "Chat Features",
    "Forums",
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("parental_controls")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (data) setSettings({ ...settings, ...data });
      }
    };

    fetchSettings();
  }, [user]);

  const handleSettingChange = async (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));

    if (user) {
      await supabase.from("parental_controls").upsert({
        user_id: user.id,
        [key]: value,
        updated_at: new Date(),
      });
    }
  };

  // Add consent check
  useEffect(() => {
    const checkParentalConsent = async () => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("parental_consent")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (!data?.parental_consent) {
          navigate("/dashboard");
          return;
        }

        setHasParentalConsent(true);
        setLoading(false);
      } catch (error) {
        console.error("Error checking parental consent:", error);
        navigate("/dashboard");
      }
    };

    checkParentalConsent();
  }, [user, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <CircularProgress size={40} className="text-indigo-600" />
      </div>
    );
  }

  // Don't render if no parental consent
  if (!hasParentalConsent) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Shield className="w-12 h-12 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Parental Controls
              </h1>
              <p className="text-gray-600">
                Comprehensive safety settings to protect your child
              </p>
            </div>
          </div>
        </div>

        {/* Main Settings Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Content Filtering Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-indigo-500" />
              Content Filtering
            </h2>

            <div className="space-y-4">
              {/* Filter Level */}
              <div className="form-control">
                <label className="text-sm font-medium text-gray-700">
                  Filter Level
                </label>
                <select
                  value={settings.filterLevel}
                  onChange={(e) =>
                    handleSettingChange("filterLevel", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="strict">Strict - Maximum Protection</option>
                  <option value="moderate">
                    Moderate - Balanced Protection
                  </option>
                  <option value="low">Low - Basic Protection</option>
                </select>
              </div>

              {/* Blocked Topics */}
              <div className="form-control">
                <label className="text-sm font-medium text-gray-700">
                  Blocked Topics
                </label>
                <div className="mt-2 space-y-2">
                  {availableTopics.map((topic) => (
                    <label key={topic} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.blockedTopics.includes(topic)}
                        onChange={(e) => {
                          const newTopics = e.target.checked
                            ? [...settings.blockedTopics, topic]
                            : settings.blockedTopics.filter((t) => t !== topic);
                          handleSettingChange("blockedTopics", newTopics);
                        }}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {topic}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Time Management Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-500" />
              Time Management
            </h2>

            <div className="space-y-4">
              {/* Monitoring Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={settings.monitoringHours.start}
                    onChange={(e) =>
                      handleSettingChange("monitoringHours", {
                        ...settings.monitoringHours,
                        start: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="form-control">
                  <label className="text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={settings.monitoringHours.end}
                    onChange={(e) =>
                      handleSettingChange("monitoringHours", {
                        ...settings.monitoringHours,
                        end: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Weekend Access */}
              <div className="form-control">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.weekendAccess}
                    onChange={(e) =>
                      handleSettingChange("weekendAccess", e.target.checked)
                    }
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Allow Weekend Access
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Communication Controls Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-indigo-500" />
              Communication Controls
            </h2>

            <div className="space-y-4">
              {/* Chat Restrictions */}
              <div className="form-control">
                <label className="text-sm font-medium text-gray-700">
                  Chat Restrictions
                </label>
                <select
                  value={settings.chatRestrictions}
                  onChange={(e) =>
                    handleSettingChange("chatRestrictions", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="supervised">Adult Supervised</option>
                  <option value="friends-only">Friends Only</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Monitoring & Reports Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-indigo-500" />
              Monitoring & Reports
            </h2>

            <div className="space-y-4">
              {/* Report Frequency */}
              <div className="form-control">
                <label className="text-sm font-medium text-gray-700">
                  Activity Reports
                </label>
                <select
                  value={settings.reportFrequency}
                  onChange={(e) =>
                    handleSettingChange("reportFrequency", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="daily">Daily Reports</option>
                  <option value="weekly">Weekly Reports</option>
                  <option value="monthly">Monthly Reports</option>
                </select>
              </div>

              {/* Notifications */}
              <div className="form-control">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notificationsEnabled}
                    onChange={(e) =>
                      handleSettingChange(
                        "notificationsEnabled",
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Enable Activity Notifications
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center space-x-3 text-indigo-600 mb-4">
            <Bell className="w-5 h-5" />
            <h2 className="font-semibold">Safety Tips</h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Regularly review these settings with your child</li>
            <li>Discuss online safety and responsible internet usage</li>
            <li>Monitor activity reports to stay informed</li>
            <li>Update restrictions based on your child's maturity</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParentalControl;
