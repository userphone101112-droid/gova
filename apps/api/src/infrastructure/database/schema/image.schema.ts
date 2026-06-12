/**
 * Image Database Schema
 * 
 * Drizzle ORM schema for the images table.
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { users } from './index';

export const images = sqliteTable('images', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  provider: text('provider').notNull(), // 'cloudflare' | 'google_drive'
  providerFileId: text('provider_file_id').notNull(),
  entityType: text('entity_type').notNull(), // 'user' | 'product' | 'post' | 'other'
  entityId: text('entity_id').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  width: integer('width'),
  height: integer('height'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const imageRelations = relations(images, ({ one }) => ({
  user: one(users, {
    fields: [images.entityId],
    references: [users.id],
  }),
}));
