"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { MapPin } from "lucide-react";

import { hasValidEventCoordinates, type EventCoordinates, type EventItem } from "@/lib/types";

// Default view when the explorer map opens: Dhaka city
const defaultCenter: [number, number] = [23.745, 90.395];
const defaultZoom = 14;
const bangladeshCenter: [number, number] = [23.8103, 90.4125];
const markerClusterRadius = 42;
const maxClusterZoom = 18;

const categoryColors: Record<string, string> = {
  Cleanup: "#059669",
  Plantation: "#16a34a",
  Donation: "#f97316",
  Education: "#2563eb",
  "Health Camp": "#f43f5e",
  "Food Distribution": "#f59e0b",
  Other: "#475569",
};

function createEventIcon(eventType: string) {
  const color = categoryColors[eventType] ?? categoryColors.Other;

  return L.divIcon({
    className: "oikyo-event-marker",
    html: `<span style="--marker-color:${color}"></span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function formatPopupDate(value: string | undefined) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-BD", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function EventMapMarker({
  event,
  position,
}: {
  event: EventItem;
  position: L.LatLngExpression;
}) {
  const eventType = event.eventType?.trim();
  const location = event.location?.trim();
  const date = formatPopupDate(event.eventDate);

  return (
    <Marker
      position={position}
      icon={createEventIcon(eventType || "Other")}
    >
      <Popup>
        <div className="w-56 max-w-[calc(100vw-5rem)] space-y-2">
          {event.thumbnail?.trim() ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.thumbnail}
              alt=""
              className="h-24 w-full rounded-lg object-cover"
            />
          ) : null}
          <p className="font-semibold">{event.title}</p>
          {eventType ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              {eventType}
            </p>
          ) : null}
          {date ? <p className="text-sm">{date}</p> : null}
          {location ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">{location}</p>
          ) : null}
          <Link
            href={`/events/${event._id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400"
            aria-label={`View Details for ${event.title}`}
          >
            View Details <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}

type ClusterPoint = {
  event: EventItem;
  position: L.LatLng;
  screenPoint: L.Point;
};

type EventCluster = {
  id: string;
  events: ClusterPoint[];
  center: L.LatLng;
};

function clusterEvents(
  events: EventItem[],
  map: L.Map,
  zoom: number
): EventCluster[] {
  const points: ClusterPoint[] = events.flatMap((event) => {
    if (!hasValidEventCoordinates(event.coordinates)) return [];

    const position = L.latLng(
      event.coordinates.latitude,
      event.coordinates.longitude
    );

    return [{ event, position, screenPoint: map.project(position, zoom) }];
  });
  const parents = points.map((_, index) => index);

  function find(index: number): number {
    if (parents[index] !== index) parents[index] = find(parents[index]);
    return parents[index];
  }

  function unite(left: number, right: number) {
    const leftRoot = find(left);
    const rightRoot = find(right);
    if (leftRoot !== rightRoot) parents[rightRoot] = leftRoot;
  }

  for (let left = 0; left < points.length; left += 1) {
    for (let right = left + 1; right < points.length; right += 1) {
      if (
        points[left].screenPoint.distanceTo(points[right].screenPoint) <
        markerClusterRadius
      ) {
        unite(left, right);
      }
    }
  }

  const groups = new Map<number, ClusterPoint[]>();
  points.forEach((point, index) => {
    const root = find(index);
    const group = groups.get(root) ?? [];
    group.push(point);
    groups.set(root, group);
  });

  return [...groups.values()].map((group) => {
    const center = group.reduce(
      (sum, point) => sum.add(point.screenPoint),
      L.point(0, 0)
    ).divideBy(group.length);
    const clusterEvents = group.sort((left, right) =>
      left.event._id.localeCompare(right.event._id)
    );

    return {
      id: clusterEvents.map(({ event }) => event._id).join(":"),
      events: clusterEvents,
      center: map.unproject(center, zoom),
    };
  });
}

function createClusterIcon(count: number) {
  return L.divIcon({
    className: "oikyo-event-cluster",
    html: `<span style="display:flex;width:38px;height:38px;align-items:center;justify-content:center;border:3px solid white;border-radius:9999px;background:#1d4ed8;color:white;font-size:13px;font-weight:700;box-shadow:0 2px 8px rgb(15 23 42 / 35%)">${count}</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}

function EventClusterMarker({
  cluster,
  onClick,
}: {
  cluster: EventCluster;
  onClick: () => void;
}) {
  return (
    <Marker
      position={cluster.center}
      icon={createClusterIcon(cluster.events.length)}
      eventHandlers={{ click: onClick }}
      keyboard
      title={`${cluster.events.length} events. Select to zoom in.`}
    />
  );
}

function EventMarkers({ events }: { events: EventItem[] }) {
  const map = useMap();
  const [mapZoom, setMapZoom] = useState(() => map.getZoom());
  const [expandedClusterId, setExpandedClusterId] = useState<string | null>(null);

  useMapEvents({
    zoomend() {
      setExpandedClusterId(null);
      setMapZoom(map.getZoom());
    },
    click() {
      setExpandedClusterId(null);
    },
  });

  const clusters = useMemo(
    () => clusterEvents(events, map, mapZoom),
    [events, map, mapZoom]
  );

  function zoomOrExpandCluster(cluster: EventCluster) {
    const bounds = L.latLngBounds(
      cluster.events.map(({ position }) => position)
    );
    const targetZoom = map.getBoundsZoom(bounds, false, L.point(64, 64));

    if (targetZoom > map.getZoom()) {
      map.fitBounds(bounds, {
        padding: [64, 64],
        maxZoom: maxClusterZoom,
      });
    } else {
      setExpandedClusterId(cluster.id);
    }
  }

  return clusters.map((cluster) => {
    if (cluster.events.length === 1) {
      const [point] = cluster.events;
      return (
        <EventMapMarker
          key={point.event._id}
          event={point.event}
          position={point.position}
        />
      );
    }

    if (cluster.id === expandedClusterId) {
      const radius = Math.max(36, cluster.events.length * 6);

      return (
        <Fragment key={cluster.id}>
          {cluster.events.map((point, index) => {
            const angle =
              -Math.PI / 2 + (index * 2 * Math.PI) / cluster.events.length;
            const position = map.containerPointToLatLng(
              map.latLngToContainerPoint(cluster.center).add(
                L.point(Math.cos(angle) * radius, Math.sin(angle) * radius)
              )
            );

            return (
              <Fragment key={point.event._id}>
                <Polyline
                  positions={[point.position, position]}
                  pathOptions={{ color: "#64748b", opacity: 0.7, weight: 1 }}
                  interactive={false}
                />
                <EventMapMarker event={point.event} position={position} />
              </Fragment>
            );
          })}
        </Fragment>
      );
    }

    return (
      <EventClusterMarker
        key={cluster.id}
        cluster={cluster}
        onClick={() => zoomOrExpandCluster(cluster)}
      />
    );
  });
}

export function EventMap({ events }: { events: EventItem[] }) {
  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      scrollWheelZoom={false}
      className="h-[24rem] w-full rounded-2xl sm:h-[30rem]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="oikyo-map-tiles"
      />
      <EventMarkers events={events} />
    </MapContainer>
  );
}

function SelectableLocationMarker({
  value,
  onChange,
}: {
  value: EventCoordinates | null;
  onChange: (coordinates: EventCoordinates) => void;
}) {
  useMapEvents({
    click(event) {
      onChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  if (!value) return null;

  return (
    <CircleMarker
      center={[value.latitude, value.longitude]}
      radius={9}
      pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.9 }}
    />
  );
}

export function LocationPicker({
  value,
  onChange,
}: {
  value: EventCoordinates | null;
  onChange: (coordinates: EventCoordinates) => void;
}) {
  const center = useMemo<[number, number]>(
    () => (value ? [value.latitude, value.longitude] : bangladeshCenter),
    [value]
  );

  return (
    <MapContainer
      center={center}
      zoom={value ? 14 : 7}
      scrollWheelZoom
      className="h-64 w-full rounded-2xl sm:h-72"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="oikyo-map-tiles"
      />
      <SelectableLocationMarker value={value} onChange={onChange} />
    </MapContainer>
  );
}
  // Keeps the map sized correctly when it opens inside a Dialog (the open animation
// makes Leaflet measure the container too early and leaves grey tiles)
function InvalidateSizeOnOpen() {
  const map = useMap();

  useEffect(() => {
    const id = window.setTimeout(() => map.invalidateSize(), 250);
    return () => window.clearTimeout(id);
  }, [map]);

  return null;
}

// Map for one event, used inside the event card dialog
export function EventLocationMap({ event }: { event: EventItem }) {
  if (!hasValidEventCoordinates(event.coordinates)) return null;

  const position: [number, number] = [
    event.coordinates.latitude,
    event.coordinates.longitude,
  ];

  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom={false}
      className="h-72 w-full rounded-2xl sm:h-80"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="oikyo-map-tiles"
      />
      <InvalidateSizeOnOpen />
      <Marker
        position={position}
        icon={createEventIcon(event.eventType?.trim() || "Other")}
      />
    </MapContainer>
  );
}
