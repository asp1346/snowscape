// Webcam still-image endpoints per resort.
// Set `url` to the public still image URL for each camera angle.
// The component will append ?t=<timestamp> to bust the browser cache on each refresh.
// Leave `url` null to show a "Feed not available" placeholder for that angle.

const RESORT_WEBCAMS = {
  'Crystal Mountain': [
    { label: 'Summit', url: null },
    { label: 'Mid-mountain', url: null },
    { label: 'Base lodge', url: null },
  ],
  'Mt. Baker': [
    { label: 'Summit', url: null },
    { label: 'Base area', url: null },
    { label: 'Parking lot', url: null },
  ],
  'Mt. Bachelor': [
    { label: 'Summit', url: null },
    { label: 'Pine Marten', url: null },
    { label: 'Base area', url: null },
  ],
  'Mt. Hood Meadows': [
    { label: 'Summit ridge', url: null },
    { label: 'Hood River Meadows', url: null },
    { label: 'Base lodge', url: null },
  ],
  'Timberline': [
    { label: 'Palmer snowfield', url: null },
    { label: 'Lodge', url: null },
  ],
  'Stevens Pass': [
    { label: 'Summit', url: null },
    { label: 'Base area', url: null },
  ],
  'Snoqualmie Pass': [
    { label: 'Summit Central', url: null },
    { label: 'Alpental', url: null },
    { label: 'Base', url: null },
  ],
  'Whistler Blackcomb': [
    { label: 'Whistler Peak', url: null },
    { label: 'Blackcomb Glacier', url: null },
    { label: 'Village', url: null },
  ],
  'Hoodoo': [
    { label: 'Summit', url: null },
    { label: 'Base', url: null },
  ],
  'Ski Bowl': [
    { label: 'Upper bowl', url: null },
    { label: 'Base area', url: null },
  ],
}

export function getWebcams(resortName) {
  return RESORT_WEBCAMS[resortName] ?? []
}
