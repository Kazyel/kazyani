export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col justify-center items-center p-16 min-h-screen">
      <div className="grid grid-rows-[120px_1fr] justify-items-center place-items-center">
        {children}
      </div>
    </main>
  );
}
