"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../firebase";
import { Pin } from "../../types/pinData";
import { Category } from "../../types/categoryData";
import { Rating } from "react-simple-star-rating";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import styles from "../../Sass/sharePin.module.scss";
import IconBar from "../../components/ImageComponents/IconBar.tsx";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import styles2 from "../../Sass/NoImagesDisplay.module.scss";

import { Libraries, useLoadScript } from "@react-google-maps/api";
import { fetchUserData } from "../../firebaseFunctions/friends.ts";
import Head from "next/head";
import { toast } from "react-toastify";
export default function SharePinClient() {
  const [pin, setPin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const db = getFirestore(app);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const params = useParams();
  const pinId = params.pinId as string;
  const [images, setimages] = useState<string[]>([]);
  const [userDetails, setuserDetails] = useState<{
    displayName: string;
    photoURL: string;
  }>({ displayName: "", photoURL: "" });
  // Carousel responsive configuration
  const responsiveConfig = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    if (pinId && userId) {
      const fetchPin = async () => {
        try {
          const userData = await fetchUserData(userId);
          const pinRef = doc(db, `users/${userId}/pins/${pinId}`);
          const pinSnap = await getDoc(pinRef);
          setuserDetails(userData);
          if (pinSnap.exists()) {
            const pinData = pinSnap.data() as Pin;
            setPin(pinData);
            setimages(pinData.imageUrls || []);

            // Fetch category if we have categoryId
            if (pinData.category) {
              try {
                const categoryRef = doc(db, `categories/${pinData.category}`);
                const categorySnap = await getDoc(categoryRef);
                if (categorySnap.exists()) {
                  setCategory(categorySnap.data() as Category);
                }
              } catch (categoryErr) {
                console.error("Error fetching category:", categoryErr);
              }
            }
          } else {
            setError("Pin not found");
          }
        } catch (err) {
          console.error("Error fetching pin:", err);
          setError("Failed to load pin");
        } finally {
          setLoading(false);
          toast.info("Link has been copied to clipboard!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      };
      fetchPin();
    }
  }, [pinId, userId, db]);

  // Parse opening hours similar to ExpandedInfoModal
  const parseOpeningHours = (text: any): string[] => {
    if (typeof text !== "string") {
      return [];
    }

    const regex =
      /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\s*/g;
    const parts = text.split(regex).filter((part) => part.trim() !== "");
    const openingHoursArray: string[] = [];

    for (let i = 0; i < parts.length; i += 2) {
      const day = parts[i].trim();
      const hours = parts[i + 1]
        ? parts[i + 1].trim().replace(/,\s?/g, " ")
        : "Closed";

      const formattedHours = hours.replace(/–/g, "-");
      openingHoursArray.push(`${day} ${formattedHours}`);
    }

    return openingHoursArray;
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!pin) return <div className={styles.error}>Pin not found</div>;

  const openingHours = parseOpeningHours(pin.openingHours);

  return (
    <>
      <Head>
        <title>Travel Trail - {pin.displayName}</title>
        <meta
          name="description"
          content={`${userDetails.displayName} wants to share a pin with you!`}
        />
      </Head>
      <main className={styles.mainDiv}>
        <div className={styles.userDetails}>
          <img
            src={userDetails.photoURL}
            alt="profile picture"
            className={styles.profilePicture}
          />
          <h1>{userDetails.displayName} wants to share a pin with you!</h1>
          <p>
            If you want to use Travel Trail as well, please visit{" "}
            <a href="https://www.traveltrailalextran.com/" target="_blank">
              Travel Trail
            </a>{" "}
            to start using it!
          </p>
        </div>
        <div className={styles.main}>
          <div className={styles.header}>
            <h1>{pin.title}</h1>
            <p>Shared Pin</p>
          </div>

          <div className={styles.content}>
            <div className={styles.info}>
              <div className={styles.addressInfo}>
                <p className={styles.address}>{pin.address}</p>
                {pin.website && (
                  <a
                    href={pin.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Check Link
                  </a>
                )}
              </div>

              <div className={styles.rating}>
                {pin.rating != 0 && pin.rating && (
                  <Rating initialValue={pin.rating} readonly />
                )}
                <p className={styles.opening_hours}>
                  {Array.isArray(openingHours)
                    ? openingHours.map((item, index) => (
                        <span key={index}>
                          {item}
                          <br />
                        </span>
                      ))
                    : "No opening hours available"}
                </p>
              </div>
            </div>

            <div className={styles.expandedModalTags}>
              <p
                style={{
                  backgroundColor: category?.categoryColor || "#007bff",
                  border: `2px solid ${category?.categoryColor || "#007bff"}`,
                }}
              >
                {pin.category}
              </p>
              <p>{pin.visited ? "Visited" : "Unvisited"}</p>
            </div>

            {pin.description && (
              <p className={styles.description}>{pin.description}</p>
            )}
          </div>

          <div className={styles.footer}>
            {images && images.length > 0 ? (
              <Carousel
                responsive={responsiveConfig}
                className={styles.carouselcontainer}
              >
                {images.map((src, index) => (
                  <img key={index} src={src} alt="" />
                ))}
              </Carousel>
            ) : (
              <NoImagesDisplay pin={pin} setImages={setimages} />
            )}

            {category && (
              <div className={styles.iconBar}>
                <IconBar
                  enableImage={false}
                  pin={pin}
                  setchild={null}
                  color={category.categoryColor}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

interface NoImagesDisplayProps {
  pin: { placeId: string };
  setImages: (images: string[]) => void;
}

function NoImagesDisplay({ pin, setImages }: NoImagesDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define the libraries we need
  const libraries: Libraries = ["places"];

  // Load the Google Maps script with places library
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY || "",
    libraries,
  });

  const fetchGooglePlaceImages = async () => {
    if (!pin?.placeId) {
      setError("No placeId found for the selected place.");
      return;
    }

    if (!isLoaded) {
      setError("Google Maps Places library is not loaded yet.");
      return;
    }

    if (loadError) {
      setError(`Error loading Google Maps: ${loadError.message}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const placesService = new google.maps.places.PlacesService(
        document.createElement("div")
      );

      placesService.getDetails({ placeId: pin.placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const photos = place.photos
            ? place.photos.map((photo) =>
                photo.getUrl({ maxWidth: 600, maxHeight: 600 })
              )
            : [];

          setImages(photos);
          setIsLoading(false);
        } else {
          setError(`Failed to fetch place details: ${status}`);
          setIsLoading(false);
        }
      });
    } catch (err) {
      setError(
        `Error generating images: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setIsLoading(false);
    }
  };

  return (
    <div className={styles2.noImagesDisplay}>
      <p>No images to display</p>
      {error && <p className={styles2.error}>{error}</p>}
      <button
        onClick={fetchGooglePlaceImages}
        // No disabled property as requested
      >
        {isLoading ? "Loading..." : "Generate Temporary Images?"}
      </button>
    </div>
  );
}
