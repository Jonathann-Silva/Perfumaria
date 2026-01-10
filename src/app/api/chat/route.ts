import { productChat } from '@/app/actions';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];
  return productChat(lastMessage.content);
}
