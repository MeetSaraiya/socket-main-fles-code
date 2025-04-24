// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// import "./App.css";

// const socket = io("http://localhost:5000");

// function App() {
//   const [userList, setUserList] = useState([]);
//   const [msgList, setMsgList] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [userName, setUsername] = useState(null);

//   useEffect(() => {
//     //  let name = ""
//     let name = prompt("Enter Your Name");
//     if (!name) {
//       name = "Guest"; // Default name if input is empty
//     }
//     setUsername(name);
//     if (name?.length > 0) {
//       socket.emit("join", name);
//       socket.on("userList", (users) => {
//         setUserList(users); // Update the userList state
//       });
//     }
//   }, []);

//   useEffect(() => {
//     socket.on("userList", (users) => {
//       setUserList(users); // Update the userList state
//     });
//     socket.on("messageList", (msgs) => {
//       setMsgList([...msgs]);
//     });
//     socket.on("errorOccurred", (val) => console.error(val));
//   }, [socket]);

//   function handleMsgSend(event) {
//     event.preventDefault();
//     socket.emit("newMessage", messages);
//     // setMessages("")
//   }

//   return (
//     <>
//       <div className="flex flex-col p-4 m-2 border-1 rounded-3xl shadow-amber-600 shadow-lg">
//         <h4 className="font-semibold mt-3 border-2  border-black mx-auto m-3 p-3 rounded-2xl">
//           Current Users
//         </h4>
//         <ul className="border-2 divider mt-1 font-extralight mx-auto rounded-2xl p-3">
//           {userList &&
//             userList?.length > 0 &&
//             userList.map((user, index) => (
//               <li key={index}>
//                 {" "}
//                 <span className="text-sm">Name</span> :{" "}
//                 <strong className="text-md font-extralight">{user}</strong>
//               </li>
//             ))}
//         </ul>
//         <hr className="mt-5" />
//         <h4 className="font-semibold mt-6 border-2 border-black mx-auto m-3 p-3 rounded-2xl">
//           Messages
//         </h4>
//         <ul className="border-2 divider p-3  mx-auto">
//           {msgList?.length > 0 &&
//             msgList.map((msg, index) => (
//               <div key={index} className="w-[500px] overflow-x-scroll">
//                 <p>
//                   <strong>{msg.sender || msg.userName}</strong>
//                 </p>{" "}
                
//                 <p>{msg.message}</p> 
//                 <hr />
//               </div>
//             ))}
//         </ul>
//         <hr className="m-4" />
//         <form onSubmit={handleMsgSend} className="">
//           <input
//             type="text"
//             name="msg"
//             id="msg"
//             value={messages}
//             onChange={(e) => setMessages(e.target.value)}
//             placeholder="enter your message"
//             className="border-2 m-3 p-3 rounded-xl "
//           />
//           <button
//             type="submit"
//             className="cursor-pointer hover:scale-125 rounded-xl p-4 border-2"
//           >
//             Send
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }

// export default App;


import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [userList, setUserList] = useState([]);
  const [msgList, setMsgList] = useState([]);
  const [message, setMessage] = useState("");
  const [userName, setUsername] = useState(null);

  useEffect(() => {
    let name = prompt("Enter Your Name") || "Guest";
    setUsername(name);
    socket.emit("join", name);

    // Listeners
    socket.on("userList", (users) => setUserList(users));
    socket.on("messageList", (msgs) => setMsgList([...msgs]));
    socket.on("errorOccurred", (err) => console.error(err));

    return () => {
      socket.off("userList");
      socket.off("messageList");
      socket.off("errorOccurred");
    };
  }, []);

  function handleMsgSend(event) {
    event.preventDefault();
    if (!message.trim()) return; // Prevent sending empty messages
    socket.emit("newMessage", { sender: userName, message });
    setMessage(""); // Reset message field
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Chat Application</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User List */}
          <div className="col-span-1">
            <h2 className="text-lg font-semibold mb-2">Current Users</h2>
            <ul className="bg-gray-50 border rounded-lg p-4 max-h-64 overflow-y-auto">
              {userList.length > 0 ? (
                userList.map((user, index) => (
                  <li key={index} className="p-2 border-b last:border-none">
                    <span className="font-medium text-gray-800">{user}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No users online</p>
              )}
            </ul>
          </div>

          {/* Messages */}
          <div className="col-span-2">
            <h2 className="text-lg font-semibold mb-2">Messages</h2>
            <div className="bg-gray-50 border rounded-lg p-4 max-h-64 overflow-y-auto">
              {msgList.length > 0 ? (
                msgList.map((msg, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold text-blue-600">{msg.sender || "Unknown"}</p>
                    <p className="text-gray-800">{msg.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No messages yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={handleMsgSend} className="mt-6 flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
