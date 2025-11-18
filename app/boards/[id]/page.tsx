'use client';

import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { colors } from '@/lib/colors';
import { useSingleBoard } from '@/lib/hooks/useBoards';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const { board, updateBoard } = useSingleBoard(id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newColor, setNewColor] = useState('');

  const handleUpdateBoard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !board) return;

    try {
      await updateBoard(board.id, {
        title: newTitle.trim(),
        color: newColor || board.color,
      });
      setIsEditingTitle(false);
    } catch {}
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar
        boardTitle={board?.title}
        onEditBoard={() => {
          setNewTitle(board?.title ?? '');
          setNewColor(board?.color ?? '');
          setIsEditingTitle(true);
        }}
      />
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
                {colors.map((color) => (
                  <button
                    key={color}
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
    </div>
  );
}
