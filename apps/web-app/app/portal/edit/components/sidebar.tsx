
import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Calendar, 
  CreditCard,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui/tooltip';
import { Separator } from '@repo/ui/seperator';
import { ModuleSettings } from './dashboard';
import { Button } from '@repo/ui/button';
import { Switch } from '@repo/ui/switch';

interface SidebarProps {
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
  activeModule: string;
  onModuleChange: (module: string) => void;
  moduleSettings: ModuleSettings;
  onModuleToggle: (module: keyof ModuleSettings) => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'invoice', label: 'Create Invoice', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  activeModule,
  onModuleChange,
  moduleSettings,
  onModuleToggle,
}) => {

  // Filter menu items to only show enabled modules
  const enabledMenuItems = menuItems.filter(item => {
    // Always show overview
    if (item.id === 'overview') return true;
    // Show other items only if they're enabled in moduleSettings
    return moduleSettings[item.id as keyof ModuleSettings];
  });

  const renderMenuItem = (item: typeof menuItems[0]) => {
    const isActive = activeModule === item.id;
    const Icon = item.icon;
    
    const button = (
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`w-full justify-start h-10 md:h-12 ${collapsed ? 'px-2 md:px-3' : 'px-3 md:px-4'} ${
          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
        }`}
        onClick={() => onModuleChange(item.id)}
      >
        <Icon className={`h-4 w-4 md:h-5 md:w-5 ${collapsed ? '' : 'mr-2 md:mr-3'}`} />
        {!collapsed && <span className="text-xs md:text-sm font-medium">{item.label}</span>}
      </Button>
    );

    if (collapsed) {
      return (
        <TooltipProvider key={item.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <div key={item.id}>{button}</div>;
  };

  const renderModuleSettings = () => {
    if (collapsed) return null;

    return (
      <div className="px-3 md:px-4 py-3 md:py-4">
        <h3 className="text-xs md:text-sm font-medium mb-2 md:mb-3 text-muted-foreground">Module Settings</h3>
        <div className="space-y-2 md:space-y-3">
          {Object.entries(moduleSettings).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-xs md:text-sm capitalize">{key}</label>
              <Switch
                checked={enabled}
                onCheckedChange={() => onModuleToggle(key as keyof ModuleSettings)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
      collapsed ? 'w-12 md:w-16' : 'w-60 md:w-64'
    } flex flex-col h-full`}>
      {/* Logo */}
      <div className="p-3 md:p-4 border-b border-sidebar-border">
        <div className="flex items-center">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs md:text-sm">R</span>
          </div>
          {!collapsed && (
            <div className="ml-2 md:ml-3 min-w-0">
              <h1 className="font-bold text-sm md:text-lg text-sidebar-foreground truncate">Relient</h1>
              <p className="text-xs text-muted-foreground">Portal Builder</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-3 md:py-4 overflow-y-auto">
        <nav className="px-1 md:px-2 space-y-1">
          {enabledMenuItems.map(renderMenuItem)}
        </nav>

        {!collapsed && (
          <>
            <Separator className="my-3 md:my-4" />
            {renderModuleSettings()}
          </>
        )}
      </div>

      {/* Settings Toggle - Only show on desktop */}
      <div className="hidden md:block p-2 border-t border-sidebar-border">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                onClick={() => onToggle(!collapsed)}
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={collapsed ? "right" : "top"}>
              <p>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};