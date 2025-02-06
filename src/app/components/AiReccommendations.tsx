import React, { useState, useEffect } from 'react';
import styles from '../Sass/HelpComponent.module.scss';

import { StaticImageData } from 'next/image';

interface HelpItem {
  helpTitle: string;
  helpImage: StaticImageData;
  helpDescription: string;
}

interface HelpComponentProps {
  setAiScreen: (value: boolean) => void;
}



export default function AiReccommendations({ setAiScreen }: HelpComponentProps) {
  const [selectedHelp, setSelectedHelp] = useState<HelpItem | null>(null);





  return (
    <main className={styles.main}>
      <button className={styles.exit} onClick={() => setAiScreen(false)}>X</button>
      <div className={styles.content}>
      {selectedHelp ?  <h1> {selectedHelp.helpTitle} </h1> : <h1> Help </h1>}
        <div className={styles.mainContent}>
          <div className={styles.helpCategories}>
           
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