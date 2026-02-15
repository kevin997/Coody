export default function AssessmentTakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No header or footer for the fullscreen assessment experience
  return <>{children}</>;
}
