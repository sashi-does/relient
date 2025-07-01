import Component from '@repo/ui/beams';

export default function Slicers() {
  return (
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
  );
}