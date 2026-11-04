import PageLoader from "@/components/Home/PageLoader/page";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageLoader />
      {children}
    </>
  );
}