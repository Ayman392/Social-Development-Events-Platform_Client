export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page-loader" aria-hidden="true">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>

      {children}
    </>
  );
}