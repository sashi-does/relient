'use client';

import Component from '@repo/ui/beams';

function Slicers() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-black p-4">
      <div className="w-full h-[600px] relative">
        <Component
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>
    </div>
  );
}

export default Slicers;