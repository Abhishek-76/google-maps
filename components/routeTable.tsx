import React from "react";

import { Table } from "antd";

interface Leg {
  start_address: string;
  end_address: string;
  duration: { text: string };
  distance: { value: number };
}

interface Route {
  legs: Leg[];
}

interface RouteTableProps {
  routes: Route[];
  selectedRoutes: number[];
  onRouteSelect: (index: number) => void;
}

const commutesPerYear = 260 * 2;
const litresPerKMCar = 1 / 30;
const litresPerKMbike = 1 / 70;
const gasLitreCost = 102;
const litreCarCostKM = litresPerKMCar * gasLitreCost;
const litreBikeCostKM = litresPerKMbike * gasLitreCost;

const RouteTable: React.FC<RouteTableProps> = ({
  routes,
  selectedRoutes,
  onRouteSelect,
}) => {
  console.log("Routes:", routes);

  const dataSource = routes
    .map((route, index) => {
      const leg = route?.legs?.[0];
      if (!leg) return null;

      const carCost = Math.floor(
        (leg.distance.value / 1000) * litreCarCostKM * commutesPerYear
      );
      const bikeCost = Math.floor(
        (leg.distance.value / 1000) * litreBikeCostKM * commutesPerYear
      );

      return {
        key: index,
        source: leg.start_address || "-",
        destination: leg.end_address || "-",
        carCost: `₹${carCost}`,
        bikeCost: `₹${bikeCost}`,
        route: `Route ${index + 1}`,
        time: leg.duration?.text || "-",
        selected: selectedRoutes.includes(index),
      };
    })
    .filter((route) => route !== null);

  const columns = [
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Car Cost",
      dataIndex: "carCost",
      key: "carCost",
    },
    {
      title: "Bike Cost",
      dataIndex: "bikeCost",
      key: "bikeCost",
    },
    {
      title: "Time to Reach Destination",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Select Route",
      dataIndex: "selected",
      key: "selected",
      render: (selected: boolean, record: any) => (
        <button onClick={() => onRouteSelect(record.key)} disabled={selected}>
          Select
        </button>
      ),
    },
  ];

  return <Table dataSource={dataSource} columns={columns} />;
};

export default RouteTable;
