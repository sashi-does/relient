"use client";

import React, { useRef, useState } from "react";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Building2, Bell, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import type { DashboardData } from "@repo/types/ui-types";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "@repo/ui/sonner";

interface DashboardHeaderProps {
  data: DashboardData;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ data }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const feedbackRef = useRef<HTMLTextAreaElement>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const params = useParams();

  async function sendFeedback() {
    const portalId = params.slug;
    const res = await axios.post("/api/notify", {
      portalId,
      feedback: feedbackRef.current?.value,
    });
    if (res.data.success) {
      toast.success("Feedback sent successfully");
      setFeedbackOpen(!feedbackOpen);
    }
  }

  const notifications = [
    {
      id: 1,
      title: "Welcome to your Dashboard!",
      message:
        "Track your projects, manage tasks, and monitor performance all in one place.",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "New Feature Update",
      message:
        "We've added enhanced analytics and reporting features to help you make better decisions.",
      time: "1 day ago",
    },
    {
      id: 3,
      title: "Performance Tip",
      message:
        "Your task completion rate has improved by 15% this month. Keep up the great work!",
      time: "3 days ago",
    },
  ];

  return (
    <div className="flex items-center justify-between p-4 lg:p-6">
      <div className="flex items-center gap-3 lg:gap-4">
        <Building2 className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
        <h1 className="text-xl lg:text-2xl font-bold text-foreground">
          Relient
        </h1>
        <Badge
          variant="outline"
          className="border-border text-muted-foreground hidden sm:inline-flex"
        >
          {data.status}
        </Badge>
        <Toaster />
      </div>

      {/* Notification and Feedback buttons in top right */}
      <div className="flex items-center gap-3">

        <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-foreground">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b last:border-0 hover:bg-accent"
                >
                  <h4 className="font-medium text-foreground text-sm">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notification.time}
                  </p>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Feedback Button */}
        {data.feedback && (
          <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedback
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Feedback</DialogTitle>
                <DialogDescription>
                  We'd love to hear your thoughts! Help us improve your
                  dashboard experience.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    What's on your mind?
                  </label>
                  <textarea
                    ref={feedbackRef}
                    className="w-full min-h-[100px] p-3 border border-border rounded-md bg-background text-foreground resize-none"
                    placeholder="Tell us about your experience, suggest features, or report any issues..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setFeedbackOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => sendFeedback()}>Send Feedback</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
