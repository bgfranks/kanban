import { type Task } from '@/lib/supabase/models';
import { Card, CardContent } from './ui/card';
import { Calendar, MoreHorizontalIcon, UserIcon } from 'lucide-react';
import { Button } from './ui/button';

interface props {
  task: Task;
  onEditTask: () => void;
}

export default function Task({ task, onEditTask }: props) {
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

  return (
    <div>
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
                onClick={onEditTask}
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
