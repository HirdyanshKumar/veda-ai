import React from 'react';
import { GraduationCap, Users, Check } from 'lucide-react';

interface RoleCardProps {
  role: 'teacher' | 'student';
  title: string;
  description: string;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
  role,
  title,
  description,
  isSelected,
  isDisabled,
  onClick,
}) => {
  const [hovered, setHovered] = React.useState(false);
  const Icon = role === 'teacher' ? GraduationCap : Users;

  const getBorderStyle = () => {
    if (isSelected) return '2px solid #1A1A1A';
    if (!isDisabled && hovered) return '1.5px solid #DADADA';
    return '1.5px solid #F3F4F6';
  };

  const getBg = () => {
    if (isSelected) return '#FFFFFF';
    if (!isDisabled && hovered) return '#F9F9F9';
    return '#FAFAFA';
  };

  const getIconBg = () => {
    if (isDisabled) return '#F3F4F6';
    if (isSelected) return '#1A1A1A';
    return '#F3F4F6';
  };

  const getIconColor = () => {
    if (isDisabled) return '#DADADA';
    if (isSelected) return '#FFFFFF';
    return '#6B7280';
  };

  return (
    <div
      onClick={isDisabled ? undefined : onClick}
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        padding: '20px 24px',
        borderRadius: '20px',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '16px',
        transition: 'all 200ms',
        position: 'relative',
        overflow: 'hidden',
        background: getBg(),
        border: getBorderStyle(),
        boxShadow: isSelected ? '0px 4px 16px rgba(0,0,0,0.08)' : 'none',
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '22px',
            height: '22px',
            background: '#1A1A1A',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Check size={12} color="#FFFFFF" strokeWidth={3} />
        </div>
      )}

      {isDisabled && !isSelected && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#F3F4F6',
            borderRadius: '100px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#9CA3AF',
          }}
        >
          Coming Soon
        </div>
      )}

      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: getIconBg(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 200ms',
        }}
      >
        <Icon size={24} color={getIconColor()} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: isDisabled ? '#9CA3AF' : '#1A1A1A',
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 400,
            color: '#6B7280',
            marginTop: '4px',
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

export default RoleCard;
