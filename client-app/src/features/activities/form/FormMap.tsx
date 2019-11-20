import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Segment, Icon } from 'semantic-ui-react';
import GoogleMapReact from 'google-map-react';

const Marker: React.FC<{ lat: any; lng: any }> = ({ lat, lng }) => (
  <Icon name='marker' size='big' color='red' />
);

interface IProps{
    lat?:any;
    lng?:any;
}
export const FormMap: React.FC<IProps> = ({ lat, lng }) => {
  var center: { lat: number; lng: number } = { lat: 52.372513, lng: 9.732968 };
  useEffect(() => {
      if(lat && lng){
        center.lat = lat;
        center.lng = lng;
        console.log("From Child",lat,lng);
      }
  }, [lat, lng]);

  const zoom = 14;

  return (
    <Segment attached='bottom' style={{ padding: 0 }}>
      <div style={{ height: '300px', width: '100%' }}>
        <GoogleMapReact
        key={lat}
          bootstrapURLKeys={{ key: 'AIzaSyCHYvacLxG7odfjovNDb1GpTHon3BMIXlw' }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <Marker lat={lat} lng={lng} />
        </GoogleMapReact>
      </div>
    </Segment>
  );
};
export default observer(FormMap);
