import * as App from 'firebase/app'
import * as Database from 'firebase/database'

export class Firebase {
    constructor() {
        this.app = App.initializeApp({
            apiKey: "AIzaSyB9UUNwWdeVKTV6bV9wbzgEZRjSnyD5jNs",
            authDomain: "chat-app-b9228.firebaseapp.com",
            databaseURL: "https://chat-app-b9228-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "chat-app-b9228",
            storageBucket: "chat-app-b9228.appspot.com",
            messagingSenderId: "587027185645",
            appId: "1:587027185645:web:55877f9d967ba93806f1e4",
            measurementId: "G-08R2N919TC"
        })
        this.database = Database.getDatabase(this.app)
    }

    index(table, setRecords) {
        const tableRef = Database.ref(this.database, table)

        return Database.onValue(
            Database.query(
                tableRef,
                Database.limitToLast(10),
                Database.orderByChild('time'),
                Database.startAfter(new Date().getTime() - (4 * 3600 * 1000))
            ), (snapshot) => {
                const messages = snapshot.val()
                let data = []

                if (messages) {
                    Object.keys(messages).forEach(key => {
                        data.push(messages[key])
                    })
                }

                if (data.length) {
                    setRecords(data)
                }
            })
    }


    store(table, authenticated, data) {
        const key = Database.push(Database.ref(this.database, table)).key

        data = {
            key,
            // user_id: authenticated.id,
            username: authenticated.username,
            time: Date.now(),
            ...data,
        }

        Database.set(Database.ref(this.database, table + '/' + key), data).then(() => {
        })
    }

    remove(table) {
        Database.remove(Database.ref(this.database, table)).then(() => {
        })
    }

    off(table) {
        Database.off(Database.ref(this.database, table))
    }
}