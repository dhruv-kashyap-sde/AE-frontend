const page = async ({ params }: { params: Promise<{ testId: string }> }) => {
  const { testId } = await params;
  return <div>cURRENT TEST ID: {testId}</div>;
};

export default page;
