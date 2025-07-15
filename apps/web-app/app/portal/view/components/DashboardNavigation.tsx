'use client'

import React from 'react';
import { Button } from '@repo/ui/button';
import type { DashboardSection } from '@repo/types/ui-types';

interface DashboardNavigationProps {
  sections: DashboardSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  sections,
  activeSection,
  onSectionChange
}) => {
  const availableSections = sections.filter(section => section.available);

  return (
    <div className="px-4 lg:px-6 pb-4">
      <nav className="flex flex-wrap gap-1 lg:gap-2">
        {availableSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <Button
              key={section.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onSectionChange(section.id)}
              className={`flex items-center gap-2 text-xs lg:text-sm ${
                isActive 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">{section.name}</span>
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardNavigation;