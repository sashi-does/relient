'use client';

import React, { useState } from 'react';
import { Save, Eye, RotateCcw, HelpCircle } from 'lucide-react';

import { Button } from '@repo/ui/button';
import { Label } from '@repo/ui/label';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@repo/ui/tooltip';
import { Switch } from './ui/switch';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from '@repo/ui/dialog';
import Input from '@repo/ui/input';
import Link from 'next/link';

interface TopNavbarProps {
  feedbackEnabled: boolean;
  setFeedbackEnabled: (checked: boolean) => void;
  handleResetAll: () => void;
  handlePreview: () => void;
  handleSaveWithSlug: (slug: string) => void;
}

function generateRandomSlug(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  feedbackEnabled,
  setFeedbackEnabled,
  handleResetAll,
  handlePreview,
  handleSaveWithSlug,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [slug, setSlug] = useState(generateRandomSlug());

  const handleConfirm = () => {
    handleSaveWithSlug(slug);
    setDialogOpen(false);
  };

  return (
    <header className="bg-card z-10 sticky top-0 border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Label htmlFor="feedback-toggle" className="text-sm">Client Feedback</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Switch
                        className="dark"
                        id="feedback-toggle"
                        checked={feedbackEnabled}
                        onCheckedChange={setFeedbackEnabled}
                      />
                      <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Feedbacks will be received in the inbox of your dashboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button onClick={handleResetAll} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset All</span>
                <span className="sm:hidden">Reset</span>
              </Button>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 w-full sm:w-auto">
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Save Portal</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Your Portal Link</DialogTitle>
                    <DialogDescription>
                      Your client will access the portal at the following link:
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex items-center mt-4">
                    <span className="text-muted-foreground text-sm">relient.in/</span>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="ml-1"
                    />
                  </div>

                  <DialogFooter className="mt-4">
                    <Button onClick={handleConfirm}>Save & Publish</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
