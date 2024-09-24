import { useSearchParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from "react-leaflet";
import { useEffect, useState } from "react";
import styles from "./Map.module.css";
import { useCities } from "../contexts/CitiesContext";
import Button from './Button';
import { useGeolocation } from "../hooks/usegeolocation";
import useUrlPosition from "../hooks/useUrlPosition";

export default function Map() {
    const { cities } = useCities();
    const [mapPosition, setMapPosition] = useState([40, 0]);
    const {
        isLoading: isLoadingPosition,
        position: geolocationPosition,
        getPosition,
    } = useGeolocation();

    const [mapLat, mapLng] = useUrlPosition();

    useEffect(() => {
        if (mapLat && mapLng) {
            const lat = parseFloat(mapLat);
            const lng = parseFloat(mapLng);
            if (!isNaN(lat) && !isNaN(lng)) {
                setMapPosition([lat, lng]);
            }
        }
    }, [mapLat, mapLng]);

    useEffect(() => {
        if (geolocationPosition) {
            setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
        }
    }, [geolocationPosition]);

    return (
        <div className={styles.mapContainer}>


            <Button type="position" onClick={getPosition}>
                {isLoadingPosition ? "Loading..." : "Use your position"}
            </Button>


            <MapContainer center={mapPosition} zoom={6} className={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {cities.map((city) => (
                    city.position && city.position.lat !== null && city.position.lng !== null && (
                        <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                            <Popup>
                                <span>{city.emoji}</span> <span>{city.cityName}</span>
                            </Popup>
                        </Marker>
                    )
                ))}
                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    );
}

function ChangeCenter({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position && position[0] !== undefined && position[1] !== undefined) {
            map.setView(position);
        }
    }, [map, position]);

    return null;
}

function DetectClick() {
    const navigate = useNavigate();
    useMapEvent({
        click: (e) => navigate(`from/?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
    });
}
