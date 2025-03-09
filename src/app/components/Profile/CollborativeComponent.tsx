import React, { useEffect, useState } from "react";
import styles from "../../Sass/CollaborativeComponent.module.scss";
import { acceptCollaborativeRequest, declineCollaborativeRequest, retrieveCollaborativeRequests } from "../../firebaseFunctions/Collaborative";
import { useAuth } from "../../context/authContext";
import { retrieveListName } from "../../firebaseFunctions/Lists";

export default function CollaborativeComponent() {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCollaborativeRequests() {
      const requests = await retrieveCollaborativeRequests(user.uid);
      
      // Separate incoming and outgoing requests
      const incoming:  any[] = [];
      const outgoing: any[] = [];
      
      await Promise.all(
        requests.map(async (request) => {
          const listName = await retrieveListName(request.listOwner, request.listID);
          const enrichedRequest = { ...request, listName };
          
          // Check if it's an incoming request (has 'from' field) or outgoing (has 'to' field)
          if (request.from) {
            incoming.push(enrichedRequest);
          } else if (request.to) {
            outgoing.push(enrichedRequest);
          }
        })
      );
      
      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    }
    
    fetchCollaborativeRequests();
  }, [user.uid]);

  return (
    <main className={styles.collaborativeListMain}>
      <h2>Collaborative Lists</h2>

      <div>
        <h3>Incoming Requests</h3>
        <ul>
          {incomingRequests.map((request) => (
            <li key={request.id}>
              <p>{request.fromName} has requested to collaborate on list: <span>{request.listName}</span></p>
              <button onClick={() => acceptCollaborativeRequest(user.uid, request.id, request.from)}>Accept</button>
              <button onClick={() => declineCollaborativeRequest(user.uid, request.id)}>Decline</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Outgoing Requests</h3>
        <ul>
          {outgoingRequests.map((request) => (
            <li key={request.id}>
              <p>You requested to collaborate with {request.toName} on list: <span>{request.listName}</span></p>
              <button onClick={() => declineCollaborativeRequest(user.uid, request.id)}>Cancel Request</button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}