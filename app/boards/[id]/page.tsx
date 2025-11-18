'use client';

import Navbar from '@/components/navbar';
import { useSingleBoard } from '@/lib/hooks/useBoards';
import { useParams } from 'next/navigation';

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const { board } = useSingleBoard(id);

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar boardTitle={board?.title} />
    </div>
  );
}
