import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";






const CustomizedMarker = ({lat, lng}: {lat: number, lng: number}) => (
    <AdvancedMarker position={{lat: lat, lng: lng}}>
      <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
    </AdvancedMarker>
  );

  export default CustomizedMarker;