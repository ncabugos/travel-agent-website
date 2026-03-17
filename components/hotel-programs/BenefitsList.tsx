import Image from 'next/image'
import type { HotelProgramBenefit } from '@/lib/hotel-programs'
import { EDEN } from '@/lib/media-library'

interface BenefitsListProps {
  benefits: HotelProgramBenefit[]
}

export function BenefitsList({ benefits }: BenefitsListProps) {
  if (!benefits.length) return null

  return (
    <>
      <style>{`
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
        }
        @media (max-width: 900px) {
          .benefits-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .benefits-grid { grid-template-columns: 1fr; }
        }

        .benefit-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 52px 40px;
          position: relative;
        }

        /* Subtle separator lines — only between cells horizontally */
        .benefit-cell::after {
          content: '';
          position: absolute;
          right: 0;
          top: 20%;
          height: 60%;
          width: 1px;
          background: rgba(181,148,90,0.18);
        }
        /* Remove right border on last in each row */
        .benefit-cell:nth-child(3n)::after,
        .benefit-cell:last-child::after {
          display: none;
        }
        @media (max-width: 900px) {
          .benefit-cell:nth-child(3n)::after { display: block; }
          .benefit-cell:nth-child(2n)::after { display: none; }
          .benefit-cell:last-child::after    { display: none; }
        }
        @media (max-width: 560px) {
          .benefit-cell::after { display: none; }
        }

        /* Thin horizontal separator between rows */
        .benefit-cell-row-sep {
          border-top: 1px solid rgba(181,148,90,0.12);
        }
      `}</style>

      <div className="benefits-grid">
        {benefits.map((benefit, i) => {
          // Add top border for every cell in rows after the first
          const cols = 3 // desktop columns
          const isSecondRow = i >= cols
          return (
            <div
              key={i}
              className={`benefit-cell${isSecondRow ? ' benefit-cell-row-sep' : ''}`}
            >
              {/* Gold wing icon */}
              <div style={{ marginBottom: '24px' }}>
                <Image
                  src={EDEN.logoWing}
                  alt=""
                  width={36}
                  height={36}
                  style={{ objectFit: 'contain', opacity: 0.8 }}
                />
              </div>

              {/* Title */}
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'var(--charcoal)',
                marginBottom: '14px',
                lineHeight: 1.4,
              }}>
                {benefit.title}
              </p>

              {/* Gold rule */}
              <div style={{
                width: '24px',
                height: '1px',
                background: '#B5945A',
                marginBottom: '14px',
                opacity: 0.6,
              }} />

              {/* Description */}
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--warm-gray)',
                lineHeight: '1.8',
                maxWidth: '240px',
              }}>
                {benefit.description}
              </p>
            </div>
          )
        })}
      </div>
    </>
  )
}
