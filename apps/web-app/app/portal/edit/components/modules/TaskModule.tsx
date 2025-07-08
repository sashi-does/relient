import React, { useState } from 'react';
import { Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from '@repo/ui/card';
import { Plus, Calendar, Flag, CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/select';
import { Textarea } from '@repo/ui/text-area';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/popover';
import { Calendar as CalendarComponent } from '@repo/ui/calendar';
import { format } from 'date-fns';
import { Task } from '../dashboard';
import { Button } from '@repo/ui/button';
import { Badge } from '@repo/ui/badge';
import Input from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import { cn } from '@repo/ui/utils';
import { toast } from 'sonner';

interface TasksModuleProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onDragEnd: (result: DropResult) => void;
}

const columns = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'completed', title: 'Completed', color: 'bg-green-100 dark:bg-green-900' },
];

export const TasksModule: React.FC<TasksModuleProps> = ({
  tasks,
  setTasks,
}) => {
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDueDate, setSelectedDueDate] = useState<Date>();
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    dueDate: '',
    status: 'backlog' as Task['status'],
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: newTask.status,
      dueDate: newTask.dueDate || undefined,
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      status: 'backlog',
    });
    setSelectedDueDate(undefined);
    setNewTaskOpen(false);

    toast.success("New task has been added successfully");
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate || '',
      status: task.status,
    });
    if (task.dueDate) {
      setSelectedDueDate(new Date(task.dueDate));
    }
    setEditTaskOpen(true);
  };

  const handleUpdateTask = () => {
    if (!newTask.title.trim() || !editingTask) {
      toast.error("Task title is required");
      return;
    }

    setTasks(prev => prev.map(task => 
      task.id === editingTask.id ? {
        ...task,
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
        dueDate: newTask.dueDate || undefined,
      } : task
    ));

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      status: 'backlog',
    });
    setSelectedDueDate(undefined);
    setEditTaskOpen(false);
    setEditingTask(null);

    toast.success("Task has been updated successfully");
  };

  const handleClearAll = () => {
    setTasks([]);
    toast.success( "All tasks have been cleared");
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const TaskCard: React.FC<{ task: Task; index: number }> = ({ task, index }) => (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
            snapshot.isDragging ? 'shadow-lg rotate-3' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm flex-1">{task.title}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTask(task);
                  }}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
              
              {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                  <Flag className="w-3 h-3 mr-1" />
                  {task.priority}
                </Badge>
                
                {task.dueDate && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Task Management</h2>
          <p className="text-muted-foreground">Organize your tasks with drag and drop</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClearAll} className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
          
          <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Enter task description"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value as Task['priority'] })}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={newTask.status} onValueChange={(value) => setNewTask({ ...newTask, status: value as Task['status'] })}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="backlog">Backlog</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDueDate ? format(selectedDueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDueDate}
                        onSelect={(date) => {
                          setSelectedDueDate(date);
                          setNewTask({ 
                            ...newTask, 
                            dueDate: date ? format(date, "yyyy-MM-dd") : ''
                          });
                        }}
                        initialFocus
                        className="p-3 pointer-events-auto bg-popover border rounded-lg shadow-lg"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewTaskOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTask}>
                    Create Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={editTaskOpen} onOpenChange={setEditTaskOpen}>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value as Task['priority'] })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={newTask.status} onValueChange={(value) => setNewTask({ ...newTask, status: value as Task['status'] })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDueDate ? format(selectedDueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDueDate}
                    onSelect={(date) => {
                      setSelectedDueDate(date);
                      setNewTask({ 
                        ...newTask, 
                        dueDate: date ? format(date, "yyyy-MM-dd") : ''
                      });
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto bg-popover border rounded-lg shadow-lg"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditTaskOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTask}>
                Update Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <div key={column.id} className="space-y-4">
            <div className={`p-4 rounded-lg ${column.color}`}>
              <h3 className="font-semibold text-lg">{column.title}</h3>
              <p className="text-sm opacity-75">
                {tasks.filter(task => task.status === column.id).length} tasks
              </p>
            </div>
            
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[200px] p-2 rounded-lg border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                >
                  {tasks
                    .filter(task => task.status === column.id)
                    .map((task, index) => (
                      <div key={task.id} className="group">
                        <TaskCard task={task} index={index} />
                      </div>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </div>
  );
};