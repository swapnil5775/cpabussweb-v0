import { IntakeClient } from "./intake-client"

export default async function ServiceIntakePage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  return <IntakeClient orderId={orderId} />
}
