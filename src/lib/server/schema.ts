import { relations } from 'drizzle-orm';
import { mysqlTable, serial, varchar, datetime, bigint, primaryKey } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
    id: serial('id').primaryKey(),
    username: varchar("username", { length: 255 }).notNull()
})

export const usersRelations = relations(users, ({ one, many }) => ({
    user_session: one(userSession),
    user_accounts: many(userAccounts)
}))


export const userSession = mysqlTable('user_session', {
    id: varchar('id', { length: 255 }).primaryKey(),
    expiresAt: datetime('expires_at').notNull(),
    userId: bigint('user_id', { mode: 'number' }).notNull()
})

export const userSessionRelations = relations(userSession, ({ one }) => ({
    user: one(users, {
        fields: [userSession.userId],
        references: [users.id]
    })
}))


export const userAccounts = mysqlTable('user_accounts', {
    providerId: varchar('provider_id', { length: 255 }).notNull(),
    providerUserId: varchar('provider_user_id', { length: 255 }).notNull(),
    userId: bigint('user_id', { mode: 'number' }).notNull()
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.providerId, table.providerUserId] })
    }
})

export const userAccountsRelations = relations(userAccounts, ({ one }) => ({
    user: one(users, {
        fields: [userAccounts.userId],
        references: [users.id]
    })
}))