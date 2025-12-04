import React from "react";

const SomalilandFlagBanner2 = () => {
  return (
    <section
      style={{
        width: "100%",
        height: "40px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* Green stripe with gradient */}
      <div
        style={{
          height: "33.33%",
          background:
            "linear-gradient(135deg, #004d18 0%, #005a1b 25%, #006d21 50%, #008a29 75%, #00a030 100%)",
          position: "relative",
          boxShadow:
            "inset 0 -3px 15px rgba(0, 0, 0, 0.2), inset 0 3px 10px rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Multiple texture layers */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0.05) 2px),
              repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.05) 1px, rgba(0, 0, 0, 0.05) 2px),
              radial-gradient(ellipse at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 50%, rgba(0, 0, 0, 0.1) 0%, transparent 50%)
            `,
            pointerEvents: "none",
          }}
        />
        {/* Fabric weave texture */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px),
              repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)
            `,
            pointerEvents: "none",
          }}
        />

        {/* Image in center of green stripe */}
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 5,
          }}
        >
          <img
            src="/7fbec7e58118099c6434fe5ec8081584.png"
            alt="Somaliland emblem"
            style={{
              height: "10px",
              width: "auto",
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
            }}
          />
        </div>
      </div>

      {/* White stripe with enhanced texture */}
      <div
        style={{
          height: "33.33%",
          background:
            "linear-gradient(135deg, #f0f0f0 0%, #f8f8f8 25%, #ffffff 50%, #fafafa 75%, #f5f5f5 100%)",
          position: "relative",
          boxShadow:
            "inset 0 3px 8px rgba(255, 0, 0, 0.08), inset 0 -3px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Multiple texture layers */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0, 0, 0, 0.02) 1px, rgba(0, 0, 0, 0.02) 2px),
              repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.015) 1px, rgba(0, 0, 0, 0.015) 2px),
              radial-gradient(ellipse at 30% 50%, rgba(0, 0, 0, 0.03) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 50%, rgba(255, 255, 255, 0.5) 0%, transparent 50%)
            `,
            pointerEvents: "none",
          }}
        />
        {/* Fabric weave texture */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.015) 2px, rgba(0, 0, 0, 0.015) 4px),
              repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.01) 2px, rgba(0, 0, 0, 0.01) 4px)
            `,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Red stripe with enhanced gradient */}
      <div
        style={{
          height: "33.33%",
          background:
            "linear-gradient(135deg, #b00020 0%, #c80023 25%, #e4002b 50%, #ff1a47 75%, #ff3355 100%)",
          position: "relative",
          boxShadow:
            "inset 0 3px 15px rgba(0, 0, 0, 0.2), inset 0 -3px 10px rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Multiple texture layers */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0.05) 2px),
              repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.05) 1px, rgba(0, 0, 0, 0.05) 2px),
              radial-gradient(ellipse at 25% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 75% 50%, rgba(0, 0, 0, 0.1) 0%, transparent 50%)
            `,
            pointerEvents: "none",
          }}
        />
        {/* Fabric weave texture */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px),
              repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)
            `,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Black star centered on flag */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 100 100"
          style={{ filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))" }}
        >
          <path
            d="M50 15 L61 46 L95 46 L68 65 L79 96 L50 77 L21 96 L32 65 L5 46 L39 46 Z"
            fill="black"
          />
        </svg>
      </div>
    </section>
  );
};

export default SomalilandFlagBanner2;
