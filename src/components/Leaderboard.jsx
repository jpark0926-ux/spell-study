import { useState, useEffect } from 'react'
import { getLeaderboard } from '../lib/saveGame'

export default function Leaderboard({ onClose }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await getLeaderboard(10)
        setLeaderboard(data)
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5,2,8,0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a0a2e, #0f051d)',
        border: '2px solid #D4A630',
        borderRadius: '20px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(212,166,48,0.3)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div>
            <h2 style={{
              color: '#D4A630',
              fontSize: '28px',
              fontWeight: '700',
              margin: '0 0 4px 0',
              textShadow: '0 0 20px rgba(212,166,48,0.5)'
            }}>
              🏆 명예의 전당
            </h2>
            <p style={{
              color: 'rgba(212,166,48,0.7)',
              fontSize: '14px',
              margin: 0
            }}>
              최고의 마법사들
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(212,166,48,0.1)',
              border: '1px solid rgba(212,166,48,0.3)',
              color: '#D4A630',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(212,166,48,0.2)'
              e.target.style.borderColor = 'rgba(212,166,48,0.5)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(212,166,48,0.1)'
              e.target.style.borderColor = 'rgba(212,166,48,0.3)'
            }}
          >
            ×
          </button>
        </div>

        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'rgba(212,166,48,0.7)',
            fontSize: '14px'
          }}>
            마법사 목록을 불러오는 중...
          </div>
        ) : leaderboard.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'rgba(212,166,48,0.5)',
            fontSize: '14px'
          }}>
            아직 등록된 마법사가 없습니다
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {leaderboard.map((player, index) => {
              const medals = ['🥇', '🥈', '🥉']
              const medal = medals[index]
              const isTop3 = index < 3

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: isTop3
                      ? 'linear-gradient(135deg, rgba(212,166,48,0.15), rgba(138,73,158,0.15))'
                      : 'rgba(212,166,48,0.05)',
                    border: `1px solid ${isTop3 ? 'rgba(212,166,48,0.4)' : 'rgba(212,166,48,0.2)'}`,
                    borderRadius: '12px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isTop3
                      ? 'linear-gradient(135deg, rgba(212,166,48,0.2), rgba(138,73,158,0.2))'
                      : 'rgba(212,166,48,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(212,166,48,0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isTop3
                      ? 'linear-gradient(135deg, rgba(212,166,48,0.15), rgba(138,73,158,0.15))'
                      : 'rgba(212,166,48,0.05)'
                    e.currentTarget.style.borderColor = isTop3 ? 'rgba(212,166,48,0.4)' : 'rgba(212,166,48,0.2)'
                  }}
                >
                  <div style={{
                    fontSize: '24px',
                    width: '32px',
                    textAlign: 'center'
                  }}>
                    {medal || `${index + 1}`}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: '#D4A630',
                      fontSize: isTop3 ? '16px' : '15px',
                      fontWeight: isTop3 ? '600' : '500',
                      marginBottom: '2px'
                    }}>
                      {player.display_name || '익명의 마법사'}
                    </div>
                    <div style={{
                      color: 'rgba(212,166,48,0.6)',
                      fontSize: '12px'
                    }}>
                      최고 점수: {player.best_score || 0}점
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 12px',
                    background: 'rgba(255,215,0,0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,215,0,0.3)'
                  }}>
                    <span style={{ fontSize: '16px' }}>🪙</span>
                    <span style={{
                      color: '#FFD700',
                      fontSize: '16px',
                      fontWeight: '700'
                    }}>
                      {player.total_coins?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(212,166,48,0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(212,166,48,0.2)',
          textAlign: 'center'
        }}>
          <p style={{
            color: 'rgba(212,166,48,0.7)',
            fontSize: '13px',
            margin: 0,
            lineHeight: '1.5'
          }}>
            순위는 총 코인 개수를 기준으로 결정됩니다.<br />
            더 많은 퀴즈를 풀어 상위권에 도전하세요!
          </p>
        </div>
      </div>
    </div>
  )
}
