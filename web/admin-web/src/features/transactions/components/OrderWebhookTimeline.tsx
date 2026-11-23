import type { WebhookTimelineNode } from '../types/transactionFinance'

interface OrderWebhookTimelineProps {
  timeline: WebhookTimelineNode[]
}

export function OrderWebhookTimeline({ timeline }: OrderWebhookTimelineProps) {
  return (
    <div className="tf-timeline">
      {timeline.map((item, idx) => (
        <div key={idx} className="tf-timeline-item">
          <div className={`tf-timeline-node ${item.status}`}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 13, color: '#FFFFFF', fontWeight: 900 }}
            >
              {item.status === 'completed'
                ? 'check'
                : item.status === 'failed'
                ? 'close'
                : 'more_horiz'}
            </span>
          </div>

          <div className="tf-timeline-header">
            <span className="tf-timeline-stage">{item.stage}</span>
            <span className="tf-timeline-time">{item.timestamp}</span>
          </div>

          <div className="tf-timeline-desc">{item.description}</div>

          {item.meta && (
            <div
              className="tf-mono"
              style={{
                fontSize: 11,
                marginTop: 4,
                color: '#636E72',
                backgroundColor: '#EDF2F7',
                padding: '2px 6px',
                width: 'fit-content',
                border: '1px solid #CBD5E0',
              }}
            >
              {item.meta}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
