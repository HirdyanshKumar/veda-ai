import React from 'react';
import { Building2, MapPin, BookOpen } from 'lucide-react';

interface SchoolFormProps {
  school: string;
  location: string;
  subject: string;
  onSchoolChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onSubjectChange: (v: string) => void;
}

const SUBJECTS = ['Science', 'Math', 'English', 'History', 'Computer'];

const inputBase: React.CSSProperties = {
  width: '100%',
  height: '48px',
  padding: '12px 16px 12px 40px',
  border: '1.25px solid #DADADA',
  borderRadius: '12px',
  background: '#FFFFFF',
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontSize: '15px',
  fontWeight: 400,
  color: '#303030',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 150ms, box-shadow 150ms',
};

const FieldWrapper: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  children?: React.ReactNode;
}> = ({ label, icon, value, placeholder, onChange, children }) => {
  const [focused, setFocused] = React.useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#303030',
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 500,
            color: '#9CA3AF',
            background: '#F3F4F6',
            borderRadius: '100px',
            padding: '2px 8px',
          }}
        >
          Optional
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {icon}
        </div>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...inputBase,
            borderColor: focused ? '#1A1A1A' : '#DADADA',
            boxShadow: focused ? '0 0 0 3px rgba(26,26,26,0.06)' : 'none',
          }}
        />
      </div>
      {children}
    </div>
  );
};

const SchoolForm: React.FC<SchoolFormProps> = ({
  school,
  location,
  subject,
  onSchoolChange,
  onLocationChange,
  onSubjectChange,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <FieldWrapper
        label="School Name"
        icon={<Building2 size={16} color="#DADADA" />}
        value={school}
        placeholder="e.g. Delhi Public School, Bokaro"
        onChange={onSchoolChange}
      />

      <FieldWrapper
        label="City / Location"
        icon={<MapPin size={16} color="#DADADA" />}
        value={location}
        placeholder="e.g. New Delhi, Mumbai"
        onChange={onLocationChange}
      />

      <FieldWrapper
        label="Primary Subject"
        icon={<BookOpen size={16} color="#DADADA" />}
        value={subject}
        placeholder="e.g. Science, Mathematics, English"
        onChange={onSubjectChange}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
          {SUBJECTS.map((chip) => {
            const isActive = subject === chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => onSubjectChange(isActive ? '' : chip)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '100px',
                  border: `1px solid ${isActive ? '#1A1A1A' : '#E5E7EB'}`,
                  background: isActive ? '#1A1A1A' : '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: isActive ? '#FFFFFF' : '#6B7280',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </FieldWrapper>

      <p
        style={{
          fontSize: '12px',
          fontWeight: 400,
          color: '#9CA3AF',
          textAlign: 'center',
          marginTop: '4px',
        }}
      >
        You can always update this in your profile settings later.
      </p>
    </div>
  );
};

export default SchoolForm;
