"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../firebase'; // Adjust path as needed - note the extra level
import { Pin } from '../../types/pinData'; // Adjust path as needed - note the extra level
import React from 'react';
import { useParams } from 'next/navigation';

export default function SharePinClient() {
  const [pin, setPin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const db = getFirestore(app);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const params = useParams();

  const pinId = params.pinId as string;

  useEffect(() => {
    console.log("Pin ID:", pinId);
    console.log("User ID:", userId);
    if (pinId && userId) {
      const fetchPin = async () => {
        try {
          const pinRef = doc(db, `users/${userId}/pins/${pinId}`);
          const pinSnap = await getDoc(pinRef);

          if (pinSnap.exists()) {
            setPin(pinSnap.data() as Pin);
          } else {
            setError("Pin not found");
          }
        } catch (err) {
          console.error("Error fetching pin:", err);
          setError("Failed to load pin");
        } finally {
          setLoading(false);
        }
        setLoading(false);

      };

      fetchPin();
    }
  }, [pinId, userId, db]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!pin) return <p>Pin not found</p>;

  return (
    <div className="pin-share-container">
      <h1>{pin.title}</h1>
      <p>{pin.description}</p>
    </div>
  );
}