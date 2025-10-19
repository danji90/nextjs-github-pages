function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-6 h-6 border-3 border-white border-dashed rounded-full animate-spin ${className}`}
    ></div>
  );
}

export default Spinner;
