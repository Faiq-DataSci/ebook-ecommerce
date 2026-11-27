import type { PricePreset } from '../../../../types/book.types';

interface PriceFilterGroupProps {
  pricePreset?: PricePreset;
  minPrice: string;
  maxPrice: string;
  isPriceInvalid: boolean;
  onSetPricePreset: (preset: PricePreset) => void;
  onChangeMinPrice: (value: string) => void;
  onChangeMaxPrice: (value: string) => void;
}

const PRICE_PRESETS: Array<{ id: PricePreset; label: string }> = [
  { id: 'all', label: 'Semua Harga' },
  { id: 'under50', label: '< Rp 50.000' },
  { id: '50to100', label: 'Rp 50.000 - Rp 100.000' },
  { id: 'above100', label: '> Rp 100.000' },
];

export function PriceFilterGroup({
  pricePreset,
  minPrice,
  maxPrice,
  isPriceInvalid,
  onSetPricePreset,
  onChangeMinPrice,
  onChangeMaxPrice,
}: PriceFilterGroupProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        borderTop: '2px solid var(--nb-black)',
        paddingTop: '0.875rem',
      }}
    >
      <span
        className="nb-label"
        style={{
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.04em',
          color: 'var(--nb-black)',
        }}
      >
        Rentang Harga (IDR)
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {PRICE_PRESETS.map((preset) => {
          const isChecked =
            preset.id === 'all'
              ? pricePreset === 'all' && !minPrice && !maxPrice
              : pricePreset === preset.id;

          return (
            <label
              key={preset.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                padding: '5px 8px',
                backgroundColor: isChecked
                  ? 'rgba(255, 210, 63, 0.35)'
                  : 'transparent',
                border: isChecked
                  ? '1px solid var(--nb-black)'
                  : '1px solid transparent',
                fontWeight: isChecked ? 700 : 400,
                userSelect: 'none',
              }}
            >
              <input
                type="radio"
                name="catalog-price-preset"
                checked={isChecked}
                onChange={() => onSetPricePreset(preset.id)}
                style={{
                  accentColor: 'var(--nb-black)',
                  cursor: 'pointer',
                  width: '15px',
                  height: '15px',
                }}
              />
              <span>{preset.label}</span>
            </label>
          );
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginTop: '4px',
        }}
      >
        <div>
          <span
            className="nb-mono"
            style={{
              display: 'block',
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              color: 'var(--nb-text-muted)',
              marginBottom: '2px',
              fontWeight: 700,
            }}
          >
            Min (Rp)
          </span>
          <input
            id="nb-price-min-input"
            type="number"
            min={0}
            step={5000}
            value={minPrice}
            onChange={(e) => onChangeMinPrice(e.target.value)}
            placeholder="0"
            style={{
              width: '100%',
              height: '36px',
              paddingInline: '8px',
              backgroundColor: 'var(--nb-paper)',
              border: '2px solid var(--nb-black)',
              fontFamily: 'var(--nb-font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--nb-black)',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <span
            className="nb-mono"
            style={{
              display: 'block',
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              color: 'var(--nb-text-muted)',
              marginBottom: '2px',
              fontWeight: 700,
            }}
          >
            Maks (Rp)
          </span>
          <input
            id="nb-price-max-input"
            type="number"
            min={0}
            step={5000}
            value={maxPrice}
            onChange={(e) => onChangeMaxPrice(e.target.value)}
            placeholder="150000"
            style={{
              width: '100%',
              height: '36px',
              paddingInline: '8px',
              backgroundColor: 'var(--nb-paper)',
              border: '2px solid var(--nb-black)',
              fontFamily: 'var(--nb-font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--nb-black)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {isPriceInvalid && (
        <p
          className="nb-mono"
          style={{
            fontSize: '0.6875rem',
            color: 'var(--nb-pink)',
            fontWeight: 700,
          }}
        >
          ⚠️ Nilai minimum tidak boleh melebihi maksimum.
        </p>
      )}
    </div>
  );
}
