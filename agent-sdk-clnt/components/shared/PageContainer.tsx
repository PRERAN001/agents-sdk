interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {children}
    </div>
  );
}