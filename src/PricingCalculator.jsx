import { useState } from "react";

export default function PricingCalculator() {
  const [squareFeet, setSquareFeet] = useState(0);
  const [miles, setMiles] = useState(0);
  const [price, setPrice] = useState(null);
  const [breakdown, setBreakdown] = useState("");

  const calculatePrice = () => {
    let sf = Number(squareFeet);
    let mi = Number(miles);
    let baseFee = 750;
    let sfCharge = 0;
    let mileCharge = 0;
    let rate = 0;
    let billableSF = Math.max(sf - 5000, 0);

    if (sf > 5000 && sf <= 10000) {
      rate = 0.15;
    } else if (sf <= 25000) {
      rate = 0.10;
    } else if (sf <= 50000) {
      rate = 0.05;
    } else if (sf <= 100000) {
      rate = 0.02;
    } else if (sf <= 5000) {
      setPrice("$750.00");
      if (mi > 50) {
        mileCharge = (mi - 50) * 5;
        let total = baseFee + mileCharge;
        let roundedTotal = Math.round(total / 50) * 50;
        setPrice(`$${roundedTotal.toFixed(2)}`);
        setBreakdown(
          `Base Fee: $${baseFee.toFixed(2)}\n` +
          `Square Footage Entered: ${sf} SF\n` +
          `Square Footage Charge: 0\n` +
          `Miles Entered: ${mi} mi\n` +
          `Mileage Charge: ${mi - 50} mi × $5 = $${mileCharge.toFixed(2)}\n` +
          `Rounded Total: $${roundedTotal.toFixed(2)}`
        );
        return;
      } else {
        setBreakdown(
          `Base Fee: $750\n` +
          `Square Footage Entered: ${sf} SF\n` +
          `Square Footage Charge: 0\n` +
          `Miles Entered: ${mi} mi\n` +
          `Mileage Charge: 0 mi × $5 = $0.00\n` +
          `Rounded Total: $750.00`
        );
        return;
      }
    } else {
      setPrice("Over 100,000 - Contact Jim for pricing");
      setBreakdown("");
      return;
    }

    sfCharge = billableSF * rate;

    if (mi > 50) {
      mileCharge = (mi - 50) * 5;
    }

    let total = baseFee + sfCharge + mileCharge;
    let roundedTotal = Math.round(total / 50) * 50;

    setPrice(`$${roundedTotal.toFixed(2)}`);

    setBreakdown(
      `Base Fee: $${baseFee.toFixed(2)}\n` +
      `Square Footage Entered: ${sf} SF\n` +
      `Square Footage Charge: ${billableSF} SF × $${rate.toFixed(2)} = $${sfCharge.toFixed(2)}\n` +
      `Miles Entered: ${mi} mi\n` +
      `Mileage Charge: ${mi > 50 ? mi - 50 : 0} mi × $5 = $${mileCharge.toFixed(2)}\n` +
      `Rounded Total: $${roundedTotal.toFixed(2)}`
    );
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "1.5rem", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
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
      {breakdown && (
        <pre style={{ marginTop: "1.5rem", padding: "1rem", background: "#f8f8f8", borderRadius: "8px", whiteSpace: "pre-wrap", fontSize: ".95rem", lineHeight: "1.5" }}>
          {breakdown}
        </pre>
      )}
    </div>
  );
}
