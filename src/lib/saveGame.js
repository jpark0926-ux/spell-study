import { supabase } from './supabase'

const STORAGE_KEY = 'spell_study_progress'

/**
 * 진행상황 저장
 * @param {Object} data - 저장할 데이터
 * @param {string} data.userId - 유저 ID ('guest' 또는 Supabase user ID)
 * @param {number} data.unit - 현재 유닛
 * @param {number} data.coins - 보유 코인
 * @param {number} data.bestStreak - 최고 연속 정답
 * @param {Array} data.earnedAch - 획득한 업적 목록
 * @param {Array} data.cards - 수집한 카드 목록
 * @param {Array} data.killedV - 처치한 빌런 목록
 */
export async function saveProgress(data) {
  const { userId, unit, coins, bestStreak, earnedAch, cards, killedV } = data

  // localStorage에 저장 (로컬 백업)
  try {
    const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const userProgress = {
      ...existingData,
      [userId]: {
        unit,
        coins,
        bestStreak,
        earnedAch,
        cards,
        killedV,
        updatedAt: new Date().toISOString()
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }

  // Supabase에 저장 (로그인한 유저만)
  if (userId !== 'guest' && supabase) {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          unit,
          coins,
          best_streak: bestStreak,
          earned_ach: earnedAch,
          cards,
          killed_villains: killedV,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,unit'
        })

      if (error) {
        console.error('Supabase save error:', error)
      }
    } catch (error) {
      console.error('Failed to save to Supabase:', error)
    }
  }
}

/**
 * 진행상황 로드
 * @param {string} userId - 유저 ID ('guest' 또는 Supabase user ID)
 * @returns {Object|null} 저장된 진행상황 또는 null
 */
export async function loadProgress(userId) {
  // Supabase에서 로드 시도 (로그인한 유저만)
  if (userId !== 'guest' && supabase) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (data && !error) {
        return {
          unit: data.unit,
          coins: data.coins,
          bestStreak: data.best_streak,
          earnedAch: data.earned_ach || [],
          cards: data.cards || [],
          killedV: data.killed_villains || []
        }
      }
    } catch (error) {
      console.error('Failed to load from Supabase:', error)
    }
  }

  // localStorage에서 로드
  try {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const userProgress = allData[userId]

    if (userProgress) {
      return {
        unit: userProgress.unit,
        coins: userProgress.coins,
        bestStreak: userProgress.bestStreak,
        earnedAch: userProgress.earnedAch || [],
        cards: userProgress.cards || [],
        killedV: userProgress.killedV || []
      }
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
  }

  return null
}

/**
 * 리더보드에 점수 업데이트
 * @param {string} userId - 유저 ID
 * @param {string} displayName - 표시할 이름
 * @param {number} score - 점수
 * @param {number} totalCoins - 총 코인
 */
export async function updateLeaderboard(userId, displayName, score, totalCoins) {
  if (userId === 'guest' || !supabase) return

  try {
    const { error } = await supabase
      .from('leaderboard')
      .upsert({
        user_id: userId,
        display_name: displayName,
        best_score: score,
        total_coins: totalCoins,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (error) {
      console.error('Leaderboard update error:', error)
    }
  } catch (error) {
    console.error('Failed to update leaderboard:', error)
  }
}

/**
 * 리더보드 데이터 가져오기
 * @param {number} limit - 가져올 개수 (기본 10)
 * @returns {Array} 리더보드 목록
 */
export async function getLeaderboard(limit = 10) {
  if (!supabase) {
    // Mock 데이터 반환 (Supabase 미연결 시)
    return [
      { display_name: 'Harry Potter', total_coins: 1234, best_score: 95 },
      { display_name: 'Hermione Granger', total_coins: 1567, best_score: 98 },
      { display_name: 'Ron Weasley', total_coins: 892, best_score: 87 },
      { display_name: 'Luna Lovegood', total_coins: 1045, best_score: 92 },
      { display_name: 'Neville Longbottom', total_coins: 756, best_score: 85 },
      { display_name: 'Ginny Weasley', total_coins: 998, best_score: 90 },
      { display_name: 'Draco Malfoy', total_coins: 1123, best_score: 88 },
      { display_name: 'Cho Chang', total_coins: 834, best_score: 86 },
      { display_name: 'Cedric Diggory', total_coins: 945, best_score: 91 },
      { display_name: 'Fred Weasley', total_coins: 712, best_score: 83 }
    ]
  }

  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('display_name, best_score, total_coins')
      .order('total_coins', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Leaderboard fetch error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
    return []
  }
}
