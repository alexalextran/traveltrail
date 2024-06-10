import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";



async function getData(){
  await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=56+oliveri+crescent&key=${process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY}`)
  .then(response => response.json())
  .then(data => console.log(data));
}
getData();


const CustomizedMarker = () => (
    <AdvancedMarker position={{lat: -33.901435, lng: 150.879434}}>
      <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
    </AdvancedMarker>
  );

  export default CustomizedMarker;