import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export const getMap = () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicGlua3BhZ2VqcGVnIiwiYSI6ImNscDRhNzdmdTBoZjIyaXF4amphZTBzY2cifQ.zteiWP8p2FkAlppkpfRdqg'

    const longitude = 37.476842
    const latitude = 55.712477

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [longitude, latitude],
        zoom: 15,
        attributionControl: false,
    })

    const marker = new mapboxgl.Marker({
        color: '#E6E6E6',
    })
        .setLngLat([longitude, latitude])
        .addTo(map)

    return {
        map: map,
        marker: marker
    }
}