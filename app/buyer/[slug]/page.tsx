import { resolveStitchScreen } from '../../../features/stitch/runtime/stitch-screen-resolver'
import { StitchScreenRenderer } from '../../../features/stitch/runtime/stitch-screen-renderer'
import { notFound } from 'next/navigation'

export default function BuyerSlugPage({ params }: { params: { slug: string } }) {
  const screen = resolveStitchScreen(params.slug)

  if (!screen) {
    notFound()
  }

  return <StitchScreenRenderer screen={screen} />
}
