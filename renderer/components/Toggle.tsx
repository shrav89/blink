type ToggleProps = {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
};

export default function Toggle({ label, value, onChange }: ToggleProps) {
  return (
    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
