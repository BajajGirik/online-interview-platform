import React, { useState, useContext } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SocketContext } from "../../context/socketContext";

type Props = {
  children: React.ReactNode;
};

const Sidebar = ({ children }: Props) => {
  const { me, callAccepted, name, setNameUtility, callEnded, leaveCall, callUser } =
    useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  console.log(me);
  return (
    <>
      <form noValidate autoComplete="off">
        <p>Account Info</p>
        <textarea aria-label="Name" value={name} onChange={e => setNameUtility(e.target.value)} />
        <CopyToClipboard text={me}>
          <button type="button">Copy Your ID</button>
        </CopyToClipboard>
        <p>Make a call</p>
        <textarea
          aria-label="ID to call"
          value={idToCall}
          onChange={e => setIdToCall(e.target.value)}
        />
        {callAccepted && !callEnded ? (
          <button type="button" onClick={leaveCall}>
            Hang Up
          </button>
        ) : (
          <button type="button" onClick={() => callUser(idToCall)}>
            Call
          </button>
        )}
      </form>
      {children}
    </>
  );
};

export default Sidebar;
