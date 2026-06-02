import { supabase } from './supabase';

export interface ChatRow {
  id: number;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface MessageRow {
  id: number;
  chat_id: number;
  owner_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export const getCurrentUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user?.id;
};

export const fetchChats = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ChatRow[];
};

export const createChat = async () => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('No authenticated user');

  const { data, error } = await supabase
    .from('chats')
    .insert({
      name: `New Chat ${new Date().toLocaleString()}`,
      owner_id: userId,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as ChatRow;
};

export const removeChat = async (chatId: number) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('No authenticated user');

  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId)
    .eq('owner_id', userId);

  if (error) throw error;
};

export const fetchMessages = async (chatId: number) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as MessageRow[];
};

export const insertMessage = async (message: Omit<MessageRow, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select('*')
    .single();

  if (error) throw error;
  return data as MessageRow;
};
