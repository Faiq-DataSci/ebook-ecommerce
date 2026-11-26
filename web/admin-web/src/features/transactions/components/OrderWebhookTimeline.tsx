import type { WebhookTimelineNode } from '../types/transactionFinance'

interface OrderWebhookTimelineProps {
  timeline: WebhookTimelineNode[]
}

export function OrderWebhookTimeline({ timeline }: OrderWebhookTimelineProps) {
  return (
    <div className="tf-timeline">
      {timeline.map((item, idx) => (
        <div key={idx} className="tf-timeline-item">
          <div className={`tf-timeline-node ${item.status}`} aria-hidden="true" />

          <div className="tf-timeline-header">
            <span className="tf-timeline-stage">{item.stage}</span>
            <span className="tf-timeline-time">{item.timestamp}</span>
          </div>

          <div className="tf-timeline-desc">{item.description}</div>

          {item.meta && (
            <div className="tf-timeline-meta">
              {item.meta}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
