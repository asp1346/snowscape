export const CRITERIA = [
  { key: 'freshSnow', label: 'Fresh snow', hasData: true },
  { key: 'snowQuality', label: 'Snow quality', hasData: true },
  { key: 'grooming', label: 'Grooming', hasData: false },
  { key: 'terrainVariety', label: 'Terrain variety', hasData: false },
  { key: 'parkAndPipe', label: 'Park and pipe', hasData: false },
  { key: 'driveTime', label: 'Drive time', hasData: true },
  { key: 'roadConditions', label: 'Road conditions', hasData: true },
  { key: 'lowCrowds', label: 'Low crowds', hasData: false }
]

export const DEFAULT_WEIGHTS = CRITERIA.reduce((weights, criterion) => {
  weights[criterion.key] = 5
  return weights
}, {})

export const PRESETS = [
  {
    name: 'Powder Hunter',
    weights: {
      freshSnow: 10,
      snowQuality: 9,
      grooming: 2,
      terrainVariety: 6,
      parkAndPipe: 1,
      driveTime: 4,
      roadConditions: 6,
      lowCrowds: 7
    }
  },
  {
    name: 'Groomer Cruiser',
    weights: {
      freshSnow: 3,
      snowQuality: 5,
      grooming: 10,
      terrainVariety: 4,
      parkAndPipe: 2,
      driveTime: 6,
      roadConditions: 8,
      lowCrowds: 4
    }
  },
  {
    name: 'Park Rat',
    weights: {
      freshSnow: 3,
      snowQuality: 4,
      grooming: 6,
      terrainVariety: 5,
      parkAndPipe: 10,
      driveTime: 5,
      roadConditions: 5,
      lowCrowds: 3
    }
  },
  {
    name: 'Off-Piste/BC',
    weights: {
      freshSnow: 9,
      snowQuality: 8,
      grooming: 1,
      terrainVariety: 9,
      parkAndPipe: 1,
      driveTime: 3,
      roadConditions: 7,
      lowCrowds: 9
    }
  },
  {
    name: 'All-Mountain',
    weights: {
      freshSnow: 6,
      snowQuality: 6,
      grooming: 6,
      terrainVariety: 8,
      parkAndPipe: 5,
      driveTime: 5,
      roadConditions: 6,
      lowCrowds: 5
    }
  }
]
