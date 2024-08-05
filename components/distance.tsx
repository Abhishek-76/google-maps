const commutesPerYear = 260 * 2; //max 260days for working
const litresPerKMCar = 1 / 30;
const litresPerKMbike = 1 / 70;
const gasLitreCost = 102;
const litreCarCostKM = litresPerKMCar * gasLitreCost;
const litreBikeCostKM = litresPerKMbike * gasLitreCost;
const secondsPerDay = 60 * 60 * 24;

type DistanceProps = {
  leg: google.maps.DirectionsLeg;
};

export default function Distance({ leg }: DistanceProps) {
  if (!leg.distance || !leg.duration) return null;

  const days = Math.floor(
    (commutesPerYear * leg.duration.value) / secondsPerDay
  );

  const carCost = Math.floor(
    (leg.distance.value / 1000) * litreCarCostKM * commutesPerYear
  );
  const bikeCost = Math.floor(
    (leg.distance.value / 1000) * litreBikeCostKM * commutesPerYear
  );

  return (
    <div>
      <p>
        This Home is<span className="highlight">{leg.distance.text}</span>from
        your office. That would take
        <span className="highlight">{leg.duration.text}</span>
      </p>
      <p>
        That`s <span className="highlight"> {days} days </span> in your Car each
        year at a cost of{" "}
        <span className="highlight">
          ₹{new Intl.NumberFormat("en-IN").format(carCost)}
        </span>
        .
      </p>
      <p>
        That`s <span className="highlight">{days} days</span> in your Bike each
        year at a cost of{" "}
        <span className="highlight">
          ₹{new Intl.NumberFormat("en-IN").format(bikeCost)}
        </span>
        .
      </p>
    </div>
  );
}
