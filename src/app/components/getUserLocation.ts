const getUserLocation = async () => {   //function to get users current loction
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser.');
    }
  
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };
export default getUserLocation;  