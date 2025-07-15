import React from 'react';
import { User, Settings, LogOut, Save, Eye, RotateCcw, HelpCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu';
import { Button } from '@repo/ui/button';
import { Badge } from '@repo/ui/badge';
import { Label } from '@repo/ui/label';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@repo/ui/tooltip';
import { Switch } from './ui/switch';

interface TopNavbarProps {
  feedbackEnabled: boolean;
  setFeedbackEnabled: (checked: boolean) => void;
  handleResetAll: () => void;
  handlePreview: () => void;
  handleSave: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  feedbackEnabled,
  setFeedbackEnabled,
  handleResetAll,
  handlePreview,
  handleSave,
}) => {




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
                  <Button onClick={handlePreview} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Live Preview</span>
                    <span className="sm:hidden">Preview</span>
                  </Button>
                  <Button onClick={handleSave} className="flex items-center gap-2 w-full sm:w-auto">
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Save Portal</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                </div>
              </div>

          {/* User Menu */}
          
        </div>
      </div>
    </header>
  );
};
