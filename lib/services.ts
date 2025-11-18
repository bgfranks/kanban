import { Board, Column } from './supabase/models';
import { SupabaseClient } from '@supabase/supabase-js';

// handles the crud for boards in supabase
export const boardService = {
  async getBoards(supabase: SupabaseClient, userId: string): Promise<Board[]> {
    const { data, error } = await supabase
      .from('Boards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  },

  async getBoard(supabase: SupabaseClient, boardId: string): Promise<Board> {
    const { data, error } = await supabase
      .from('Boards')
      .select('*')
      .eq('id', boardId)
      .single();

    if (error) throw error;

    return data;
  },

  async createBoard(
    supabase: SupabaseClient,
    board: Omit<Board, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Board> {
    const { data, error } = await supabase
      .from('Boards')
      .insert(board)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async updateBoard(
    supabase: SupabaseClient,
    boardId: string,
    updates: Partial<Board>
  ): Promise<Board> {
    const { data, error } = await supabase
      .from('Boards')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', boardId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};

// handles the crud for columns in supabase
export const columnService = {
  async getColumns(
    supabase: SupabaseClient,
    boardId: string
  ): Promise<Column[]> {
    const { data, error } = await supabase
      .from('Status Columns')
      .select('*')
      .eq('board_id', boardId)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return data || [];
  },

  async createColumnn(
    supabase: SupabaseClient,
    column: Omit<Column, 'id' | 'created_at'>
  ): Promise<Column> {
    const { data, error } = await supabase
      .from('Status Columns')
      .insert(column)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};

// handles multi service crud
export const boardDataService = {
  // creates a board with the 4 generic columns
  async createBoardWithDefaultColumns(
    supabase: SupabaseClient,
    boardData: {
      title: string;
      description?: string;
      color?: string;
      userId: string;
    }
  ) {
    const board = await boardService.createBoard(supabase, {
      title: boardData.title,
      description: boardData.description || null,
      color: boardData.color || 'bg-blue-500',
      user_id: boardData.userId,
    });

    const defaultColumns = [
      { title: 'To Do', sort_order: 0 },
      { title: 'In Progress', sort_order: 1 },
      { title: 'In Review', sort_order: 2 },
      { title: 'Done', sort_order: 3 },
    ];

    await Promise.all(
      defaultColumns.map((column) =>
        columnService.createColumnn(supabase, {
          ...column,
          board_id: board.id,
          user_id: board.user_id,
        })
      )
    );

    return board;
  },

  // gets the board by id and its columns
  async getBoardWithColumns(supabase: SupabaseClient, boardId: string) {
    const [board, columns] = await Promise.all([
      boardService.getBoard(supabase, boardId),
      columnService.getColumns(supabase, boardId),
    ]);

    if (!board) throw new Error('Board not found!');

    return {
      board,
      columns,
    };
  },
};
