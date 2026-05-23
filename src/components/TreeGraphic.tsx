import { TreeSpecies } from '../types';

interface TreeGraphicProps {
  species: TreeSpecies;
  streak: number;
  size?: number;
  animate?: boolean;
  isDark?: boolean;
}

export default function TreeGraphic({ species, streak, size = 120, animate = true, isDark = false }: TreeGraphicProps) {
  // Determine growth stage based on streak length
  let stage: 'seed' | 'sprout' | 'sapling' | 'adult' | 'elder' = 'seed';
  if (streak >= 40) stage = 'elder';
  else if (streak >= 15) stage = 'adult';
  else if (streak >= 6) stage = 'sapling';
  else if (streak >= 2) stage = 'sprout';

  // Specific species custom colors and details
  const getSpeciesColors = () => {
    switch (species) {
      case 'cherry':
        return {
          trunk: '#5C3D2E',
          leavesPrimary: '#FF7597',
          leavesSecondary: '#FFA2B6',
          leavesTertiary: '#FF4D79',
          bloomColor: '#FFE5EC',
        };
      case 'pine':
        return {
          trunk: '#472D30',
          leavesPrimary: '#00A896',
          leavesSecondary: '#028090',
          leavesTertiary: '#02C39A',
          bloomColor: '#F0F3F4',
        };
      case 'oak':
        return {
          trunk: '#503A21',
          leavesPrimary: '#55A630',
          leavesSecondary: '#3F7D20',
          leavesTertiary: '#80B918',
          bloomColor: '#FFD700',
        };
      case 'palm':
        return {
          trunk: '#825C38',
          leavesPrimary: '#2D6A4F',
          leavesSecondary: '#40916C',
          leavesTertiary: '#1B4332',
          bloomColor: '#FEE440',
        };
      case 'bonsai':
        return {
          trunk: '#3D2B1F',
          leavesPrimary: '#4895EF',
          leavesSecondary: '#3F37C9',
          leavesTertiary: '#4CC9F0',
          bloomColor: '#BEE9E8',
        };
    }
  };

  const colors = getSpeciesColors();
  const swayClass = animate ? 'origin-bottom animate-[sway_6s_ease-in-out_infinite]' : '';

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full drop-shadow-lg ${swayClass}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Style definitions for sways */}
        <defs>
          <style>{`
            @keyframes sway {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(2.5deg); }
            }
            .leaf-glowing {
              filter: drop-shadow(0 0 1px currentColor);
            }
          `}</style>
        </defs>

        {/* Dirt plot background */}
        <ellipse cx="50" cy="85" rx="32" ry="7" fill={isDark ? '#1F1F22' : '#ECE5D8'} />
        <ellipse cx="50" cy="84" rx="26" ry="5" fill={isDark ? '#29292F' : '#D7CBB5'} />
        <ellipse cx="50" cy="83" rx="16" ry="3" fill={isDark ? '#3A3A43' : '#BBA891'} />

        {/* SEED STAGE (Streak 0-1) */}
        {stage === 'seed' && (
          <g>
            {/* Tiny underground seed */}
            <circle cx="50" cy="81" r="2.5" fill="#C6F41D" className="animate-pulse" />
            <path d="M48.5,81 Q50,75 51.5,81 Z" fill="#80B918" />
            {/* Soil cracking indicator */}
            <path d="M42,83 L47,82.5 L53,83.5 L58,83" stroke={isDark ? '#4F4F54' : '#8A7D6C'} strokeWidth="1" fill="none" />
            <path d="M48,82.5 L50,80 L52,82.5" stroke="#C6F41D" strokeWidth="1" fill="none" className="opacity-60" />
            {/* Pulse glow indicating sleeping power of growth */}
            <circle cx="50" cy="80" r="8" fill="#D2FF3A" opacity="0.08" className="animate-ping" />
          </g>
        )}

        {/* SPROUT STAGE (Streak 2-5) */}
        {stage === 'sprout' && (
          <g>
            {/* Delicate stalk */}
            <path d="M50,83 Q49,74 53,68" stroke="#80B918" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Small leaves sprouting */}
            <path d="M53,68 Q58,67 59,70 Q55,73 53,68" fill="#A7D129" />
            <path d="M52,71 Q46,73 45,70 Q49,68 52,71" fill="#7D9D10" />
            {/* Dew drop */}
            <circle cx="59" cy="70" r="1" fill="#00F0FF" opacity="0.8" />
          </g>
        )}

        {/* SAPLING STAGE (Streak 6-14) */}
        {stage === 'sapling' && (
          <g>
            {/* Thin slender trunk */}
            <path d="M50,83 Q48,65 52,50" stroke={colors.trunk} strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <path d="M50.5,64 Q57,58 59,52" stroke={colors.trunk} strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M49.5,58 Q42,55 41,49" stroke={colors.trunk} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            
            {/* Clusters of foliage */}
            <circle cx="52" cy="48" r="8" fill={colors.leavesPrimary} opacity="0.9" />
            <circle cx="59" cy="51" r="6" fill={colors.leavesSecondary} opacity="0.85" />
            <circle cx="41" cy="48" r="5.5" fill={colors.leavesTertiary} opacity="0.85" />
            {/* Cute blossom dots */}
            <circle cx="51" cy="45" r="1.5" fill={colors.bloomColor} />
            <circle cx="58" cy="50" r="1" fill={colors.bloomColor} />
            <circle cx="42" cy="47" r="1.2" fill={colors.bloomColor} />
          </g>
        )}

        {/* ADULT STAGE (Streak 15-39) */}
        {stage === 'adult' && (
          <g>
            {/* Robust branches & trunk */}
            <path d="M50,83 Q47,60 50,42" stroke={colors.trunk} strokeWidth="7" fill="none" strokeLinecap="round" />
            {/* Major branches */}
            <path d="M49,65 Q36,55 35,46" stroke={colors.trunk} strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <path d="M50,56 Q64,48 65,39" stroke={colors.trunk} strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <path d="M50,46 Q54,36 50,32" stroke={colors.trunk} strokeWidth="3.5" fill="none" strokeLinecap="round" />

            {/* Lush geometric or puffy canopies */}
            {species === 'pine' ? (
              // Pine tree triangles layering
              <g>
                <polygon points="50,22 30,50 70,50" fill={colors.leavesSecondary} />
                <polygon points="50,30 34,52 66,52" fill={colors.leavesPrimary} />
                <polygon points="50,14 36,36 64,36" fill={colors.leavesTertiary} />
                <polygon points="50,20 40,38 60,38" fill={colors.leavesPrimary} />
              </g>
            ) : species === 'palm' ? (
              // Palm fronds
              <g>
                <path d="M65,39 Q72,32 80,38 Q74,44 65,39" fill={colors.leavesPrimary} />
                <path d="M35,46 Q28,40 20,47 Q27,51 35,46" fill={colors.leavesSecondary} />
                <path d="M50,32 Q58,18 70,20 Q60,30 50,32" fill={colors.leavesTertiary} />
                <path d="M50,32 Q42,18 30,22 Q38,31 50,32" fill={colors.leavesPrimary} />
                <path d="M49,38 Q50,28 50,23" stroke={colors.trunk} strokeWidth="3" fill="none" />
              </g>
            ) : (
              // Deciduous puffy tree crowns
              <g>
                <circle cx="34" cy="44" r="11" fill={colors.leavesSecondary} />
                <circle cx="66" cy="38" r="12" fill={colors.leavesSecondary} />
                <circle cx="50" cy="30" r="14" fill={colors.leavesPrimary} />
                <circle cx="43" cy="34" r="12.5" fill={colors.leavesTertiary} opacity="0.9" />
                <circle cx="57" cy="32" r="11" fill={colors.leavesSecondary} opacity="0.9" />
                {/* Shiny highlights/fruits */}
                <circle cx="48" cy="24" r="2.5" fill={colors.bloomColor} />
                <circle cx="31" cy="41" r="2" fill={colors.bloomColor} />
                <circle cx="65" cy="34" r="2" fill={colors.bloomColor} />
                <circle cx="58" cy="27" r="1.8" fill={colors.bloomColor} />
              </g>
            )}
          </g>
        )}

        {/* ELDER STAGE (Streak 40+) - Mighty Majestic Ancient version with extra details */}
        {stage === 'elder' && (
          <g>
            {/* Trunk with gnarly character */}
            <path d="M50,84 C41,75 46,55 49,34" stroke={colors.trunk} strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M43,83 Q54,68 53,50" stroke={colors.trunk} strokeWidth="8" strokeLinecap="round" fill="none" />
            
            {/* Huge root systems creeping into the ground */}
            <path d="M42,82 Q34,83 29,86" stroke={colors.trunk} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M58,82 Q68,84 73,87" stroke={colors.trunk} strokeWidth="5.5" strokeLinecap="round" fill="none" />

            {/* Thick side limbs */}
            <path d="M47,56 C30,48 26,38 27,24" stroke={colors.trunk} strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M51,48 C68,42 72,34 71,22" stroke={colors.trunk} strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M49,34 C49,24 53,20 50,15" stroke={colors.trunk} strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Massive crowning clouds of foliage */}
            {species === 'pine' ? (
              <g>
                <polygon points="50,4 20,44 80,44" fill={colors.leavesSecondary} opacity="0.8" />
                <polygon points="50,12 24,46 76,46" fill={colors.leavesPrimary} />
                <polygon points="50,18 28,48 72,48" fill={colors.leavesTertiary} opacity="0.95" />
                
                <polygon points="27,24 12,42 42,42" fill={colors.leavesPrimary} opacity="0.9" />
                <polygon points="71,22 56,40 86,40" fill={colors.leavesPrimary} opacity="0.9" />
                {/* Glowing stars */}
                <polygon points="50,2 51,5 54,6 51,7 50,10 49,7 46,6 49,5" fill="#C6F41D" />
              </g>
            ) : species === 'palm' ? (
              <g>
                <path d="M27,24 Q10,14 2,24 Q14,30 27,24" fill={colors.leavesPrimary} />
                <path d="M71,22 Q88,12 96,20 Q84,28 71,22" fill={colors.leavesPrimary} />
                <path d="M49,15 Q30,5 24,18 Q36,22 49,15" fill={colors.leavesSecondary} />
                <path d="M50,15 Q68,5 74,16 Q62,21 50,15" fill={colors.leavesSecondary} />
                <path d="M49,15 Q50,-3 48,-5" stroke={colors.trunk} strokeWidth="3" />
                {/* Hanging coconuts/dates with premium color */}
                <circle cx="44" cy="24" r="3.5" fill={colors.bloomColor} />
                <circle cx="54" cy="23" r="3.2" fill={colors.bloomColor} />
                <circle cx="49" cy="26" r="3" fill="#825C38" />
              </g>
            ) : (
              <g>
                {/* Dense, gorgeous interlocking blobs */}
                <circle cx="26" cy="24" r="17" fill={colors.leavesSecondary} opacity="0.92" />
                <circle cx="72" cy="22" r="17" fill={colors.leavesSecondary} opacity="0.92" />
                <circle cx="49" cy="14" r="19" fill={colors.leavesPrimary} />
                <circle cx="38" cy="20" r="17" fill={colors.leavesTertiary} opacity="0.95" />
                <circle cx="59" cy="18" r="17.5" fill={colors.leavesSecondary} opacity="0.95" />
                <circle cx="18" cy="34" r="12" fill={colors.leavesTertiary} opacity="0.9" />
                <circle cx="81" cy="32" r="12" fill={colors.leavesTertiary} opacity="0.9" />

                {/* Glowing fruits / specs of magic pollen */}
                <circle cx="45" cy="8" r="3" fill="#FFF" className="animate-pulse" />
                <circle cx="21" cy="20" r="2.5" fill={colors.bloomColor} />
                <circle cx="77" cy="18" r="2.5" fill={colors.bloomColor} />
                <circle cx="34" cy="14" r="3.2" fill={colors.bloomColor} />
                <circle cx="62" cy="12" r="2.8" fill={colors.bloomColor} />
                <circle cx="56" cy="26" r="3" fill={colors.bloomColor} />
                <circle cx="26" cy="32" r="2" fill="#FFEBB3" />
                <circle cx="70" cy="30" r="2" fill="#FFEBB3" />
              </g>
            )}

            {/* Magical visual ring radiating at base of elder tree */}
            <ellipse cx="50" cy="83" rx="28" ry="4" stroke="#FFF" strokeWidth="0.8" fill="none" opacity="0.15" />
            <circle cx="15" cy="74" r="1" fill="#D2FF3A" opacity="0.5" className="animate-ping" />
            <circle cx="85" cy="72" r="1" fill="#00F0FF" opacity="0.4" className="animate-ping" />
          </g>
        )}
      </svg>
      
      {/* Decorative text badge for Growth Stage inside parent if hovered */}
      <span className={`absolute bottom-[-14px] left-[50%] translate-x-[-50%] text-[8px] tracking-[0.15em] font-mono whitespace-nowrap px-1.5 py-0.5 rounded-full border transition-colors capitalize ${
        isDark 
          ? 'bg-[#121214] border-neutral-700/65 text-neutral-400' 
          : 'bg-[#FAF8F5] border-[#E8E2D9] text-[#706B63] shadow-sm'
      }`}>
        {stage} ({streak}d)
      </span>
    </div>
  );
}
