const EntriesService = {
    //relevant
    getEntries(db) {
        return db
            .from('entries')
            .select(
                'entries.id',
                'entries.user_id',
                'entries.title',
                'entries.bullet_1',
                'entries.bullet_2',
                'entries.bullet_3',
                'entries.mood',
                'entries.is_public'
            )
    },
    getEntryById(db, entries_id) {
        return db
            .from('entries')
            .select(
                'entries.id',
                'entries.user_id',
                'entries.title',
                'entries.bullet_1',
                'entries.bullet_2',
                'entries.bullet_3',
                'entries.mood',
                'entries.is_public'
            )
            .where('entries.id', entries_id)
            .first()
    },
    getEntryByUserId(db, user_id) {
        return db
          .from('entries')
          .select('*')
          .where('entries.user_id', user_id)
      },
    //relevant
    insertEntry(db, newEntry) {
        return db
            .insert(newEntry)
            .into('entries')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    //relevant
    updateEntry(db, entries_id, newEntry) {
        return db('entries')
            .where({
                id: entries_id
            })
            .update(newEntry, returning = true)
            .returning('*')
    },
    //relevant
    deleteEntry(db, entries_id) {
        return db('entries')
            .where({
                'id': entries_id
            })
            .delete()
    }
}

module.exports = EntriesService