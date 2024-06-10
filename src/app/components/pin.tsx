import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const CustomizedMarker = () => (
    <AdvancedMarker position={{lat: -33.901435, lng: 150.879434}}>
      <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
    </AdvancedMarker>
  );

  export default CustomizedMarker;