import { useState } from "react";

export default function PricingCalculator() {
  const [squareFeet, setSquareFeet] = useState(0);
  const [miles, setMiles] = useState(0);
  const [price, setPrice] = useState(null);

  const calculatePrice = () => {
    let sf = Number(squareFeet);
    let mi = Number(miles);
    let total = 775; // flat fee
    let sfCharge = 0;
    let mileCharge = 0;

    // Square footage pricing tiers
    if (sf > 5000 && sf <= 10000) {
      sfCharge = (sf - 5000) * 0.10;
    } else if (sf > 10000 && sf <= 25000) {
      sfCharge = (5000 * 0.10) + (sf - 10000) * 0.10;
    } else if (sf > 25000 && sf <= 50000) {
      sfCharge = (5000 * 0.10) + (15000 * 0.10) + (sf - 25000) * 0.05;
    } else if (sf > 50000 && sf <= 100000) {
      sfCharge = (5000 * 0.10) + (15000 * 0.10) + (25000 * 0.05) + (sf - 50000) * 0.02;
    } else if (sf > 100000) {
      setPrice("Over 100,000 – custom rate");
      return;
    }

    // Mileage surcharge
    if (mi > 50) {
      mileCharge = (mi - 50) * 5;
    }

    total += sfCharge + mileCharge;

    // Round to nearest $50
    const roundedTotal = Math.round(total / 50) * 50;

    setPrice(`$${roundedTotal.toFixed(2)}`);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1.5rem", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "1rem" }}>Pricing Calculator</h1>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: ".5rem" }}>Square Footage</label>
        <input
          type="number"
          value={squareFeet}
          onChange={(e) => setSquareFeet(e.target.value)}
          placeholder="Enter square footage"
          style={{ width: "100%", padding: ".5rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: ".5rem" }}>Miles</label>
        <input
          type="number"
          value={miles}
          onChange={(e) => setMiles(e.target.value)}
          placeholder="Enter miles"
          style={{ width: "100%", padding: ".5rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>
      <button
        onClick={calculatePrice}
        style={{ width: "100%", backgroundColor: "#2563eb", color: "white", padding: ".75rem", borderRadius: "8px", fontSize: "1rem", fontWeight: "bold", border: "none", cursor: "pointer" }}
      >
        Calculate Price
      </button>
      {price !== null && (
        <div style={{ marginTop: "1rem", fontSize: "1.25rem", fontWeight: "bold", color: "#16a34a", textAlign: "center" }}>
          Estimated Total: {price}
        </div>
      )}
    </div>
  );
}
