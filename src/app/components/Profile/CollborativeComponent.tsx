import React, { useEffect, useState } from "react";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { toast } from "react-toastify";
import styles from "../../Sass/CollaborativeComponent.module.scss";
import {
  acceptCollaborativeRequest,
  declineCollaborativeRequest
} from "../../firebaseFunctions/Collaborative";
import { useAuth } from "../../context/authContext";
import { retrieveListName } from "../../firebaseFunctions/Lists";
import { app } from "../../firebase";
import { acceptedCollaborativeRequestToast, standardErrorToast, declinedCollaborativeRequestToast } from "../../toastNotifications";

interface CollaborativeRequest {
  id: string;
  listID: string;
  listOwner: string;
  fromName?: string;
  toName?: string;
  to?: string;
  from?: string;
  status: string;
  listName?: string;
}

export default function CollaborativeComponent() {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<CollaborativeRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<CollaborativeRequest[]>([]);
  const db = getFirestore(app);

  useEffect(() => {
    // Reference to the user's collaborative requests collection
    const incomingRequestsRef = collection(db, `users/${user.uid}/collaborativeRequests`);

    // Set up real-time listener for collaborative requests
    const unsubscribe = onSnapshot(incomingRequestsRef, async (snapshot) => {
      const enrichedRequests: CollaborativeRequest[] = [];

      await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const requestData = {
            id: docSnapshot.id,
            ...docSnapshot.data()
          } as CollaborativeRequest;

          // Only process requests that are pending
          if (requestData.status === 'pending') {
            try {
              // Enrich request with list name
              const listName = await retrieveListName(requestData.listOwner, requestData.listID);
              enrichedRequests.push({ ...requestData, listName });
            } catch (error) {
              console.error("Error enriching request:", error);
            }
          }
        })
      );

      // Separate incoming and outgoing requests
      const outgoing = enrichedRequests.filter(request => request.toName);
      const incoming = enrichedRequests.filter(request => request.fromName);

      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    });

    // Clean up listener when component unmounts
    return () => unsubscribe();
  }, [user.uid]);

  const handleAcceptRequest = async (request: CollaborativeRequest) => {
    try {
      await acceptCollaborativeRequest(user.uid, request.id, request.from || "");
      // Show success toast notification
      acceptedCollaborativeRequestToast(request.listName || "");
    } catch (error) {
      console.error(error);
      standardErrorToast("Failed to accept collaboration request");
    }
  };

  const handleDeclineRequest = async (request: CollaborativeRequest) => {
    try {
      await declineCollaborativeRequest(user.uid, request.id);

      declinedCollaborativeRequestToast(request.listName || "");
    } catch (error) {
      standardErrorToast("Failed to decline collaboration request");
    }
  };

  return (
    <main className={styles.collaborativeListMain}>
      <h2>Collaborative List Requests</h2>

      <div>
        <h3>Incoming Requests</h3>
        {incomingRequests.length === 0 ? (
          <p className={styles.noRequests}>No incoming requests</p>
        ) : (
          <ul>
            {incomingRequests.map((request) => (
              <li key={request.id}>
                <p>{request.fromName} has requested to collaborate on list: <span>{request.listName}</span></p>
                <div className={styles.buttonGroup}>
                  <button onClick={() => handleAcceptRequest(request)}>Accept</button>
                  <button onClick={() => handleDeclineRequest(request)}>Decline</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3>Outgoing Requests</h3>
        {outgoingRequests.length === 0 ? (
          <p className={styles.noRequests}>No outgoing requests</p>
        ) : (
          <ul>
            {outgoingRequests.map((request) => (
              <li key={request.id}>
                <p>You requested to collaborate with {request.toName} on list: <span>{request.listName}</span></p>
                <div className={styles.buttonGroup}>
                  <button onClick={() => handleDeclineRequest(request)}>Cancel Request</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}