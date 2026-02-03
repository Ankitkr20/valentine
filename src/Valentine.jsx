import React, { useState, useEffect, useRef } from "react";

const ValentinePage = () => {
  const [showImage, setShowImage] = useState(false);

  // No button physics
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  const slotRef = useRef(null);
  const pointer = useRef({ x: 9999, y: 9999 });

  const SAFE_RADIUS = 90;
  const EMERGENCY_FORCE = 4;
  const TAP_ESCAPE_FORCE = 18;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  /* ================= POINTER TRACKING ================= */
  useEffect(() => {
    const updatePointer = (clientX, clientY) => {
      if (!slotRef.current) return;

      const rect = slotRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      pointer.current = {
        x: clientX - centerX,
        y: clientY - centerY,
      };
    };

    const onMouseMove = (e) => updatePointer(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      const t = e.touches[0];
      updatePointer(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  /* ================= PHYSICS LOOP ================= */
  useEffect(() => {
    let raf;

    const animate = () => {
      setPos((prev) => {
        let dx = prev.x - pointer.current.x;
        let dy = prev.y - pointer.current.y;

        let dist = Math.hypot(dx, dy) || 0.001;

        if (dist < SAFE_RADIUS) {
          const strength =
            ((SAFE_RADIUS - dist) / SAFE_RADIUS) * EMERGENCY_FORCE;

          velocity.current.x += (dx / dist) * strength;
          velocity.current.y += (dy / dist) * strength;
        } else {
          const force = Math.min(18 / dist, 1.1);
          velocity.current.x += (dx / dist) * force;
          velocity.current.y += (dy / dist) * force;
        }

        velocity.current.x *= 0.86;
        velocity.current.y *= 0.86;

        let nextX = prev.x + velocity.current.x;
        let nextY = prev.y + velocity.current.y;

        const maxX = window.innerWidth / 2 - 120;
        const maxY = window.innerHeight / 2 - 180;

        nextX = Math.max(-maxX, Math.min(maxX, nextX));
        nextY = Math.max(-maxY, Math.min(maxY, nextY));

        return { x: nextX, y: nextY };
      });

      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ================= MOBILE TAP ESCAPE ================= */
  const handleNoTap = () => {
    if (!isMobile) return;

    const angle = Math.random() * Math.PI * 2;
    velocity.current.x += Math.cos(angle) * TAP_ESCAPE_FORCE;
    velocity.current.y += Math.sin(angle) * TAP_ESCAPE_FORCE;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-400 to-purple-600 flex items-center justify-center p-4 text-white overflow-hidden">
      {!showImage ? (
        <div className="text-center z-10">
          {/* 💖 LARGE ANIMATED ICON */}
          <div className="flex justify-center mb-4">
            <div className="text-[90px] sm:text-[120px] animate-heartbeat drop-shadow-[0_0_40px_rgba(255,255,255,0.6)]">
              ❤️
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold mb-8 animate-pulse">
            Will you be my Valentine?
          </h1>

          <div className="flex gap-6 justify-center items-center">
            {/* YES BUTTON */}
            <button
              onClick={() => setShowImage(true)}
              className="px-8 py-4 text-lg bg-white text-pink-600 font-bold rounded-2xl shadow-2xl hover:scale-110 transition-all"
            >
              Yes! ❤️
            </button>

            {/* SLOT */}
            <div
              ref={slotRef}
              className="relative w-[120px] h-[60px] flex items-center justify-center"
            >
              {/* NO BUTTON */}
              <button
                onClick={handleNoTap}
                onTouchStart={handleNoTap}
                className="px-6 py-4 text-lg bg-gradient-to-r from-orange-400 to-red-500 font-bold rounded-2xl shadow-2xl absolute select-none"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                }}
              >
                No! 🏃‍♂️
              </button>
            </div>
          </div>

          <p className="mt-6 text-lg font-semibold opacity-80">There is only one option. 😈</p>
        </div>
      ) : (
        <div className="text-center z-10">
          <h1 className="text-4xl font-bold mb-6 text-yellow-300">
            Yay! I knew it! 💖✨
          </h1>
          <img
            src="https://res.cloudinary.com/dcxnaeidc/image/upload/v1770123687/a41a7a9d-35a9-4ca1-ae0d-17649273bcaf_gaw8lv.jpg"
            alt="Celebration"
            className="w-72 h-72 rounded-3xl shadow-2xl mx-auto"
          />
        </div>
      )}
    </div>
  );
};

export default ValentinePage;
