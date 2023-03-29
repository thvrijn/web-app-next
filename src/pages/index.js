import {useEffect, useState} from 'react'
import {Firebase} from 'src/clients/Firebase'


export default function Chat() {
    const table = 'messages'
    const [code, setCode] = useState('')
    const [user, setUser] = useState({
        username: '',
        authenticated: false
    })

    const firebase = new Firebase()

    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    useEffect(() => {
        if (code) {
            firebase.index(`${table}/${code}`, setMessages)
        }

        return () => firebase.off(table)
    }, [code])

    function toTime(time) {
        return new Date(time).toLocaleString()
    }

    if (!user.authenticated) {
        return <div>
            <label>Name</label>
            <input value={user.username} onChange={event => setUser({...user, username: event.target.value})}/>

            <label>Code</label>
            <input value={code} onChange={event => setCode(event.target.value)}/>

            <button
                onClick={() => setUser({...user, authenticated: true})}
                disabled={!user.username || !code}
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
                firebase.store(`${table}/${code}`, user, {message})
            }
        }}>
            send
        </button>
    </div>
}