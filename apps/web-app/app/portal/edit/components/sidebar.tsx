import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Calendar, 
  CreditCard,
  FileText,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui/tooltip';
import { ModuleSettings } from './dashboard';
import { Button } from '@repo/ui/button';
import { Switch } from './ui/switch';
import Image from 'next/image';

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
  const [showModuleSettings, setShowModuleSettings] = useState(false);

  const enabledMenuItems = menuItems.filter(item => {
    if (item.id === 'overview') return true;
    return moduleSettings[item.id as keyof ModuleSettings];
  });

  const renderMenuItem = (item: typeof menuItems[0]) => {
    const isActive = activeModule === item.id;
    const Icon = item.icon;
    
    const button = (
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`w-full h-[36px] my-[2px] ${collapsed ? "justify-center" : "justify-start"} text-[#b9b9b9] ${
          isActive ? 'bg-[#404040] text-[#ffffff]' : 'hover:bg-accent hover:cursor-pointer hover:text-accent-foreground'
        }`}
        onClick={() => onModuleChange(item.id)}
      >
        <Icon className={`!h-[16px] !w-[16px] ${collapsed ? '' : 'mr-2 md:mr-3'}`} />
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
    if (collapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full h-[36px] mt-[40px] my-[2px] justify-center text-[#b9b9b9] hover:bg-accent hover:cursor-pointer hover:text-accent-foreground"
                onClick={() => setShowModuleSettings(!showModuleSettings)}
              >
                <Settings className="!h-[16px] !w-[16px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p className='text-[15px]'>Module Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <div className="px-3 md:px-4 py-3 md:py-4">
        <div 
          className="flex items-center justify-between mb-2 md:mb-3 cursor-pointer"
          onClick={() => setShowModuleSettings(!showModuleSettings)}
        >
          <h3 className="text-xs md:text-sm font-medium text-muted-foreground">Module Settings</h3>
          <ChevronRight className={`h-4 w-4 transition-transform ${showModuleSettings ? 'rotate-90' : ''}`} />
        </div>
        {showModuleSettings && (
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
        )}
      </div>
    );
  };
  
  return (
    <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
      collapsed ? 'w-[64px]' : 'w-[245px]'
    } flex flex-col h-full`}>
      <div className="p-1 md:p-1 border-sidebar-border">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center mt-4">
            <Image
              src="/relient.png"
              alt="Relient Logo"
              width={28}
              height={28}
              className="invert brightness-0 opacity-80"
            />
            {!collapsed && <span className="font-extrabold text-2xl ml-2 logo">Relient</span>}
          </div>
          <span className="text-[10px] text-[#757474] flex justify-center items-center">
            {!collapsed && "Portal Builder - beta"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-3 md:py-4 overflow-y-auto">
        <nav className="px-1 min-h-[200px] md:px-2">
          {enabledMenuItems.map(renderMenuItem)}
        </nav>

        {renderModuleSettings()}
      </div>

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