export interface Coordinate {
  lat: number;
  lon: number;
}

export interface RestArea {
  id: string;
  name: string;
  location: Coordinate;
}

export const olongapoRestAreas: RestArea[] = [
  {
    id: "ra-gordon-ave",
    name: "Gordon Avenue Rest Spot",
    location: { lat: 14.8382, lon: 120.2842 },
  },
  {
    id: "ra-east-bajac",
    name: "East Bajac-Bajac Stopover",
    location: { lat: 14.827, lon: 120.2821 },
  },
  {
    id: "ra-new-kababae",
    name: "New Kababae Safety Lay-by",
    location: { lat: 14.8361, lon: 120.2641 },
  },
  {
    id: "ra-barretto",
    name: "Barretto Roadside Rest Point",
    location: { lat: 14.8742, lon: 120.2664 },
  },
];
