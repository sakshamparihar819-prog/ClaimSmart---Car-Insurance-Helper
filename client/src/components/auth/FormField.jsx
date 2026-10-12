export default function FormField({ label, id, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wide text-black/50">
        {label}
      </label>
      <input
        id={id}
        className="mt-1.5 w-full rounded-md border-2 border-black bg-white px-3 py-2.5 text-sm"
        {...inputProps}
      />
    </div>
  );
}
