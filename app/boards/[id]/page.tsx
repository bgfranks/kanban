'use client';

import Column from '@/components/Column';
import Navbar from '@/components/navbar';
import Task from '@/components/Task';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { colors, priorities } from '@/lib/data';
import { useSingleBoard } from '@/lib/hooks/useBoards';
import { PlusIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const { board, updateBoard, columns, createRealTask } = useSingleBoard(id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newColor, setNewColor] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleUpdateBoard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !board) return;

    try {
      await updateBoard(board.id, {
        title: newTitle.trim(),
        color: newColor || board.color,
      });
      setIsEditingTitle(false);
    } catch (err) {
      console.log(err);
    }
  };

  const createTask = async (taskData: {
    title: string;
    description?: string;
    assignee?: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    const targetColumn = columns[0];

    if (!targetColumn) throw new Error('No column available to add task');

    console.log(taskData.description);
    console.log(taskData.assignee);
    console.log(taskData.dueDate);
    console.log(taskData.priority);

    await createRealTask(targetColumn.id, taskData);
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const taskData = {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || undefined,
      assignee: (formData.get('assignee') as string) || undefined,
      dueDate: (formData.get('dueDate') as string) || undefined,
      priority:
        (formData.get('priority') as 'low' | 'medium' | 'high') || 'medium',
    };

    if (taskData.title.trim()) {
      await createTask(taskData);

      // this is due to using a dialog trigger for the new task form
      // since we cannot close with setting state, this graps the data-state:open
      const trigger = document.querySelector(
        '[data-state="open"]'
      ) as HTMLElement;
      if (trigger) trigger.click();
    }
  };

  return (
    <div className={`min-h-screen ${board?.color} lg:bg-gray-50`}>
      <Navbar
        boardTitle={board?.title}
        onEditBoard={() => {
          setNewTitle(board?.title ?? '');
          setNewColor(board?.color ?? '');
          setIsEditingTitle(true);
        }}
        onFilterClick={() => {
          setIsFilterOpen(true);
        }}
        filterCount={2}
      />
      {/* Edit Board */}
      <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
        <DialogContent className='w-[95vw] max-w-[425px] mx-auto'>
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <form className='space-y-4' onSubmit={handleUpdateBoard}>
            <div className='space-y-2'>
              <Label htmlFor='boardTitle'>Board Title</Label>
              <Input
                id='boardTItle'
                placeholder='Enter board title'
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='boardColor'>Board Color</Label>
              <div className='grid grid-cols-4 sm:grid-cols-6 gap-2'>
                {colors.map((color, key) => (
                  <button
                    key={key}
                    type='button'
                    className={`w-8 h-8 rounded-full ${color} ${
                      color === newColor
                        ? 'ring-2 ring-offset-2 ring-gray-900'
                        : ''
                    }`}
                    onClick={() => setNewColor(color)}
                  />
                ))}
              </div>
            </div>
            <div className='flex justify-end space-x-2 mt-8 gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsEditingTitle(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Filter */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className='w-[95vw] max-w-[425px] mx-auto'>
          <DialogHeader>
            <DialogTitle>Filter Tasks</DialogTitle>
            <p className='text-sm text-gray-600'>
              Filter tasks by priority, assignee, or due date
            </p>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>Priority</Label>
              <div className='flex flex-wrap gap-2'>
                {priorities.map((priority, key) => (
                  <Button variant={`outline`} key={key} size='sm'>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Assignee</Label>
            </div>
            <div className='space-y-2'>
              <Label>Due Date</Label>
              <Input type='date' />
            </div>
            <div className='flex justify-end gap-2 pt-4'>
              <Button type='button' variant='outline' className=''>
                Clear Filters
              </Button>
              <Button type='button' onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Board Content */}
      <main
        className={`container mx-auto px-2 my-2 rounded-lg sm:px-4 py-4 sm:py-6 ${board?.color}`}
      >
        {/* stats */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0'>
          <div className='flex flex-wrap items-center gap-4 sm:gap-6'>
            <div className='text-sm text-gray-600 bg-gray-50 rounded-sm px-2 '>
              <span className='font-medium'>Total Tasks: </span>
              {columns.reduce((sum, col) => sum + col.tasks.length, 0)}
            </div>
          </div>
          {/* Add Task */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className='w-full sm:w-auto'>
                <PlusIcon />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className='w-[95vw] max-w-[425px] mx-auto'>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <p className='text-sm text-gray-600'>
                  Add a new task to the board
                </p>
              </DialogHeader>
              <form action='' onSubmit={handleCreateTask} className='space-y-4'>
                <div className='space-y-2'>
                  <Label>Title *</Label>
                  <Input
                    id='title'
                    name='title'
                    placeholder='Enter task title'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Description</Label>
                  <Textarea
                    id='description'
                    name='description'
                    placeholder='Enter task description'
                    rows={3}
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Assignee</Label>
                  <Input
                    id='assignee'
                    name='assignee'
                    placeholder='Who should be assigned to this task?'
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Priority</Label>
                  <Select name='priority' defaultValue='medium'>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Input type='date' id='dueDate' name='dueDate' />
                </div>
                <div className='flex justify-end pt-4 space-x-2'>
                  <Button type='submit'>Create Task</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Board Columns */}
        <div className='flex flex-col pt-2 rounded-lg lg:h-300 lg:flex-row lg:space-x-6 lg:overflow-x-auto lg:overflow-y-auto lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2 lg:[&::-webkit-scrollbar]:w-2 lg:[&::-webkit-scrollbar-track]:bg-gray-100 lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full space-y-4 lg:space-y-0 px-4'>
          {columns.map((column, key) => (
            <Column
              key={key}
              column={column}
              onCreateTask={createTask}
              onEditColumn={() => {}}
            >
              <div className='space-y-3'>
                {column.tasks.map((task, key) => (
                  <Task key={key} task={task} />
                ))}
              </div>
            </Column>
          ))}
        </div>
      </main>
    </div>
  );
}
