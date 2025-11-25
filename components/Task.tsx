import { type Task } from '@/lib/supabase/models';
import { Card, CardContent } from './ui/card';
import { Calendar, MoreHorizontalIcon, UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { priorities } from '@/lib/data';
import { useState } from 'react';
import { useSingleBoard } from '@/lib/hooks/useBoards';
import { useParams } from 'next/navigation';

interface props {
  task: Task;
}

export default function Task({ task }: props) {
  const { id } = useParams<{ id: string }>();
  const { updateTask } = useSingleBoard(id);

  const [isEditingTask, setIsEditingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState(task.title);
  const [newTaskDescription, setNewTaskDescription] = useState(
    task.description || ''
  );
  const [newTaskAssignee, setNewTaskAssignee] = useState(task.assignee || '');
  const [newTaskDueDate, setNewTaskDueDate] = useState(task.due_date || null);
  const [newTaskPriority, setNewTaskPriority] = useState(
    task.priority || 'medium'
  );

  const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTaskTitle.trim()) return;

    try {
      await updateTask(task.id, {
        title: newTaskTitle,
        description: newTaskDescription,
        assignee: newTaskAssignee,
        priority: (newTaskPriority as 'low' | 'medium' | 'high') || 'medium',
        due_date: newTaskDueDate?.trim() || null,
      });

      setIsEditingTask(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* Edit Task */}
      <Dialog open={isEditingTask} onOpenChange={setIsEditingTask}>
        <DialogContent className='w-[95vw] max-w-[425px] mx-auto'>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <p className='text-sm text-gray-600'>
              Edit the current information on the task
            </p>
          </DialogHeader>
          <form action='' onSubmit={handleUpdateTask} className='space-y-4'>
            <div className='space-y-2'>
              <Label>Title *</Label>
              <Input
                id='title'
                name='title'
                placeholder='Enter task title'
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label>Description</Label>
              <Textarea
                id='description'
                name='description'
                placeholder='Enter task description'
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className='space-y-2'>
              <Label>Assignee</Label>
              <Input
                id='assignee'
                name='assignee'
                placeholder='Who should be assigned to this task?'
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label>Priority</Label>
              <Select
                name='priority'
                value={newTaskPriority}
                onValueChange={(e: 'low' | 'medium' | 'high') =>
                  setNewTaskPriority(e)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent defaultValue={task.priority || 'medium'}>
                  {priorities.map((priority, key) => (
                    <SelectItem key={key} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label>Due Date</Label>
              <Input
                type='date'
                id='dueDate'
                name='dueDate'
                value={newTaskDueDate || ''}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
              />
            </div>
            <div className='flex justify-end pt-4 space-x-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsEditingTask(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>Update Task</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Task Card */}
      <Card className='hover:cursor-pointer hover:shadow-md transition-shadow'>
        <CardContent className='p-3 sm:p-4'>
          <div className='space-y-2 sm:space-y-3'>
            {/* Task Header */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${getPriorityColor(
                    task.priority
                  )}`}
                />
                <h4 className='font-medium text-gray-900 text-md leading-tight flex-1 min-w-0 pr-2'>
                  {task.title}
                </h4>
              </div>

              <Button
                variant='ghost'
                size='sm'
                className='shrink-0'
                onClick={() => setIsEditingTask(true)}
              >
                <MoreHorizontalIcon />
              </Button>
            </div>
            <p className='text-xs text-gray-600 px-4 line-clamp-2'>
              {task.description || 'No Description'}
            </p>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-1 sm:space-x-2 min-w-0'>
                {task.assignee && (
                  <div className='flex items-center space-x-1 text-xs text-gray-500'>
                    <UserIcon className='h-3 w-3' />
                    <span className='truncate'>{task.assignee}</span>
                  </div>
                )}
                {task.due_date && (
                  <div className='flex items-center space-x-1 text-xs text-gray-500'>
                    <Calendar className='h-3 w-3' />
                    <span className='truncate'>{task.due_date}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
