import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface MushroomSpot {
  id: number;
  lat: number;
  lng: number;
  species: string;
  notes: string;
  dateFound: string;
}

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function AddMarkerEvents({ onAddSpot }: { onAddSpot: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onAddSpot(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function App() {
  const [spots, setSpots] = useState<MushroomSpot[]>([
    {
      id: 1,
      lat: 45.5152,
      lng: -122.6784,
      species: 'Chanterelle',
      notes: 'Found near Douglas fir trees after rain.',
      dateFound: '2026-10-01',
    },
  ]);

  const [selectedSpot, setSelectedSpot] = useState<{ lat: number; lng: number } | null>(null);
  const [species, setSpecies] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddSpotClick = (lat: number, lng: number) => {
    setSelectedSpot({ lat, lng });
  };

  const handleSaveSpot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpot) return;
    const newSpot: MushroomSpot = {
      id: Date.now(),
      lat: selectedSpot.lat,
      lng: selectedSpot.lng,
      species: species || 'Unknown Mushroom',
      notes: notes || 'No notes provided',
      dateFound: new Date().toISOString().split('T')[0],
    };
    setSpots([...spots, newSpot]);
    setSelectedSpot(null);
    setSpecies('');
    setNotes('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ background: '#2d5a27', color: 'white', padding: '1rem', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>🍄 Mushroom Tracker</h1>
        <p style={{ margin: '0.5rem 0 0' }}>Click anywhere on the map to log a new mushroom sighting!</p>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <MapContainer center={[45.5152, -122.6784]} zoom={11} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <AddMarkerEvents onAddSpot={handleAddSpotClick} />
            {spots.map((spot) => (
              <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={customIcon}>
                <Popup>
                  <strong style={{ fontSize: '1.1em' }}>🍄 {spot.species}</strong><br />
                  <span><strong>Date:</strong> {spot.dateFound}</span><br />
                  <p style={{ margin: '0.5rem 0 0' }}>{spot.notes}</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {selectedSpot && (
          <div style={{ width: '300px', padding: '1rem', background: '#f9f9f9', borderLeft: '1px solid #ccc' }}>
            <h2>Log Sighting</h2>
            <p><small>Location: {selectedSpot.lat.toFixed(4)}, {selectedSpot.lng.toFixed(4)}</small></p>
            <form onSubmit={handleSaveSpot}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Species / Type</label>
                <input
                  type="text"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  placeholder="e.g. Morel, Chanterelle"
                  style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Habitat details, tree species nearby, etc."
                  style={{ width: '100%', height: '80px', padding: '0.5rem', boxSizing: 'border-box' }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: '#2d5a27',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Save Spot
              </button>
              <button
                type="button"
                onClick={() => setSelectedSpot(null)}
                style={{
                  background: 'transparent',
                  color: '#666',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '0.5rem'
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
