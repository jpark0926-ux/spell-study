import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth({ user, onGuestMode }) {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://jpark0926-ux.github.io/spell-study/'
        }
      })
      if (error) throw error
    } catch (error) {
      alert('로그인 실패: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      alert('로그아웃 실패: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 16px',
        background: 'linear-gradient(135deg, rgba(212,166,48,0.1), rgba(138,73,158,0.1))',
        borderRadius: '12px',
        border: '1px solid rgba(212,166,48,0.3)',
        fontSize: '14px'
      }}>
        {user.user_metadata?.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt="avatar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '2px solid #D4A630'
            }}
          />
        )}
        <span style={{ color: '#D4A630', fontWeight: '500' }}>
          {user.email || '마법사'}
        </span>
        <button
          onClick={handleSignOut}
          disabled={loading}
          style={{
            padding: '6px 12px',
            background: 'rgba(174,0,1,0.2)',
            border: '1px solid rgba(174,0,1,0.5)',
            borderRadius: '8px',
            color: '#ff6b6b',
            fontSize: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.background = 'rgba(174,0,1,0.3)'
              e.target.style.borderColor = 'rgba(174,0,1,0.7)'
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(174,0,1,0.2)'
            e.target.style.borderColor = 'rgba(174,0,1,0.5)'
          }}
        >
          {loading ? '...' : '로그아웃'}
        </button>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '20px',
      background: 'linear-gradient(135deg, rgba(212,166,48,0.05), rgba(138,73,158,0.05))',
      borderRadius: '16px',
      border: '1px solid rgba(212,166,48,0.2)',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '8px'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
        <h3 style={{
          color: '#D4A630',
          fontSize: '18px',
          fontWeight: '600',
          margin: '0 0 4px 0'
        }}>
          환영합니다!
        </h3>
        <p style={{
          color: 'rgba(212,166,48,0.7)',
          fontSize: '13px',
          margin: 0
        }}>
          로그인하여 진행상황을 저장하세요
        </p>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 20px',
          background: 'linear-gradient(135deg, #4285F4, #357AE8)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 4px 12px rgba(66,133,244,0.3)'
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 6px 16px rgba(66,133,244,0.4)'
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 4px 12px rgba(66,133,244,0.3)'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
          <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
          <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9.003 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
        </svg>
        {loading ? '로그인 중...' : 'Google로 로그인'}
      </button>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '4px 0'
      }}>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,166,48,0.3), transparent)'
        }} />
        <span style={{
          color: 'rgba(212,166,48,0.5)',
          fontSize: '12px',
          fontWeight: '500'
        }}>또는</span>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,166,48,0.3), transparent)'
        }} />
      </div>

      <button
        onClick={onGuestMode}
        style={{
          padding: '12px 20px',
          background: 'rgba(212,166,48,0.1)',
          border: '1px solid rgba(212,166,48,0.4)',
          borderRadius: '12px',
          color: '#D4A630',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(212,166,48,0.15)'
          e.target.style.borderColor = 'rgba(212,166,48,0.6)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(212,166,48,0.1)'
          e.target.style.borderColor = 'rgba(212,166,48,0.4)'
        }}
      >
        게스트로 플레이
      </button>

      <p style={{
        color: 'rgba(212,166,48,0.5)',
        fontSize: '11px',
        textAlign: 'center',
        margin: '8px 0 0 0',
        lineHeight: '1.4'
      }}>
        게스트 모드는 진행상황이 로컬에만 저장됩니다
      </p>
    </div>
  )
}
