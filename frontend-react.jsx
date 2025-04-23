import { useEffect, useState } from "react";

import "./App.css";

function App() {
    const [userList, setUserList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [userName, setUsername] = useState(null);

    useEffect(() => {
        const name = prompt("Enter Your Name");
        setUsername(name);
    }, []);

    return (
        <>
            <h4>Current Users</h4>
            <ul>
                {userList &&
                    userList?.length > 0 &&
                    userList.map((user) => <li>{user}</li>)}
            </ul>
            <h4>Messages</h4>
            <ul>
                {
                    messages?.length > 0 && messages.map((msg) => (<li>{msg}</li>))
                }
            </ul>
        </>
    );
}

export default App;