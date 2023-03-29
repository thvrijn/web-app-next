import {useEffect, useState} from 'react'
import {Firebase} from 'src/clients/Firebase'


export default function Chat() {
    const table = 'messages'
    const [user, setUser] = useState({
        username: '',
        authenticated: false
    })

    const firebase = new Firebase()

    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    useEffect(() => {
        firebase.index(table, setMessages)

        return () => firebase.off(table)
    }, [])

    function toTime(time) {
        return new Date(time).toLocaleString()
    }

    if (!user.authenticated) {
        return <div>
            <input onChange={event => setUser({...user, username: event.target.value})}/>

            <button
                onClick={() => setUser({...user, authenticated: true})}
                disabled={!user.username}
            >
                Log in
            </button>
        </div>
    }

    return <div>
        {
            messages.map((message, index) => <div>
                    <p>{message.username}: {message.message} ({toTime(message.time)})</p>
                </div>
            )
        }

        <textarea
            placeholder={'message ...'}
            value={message}
            onChange={event => setMessage(event.target.value)}
        />

        <button onClick={() => {
            if (message.length) {
                firebase.store(table, user, {message})
            }
        }}>
            send
        </button>
    </div>
}