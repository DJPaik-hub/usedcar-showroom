import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AIRecommend() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  // n8n Webhook URL (여기에 복사한 URL 입력!)
  const N8N_WEBHOOK_URL = '/api/ai-recommend';

  const handleRecommend = async () => {
    if (!query.trim()) {
      alert('추천받고 싶은 차량 조건을 입력해주세요!');
      return;
    }

    setLoading(true);
    setRecommendations([]);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const result = await response.json();

      if (result.success && result.recommendations) {
        setRecommendations(result.recommendations);
      } else {
        alert('추천 결과를 가져오지 못했습니다.');
      }
    } catch (error) {
      console.error('AI 추천 오류:', error);
      alert('AI 추천 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const goToDetail = (carId) => {
    router.push(`/car/${carId}`);
  };

  return (
    <>
      {/* 🔝 상단 메뉴 */}
      <nav className="top-menu">
        <div className="menu-logo">SHOWROOM</div>
        <div className="menu-items">
          <div className="menu-item" onClick={() => router.push('/')}>
            쇼룸
          </div>
          <div className="menu-item" onClick={() => router.push('/inventory')}>
            차량 목록
          </div>
          <div className="menu-item active" onClick={() => router.push('/ai-recommend')}>
            AI 추천
          </div>
          <div className="menu-item" onClick={() => router.push('/seller')}>
            판매자 정보
          </div>
        </div>
      </nav>

      <div className="ai-recommend-page">
        {/* 🎯 타이틀 */}
        <div className="title-section">
          <h1>🤖 AI 차량 추천</h1>
          <p>원하시는 차량 조건을 입력하시면 AI가 최적의 차량을 추천해드립니다</p>
        </div>

        {/* 🔍 입력 영역 */}
        <div className="input-section">
          <textarea
            placeholder="예: 가족용으로 좋은 SUV 추천해줘&#10;예: 연비 좋고 가격 저렴한 차량&#10;예: 최신 모델 중에서 고급스러운 세단"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
          />
          <button onClick={handleRecommend} disabled={loading}>
            {loading ? '🔄 AI가 분석 중...' : '✨ AI 추천 받기'}
          </button>
        </div>

        {/* 📌 예시 검색어 */}
        <div className="example-queries">
          <span>예시:</span>
          <button onClick={() => setQuery('가족용 SUV 추천해줘')}>가족용 SUV</button>
          <button onClick={() => setQuery('연비 좋은 차량')}>연비 좋은 차량</button>
          <button onClick={() => setQuery('고급 세단')}>고급 세단</button>
        </div>

        {/* 🚗 추천 결과 */}
        {recommendations.length > 0 && (
          <div className="results-section">
            <h2>🎯 AI 추천 결과</h2>
            <div className="car-grid">
              {recommendations.map((car) => (
                <div key={car.id} className="car-card" onClick={() => goToDetail(car.id)}>
                  <div className="car-image-wrap">
                    <img src={car.mainImage || '/cars/car1.png'} alt={car.name} />
                  </div>
                  <div className="car-detail">
                    <h3>{car.name}</h3>
                    <p className="price">{parseInt(car.price).toLocaleString()}만원</p>
                    <div className="match-reason">
                      💡 <strong>추천 이유:</strong> {car.matchReason}
                    </div>
                    <div className="specs">
                      <span>{car.year}년식</span>
                      <span>{car.mileage}km</span>
                      <span>{car.fuelType}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          overflow-y: scroll;
        }

        body {
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow-y: auto;
          height: auto;
        }

        .ai-recommend-page {
          padding-top: 80px;
          padding-bottom: 60px;
          min-height: 100vh;
          overflow-y: visible;
        }

        /* 🔝 상단 메뉴 */
        .top-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 5%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(50, 50, 80, 0.5));
          backdrop-filter: blur(10px);
          z-index: 100;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
        }

        .menu-logo {
          font-size: 24px;
          font-weight: bold;
          color: #fff;
          letter-spacing: 2px;
        }

        .menu-items {
          display: flex;
          gap: 30px;
        }

        .menu-item {
          color: #ddd;
          font-size: 15px;
          cursor: pointer;
          transition: color 0.2s;
          position: relative;
        }

        .menu-item:hover {
          color: #fff;
        }

        .menu-item.active {
          color: #4fc3f7;
          font-weight: bold;
        }

        .menu-item.active::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #4fc3f7;
        }

        /* 🎯 타이틀 */
        .title-section {
          text-align: center;
          padding: 40px 20px 20px;
          color: #fff;
        }

        .title-section h1 {
          font-size: 42px;
          margin-bottom: 10px;
        }

        .title-section p {
          font-size: 16px;
          opacity: 0.9;
        }

        /* 🔍 입력 영역 */
        .input-section {
          max-width: 700px;
          margin: 30px auto;
          padding: 0 20px;
        }

        .input-section textarea {
          width: 100%;
          padding: 20px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          resize: none;
          margin-bottom: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .input-section button {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .input-section button:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .input-section button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* 📌 예시 검색어 */
        .example-queries {
          max-width: 700px;
          margin: 20px auto;
          padding: 0 20px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .example-queries span {
          color: #fff;
          font-weight: bold;
        }

        .example-queries button {
          padding: 8px 15px;
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .example-queries button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* 🚗 추천 결과 */
        .results-section {
          max-width: 1200px;
          margin: 50px auto 0;
          padding: 0 20px;
        }

        .results-section h2 {
          color: #fff;
          font-size: 32px;
          margin-bottom: 30px;
          text-align: center;
        }

        .car-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
          padding-bottom: 40px;
        }

        .car-card {
          background: #fff;
          border-radius: 15px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .car-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .car-image-wrap {
          width: 100%;
          height: 200px;
          background: #f5f5f5;
          overflow: hidden;
        }

        .car-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .car-detail {
          padding: 20px;
        }

        .car-detail h3 {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .car-detail .price {
          color: #667eea;
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .match-reason {
          background: #f0f4ff;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 15px;
          line-height: 1.6;
        }

        .match-reason strong {
          color: #667eea;
        }

        .specs {
          display: flex;
          gap: 8px;
          font-size: 12px;
          color: #666;
          flex-wrap: wrap;
        }

        .specs span {
          background: #f0f0f0;
          padding: 5px 10px;
          border-radius: 5px;
        }
      `}</style>
    </>
  );
}
