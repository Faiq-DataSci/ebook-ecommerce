import type { SawCalculationStep } from '../types/recommendation.types';

interface SawScoreBarProps {
  score: number;
  steps: SawCalculationStep[];
}

const CRITERIA_COLORS: Record<string, string> = {
  C1: 'var(--nb-yellow)',
  C2: 'var(--nb-green)',
  C3: 'var(--nb-blue)',
  C4: 'var(--nb-lavender)',
  C5: 'var(--nb-orange)',
};

export function SawScoreBar({ score, steps }: SawScoreBarProps) {
  const percentage = Math.min(Math.round(score * 100), 100);

  return (
    <div className="saw-scorebar-container" style={{ marginBlock: '8px' }}>
      <div
        className="nb-mono"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          marginBottom: '5px',
          fontWeight: 700,
        }}
      >
        <span style={{ color: 'var(--nb-black)' }}>Kontribusi Kriteria (SAW):</span>
        <span style={{ color: 'var(--nb-black)' }}>
          {percentage}% Kecocokan
        </span>
      </div>

      <div
        style={{
          height: '24px',
          width: '100%',
          backgroundColor: 'var(--nb-muted)',
          border: '2px solid var(--nb-black)',
          boxShadow: '1.5px 1.5px 0 var(--nb-black)',
          display: 'flex',
          overflow: 'hidden',
        }}
        title={`Skor Akumulasi SAW: ${score.toFixed(3)}`}
      >
        {steps.map((step, idx) => {
          // Hitung persentase segmen terhadap total 1.0 (skala penuh)
          const segWidth = Math.max(Math.round((step.weightedContribution / (score || 1)) * percentage), 6);
          const segColor = CRITERIA_COLORS[step.criterionId] || 'var(--nb-lavender)';

          return (
            <div
              key={step.criterionId}
              style={{
                width: `${segWidth}%`,
                height: '100%',
                backgroundColor: segColor,
                borderRight: idx < steps.length - 1 ? '2px solid var(--nb-black)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--nb-font-mono)',
                fontSize: '10px',
                fontWeight: 900,
                color: 'var(--nb-black)',
                userSelect: 'none',
              }}
              title={`${step.criterionId} (${step.criterionName}): Bobot ${(step.weight * 100).toFixed(0)}% × Normalisasi ${step.normalizedValue.toFixed(3)} = Kontribusi ${step.weightedContribution.toFixed(3)}`}
            >
              <span>{step.criterionId}</span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '6px',
          fontSize: '0.6875rem',
        }}
      >
        {steps.map((step) => (
          <div
            key={step.criterionId}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: CRITERIA_COLORS[step.criterionId] || 'var(--nb-lavender)',
                border: '1px solid var(--nb-black)',
                display: 'inline-block',
              }}
              aria-hidden="true"
            />
            <span style={{ fontWeight: 600 }}>
              {step.criterionId}: {step.criterionName} ({(step.weightedContribution).toFixed(3)})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
