import React, { useState, useEffect } from 'react';
import styles from '../Sass/HelpComponent.module.scss';
import categories from '../assets/categories.png';
import pinsPNG from '../assets/pins.png';
import mapPNG from '../assets/map.png';
import fullscreenpng from '../assets/fullscreen.png';
import manageImagespng from '../assets/manageImages.png';
import manageListspng from '../assets/lists.png';
import exportCsvpng from '../assets/exportcsv.png';
import socialMediapng from '../assets/socialmedia.png';
import { StaticImageData } from 'next/image';

interface HelpItem {
  helpTitle: string;
  helpImage: StaticImageData;
  helpDescription: string;
}

interface HelpComponentProps {
  sethelpScreen: (value: boolean) => void;
}

const helpData = {
  helpItems: [
    {
      helpTitle: "Adding and deleting a category",
      helpImage: categories,
      helpDescription: "To add a category, open the sidebar and click 'Add Category'. A category requires a name and a color. A category can also be deleted in the fullscreen mode, by pressing the trashbin icon. However please do note that deleting a category will delete all corresponding pins."
    },
    {
      helpTitle: "Adding, editing and deleting a pin",
      helpImage: pinsPNG,
      helpDescription: "In order to add a pin, press the + button on the bottom right of the screen. A pin only requires a name, address and a category. All other fields are optional. A pin can also be edited either in the sidebar or in the fullscreen mode using the pencil icon. A pin can also be deleted in either the sidebar or the fullscreen using the trashbin icon."
    },
    {
      helpTitle: "Using the map",
      helpImage: mapPNG,
      helpDescription: "You can use the map to explore all related pins, Click on a pin within the sidebar will center the camera to that pins location. A pin can also be clicked on to bring up a modal to display all the related data about that pin."
    },
    {
      helpTitle: "FullScreen Mode",
      helpImage: fullscreenpng,
      helpDescription: "To enter fullscreen mode, click the fulllscreen icon within the sidebar. In fullscreen mode, you can view all pins and categories, edit pins and categories, and delete pins and categories as well as manage images and sort and search pins."
    },
    {
      helpTitle: "Managing Images",
      helpImage: manageImagespng,
      helpDescription: "In order to add images to pins, you can either press the camera icon within the sidebar or within fullscreen mode or within the expanded modal, and to manage images please press the photo icon within fullscreen mode. Images can be deleted by pressing the delete buttton, and pressing fullscreen will bring up a fullscreen gallery of all the images for that pin."
    },
    {
      helpTitle: "Managing Lists",
      helpImage: manageListspng,
      helpDescription: "The list screen is present at the top, lists allow for sorting of pins. Lists can be clicked to highlight the pins within the map. To create a list, open the list screen and click managelists on the top right. To add a pin to a list select list and drag and drop pins into the right hand side of the list screen."
    },
    {
      helpTitle: "Export To CSV",
      helpImage: exportCsvpng,
      helpDescription: "All pins can also be exported to CSV, currently, all pins are exported however this feature will be improved upon in the future, selected lists will soon be able to exported. The export button is in the bottom right."
    },
    {
      helpTitle: "Social Media",
      helpImage: socialMediapng,
      helpDescription: "Travel Trail also has a friend system, in which users can share their public lists with other users. To add a friend click the profile button on the top right, and click the friends button and make sure to add by friendcode. To download another friends lists to your own profile, select the list from the friend that you want and press add to profile."
    }
  ]
};

export default function HelpComponent({ sethelpScreen }: HelpComponentProps) {
  const [selectedHelp, setSelectedHelp] = useState<HelpItem | null>(null);

  useEffect(() => {
    // Initialize selectedHelp with the first help item
    if (helpData.helpItems.length > 0) {
      setSelectedHelp(helpData.helpItems[0]);
    }
  }, []);

  const categoryHeight = `${100 / helpData.helpItems.length}%`;

  return (
    <main className={styles.main}>
      <button className={styles.exit} onClick={() => sethelpScreen(false)}>X</button>
      <div className={styles.content}>
      {selectedHelp ?  <h1> {selectedHelp.helpTitle} </h1> : <h1> Help </h1>}
        <div className={styles.mainContent}>
          <div className={styles.helpCategories}>
            {helpData.helpItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedHelp(item)}
                style={{ height: categoryHeight }}
              >
                {item.helpTitle}
              </button>
            ))}
          </div>

          <div className={styles.helpDescription}>
            {selectedHelp ? (
              <>
                <img src={selectedHelp.helpImage.src} alt={selectedHelp.helpTitle} /> 
                <p>{selectedHelp.helpDescription}</p>            
              </>
            ) : (
              <p>Select a help topic to see the description</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}