import { relations } from 'drizzle-orm';
import { mysqlTable, serial, varchar, datetime, bigint, primaryKey } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
    id: serial('id').primaryKey()
})

export const usersRelations = relations(users, ({ one, many }) => ({
    user_session: one(user_session),
    user_accounts: many(user_accounts)
}))


export const user_session = mysqlTable('user_session', {
    id: varchar('id', { length: 255 }).primaryKey(),
    expiresAt: datetime('expires_at').notNull(),
    userId: bigint('user_id', { mode: 'number' }).notNull()
})

export const user_sessionRelations = relations(user_session, ({ one }) => ({
    user: one(users, {
        fields: [user_session.userId],
        references: [users.id]
    })
}))


export const user_accounts = mysqlTable('user_accounts', {
    providerId: varchar('provider_id', { length: 255 }).notNull(),
    providerUserId: varchar('provider_user_id', { length: 255 }).notNull(),
    userId: bigint('user_id', { mode: 'number' }).notNull()
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.providerId, table.providerUserId] })
    }
})

export const user_accountsRelations = relations(user_accounts, ({ one }) => ({
    user: one(users, {
        fields: [user_accounts.userId],
        references: [users.id]
    })
}))