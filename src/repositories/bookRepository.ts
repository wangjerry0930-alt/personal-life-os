import type { Book } from '../domain/books';
import { storageAdapter } from './storageAdapter';
const KEY='personal-life-os-books';
export const loadBooks=():Book[]=>storageAdapter.get<Book[]>(KEY,[]);
export const saveBooks=(books:Book[])=>storageAdapter.set(KEY,books);
