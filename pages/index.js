import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://docs.google.com/spreadsheets/d/1O20FPRuyN3ZAZ_z_Ho1kBGz7Gqw4P9CXvzbWY3dAjcQ/export?format=csv&gid=0')
      .then(res => res.text())
      .then(csv => {
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        const carData = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',');
          const car = {};
          headers.forEach((h, idx) => {
            car[h.trim()] = values[idx]?.trim();
          });
          if (car.status === '판매중') {
            carData.push(car);
          }
        }
        setCars(carData);
        setLoading(false);
      })
      .catch(err => {
        console.error('차량 데이터 로드 실패:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; }
        .header { background: white; padding: 24px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 40px; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 16px; color: #111; }
        .nav { display: flex; gap: 24px; }
        .nav a { color: #666; text-decoration: none; font-weight: 500; }
        .nav a:hover { color: #2563eb; }
        .title { font-size: 28px; font-weight: bold; margin-bottom: 32px; color: #111; }
        .car-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-bottom: 48px; }
        .car-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); cursor: pointer; transition: all 0.3s; }
        .car-card:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.12); }
        .car-image { width: 100%; height: 200px; background: #f3f4f6; position: relative; overflow: hidden; }
        .car-image img { width: 100%; height: 100%; object-fit: cover; }
        .car-info { padding: 20px; }
        .car-name { font-weight: 700; font-size: 18px; margin-bottom: 8px; color: #111; }
        .car-details { color: #6b7280; font-size: 14px; margin-bottom: 12px; }
        .car-price { color: #2563eb; font-weight: 700; font-size: 20px; }
        .ai-section { text-align: center; padding: 48px 0; }
        .ai-button { display: inline-block; padding: 16px 40px; background: #2563eb; color: white; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; transition: background 0.3s; }
        .ai-button:hover { background: #1d4ed8; }
        .loading { text-align: center; padding: 60px 20px; color: #6b7280; font-size: 16px; }
      `}</style>

      <div className="header">
        <div className="container">
          <div className="logo">SHOWROOM</div>
          <nav className="nav">
            <a href="/">홈</a>
            <a href="/inventory">차량 목록</a>
            <a href="/ai-recommend">AI 추천</a>
            <a href="/seller-info">판매자 정보</a>
          </nav>
        </div>
      </div>

      <div className="container">
        <h2 className="title">추천 차량</h2>

        {loading ? (
          <div className="loading">차량 정보를 불러오는 중...</div>
        ) : cars.length === 0 ? (
          <div className="loading">판매 중인 차량이 없습니다.</div>
        ) : (
          <div className="car-grid">
            {cars.slice(0, 4).map((car) => (
              <div 
                key={car.id} 
                className="car-card"
                onClick={() => router.push(`/car/${car.id}`)}
              >
                <div className="car-image">
                  <img 
                    src={car.mainImage || '/cars/placeholder.png'} 
                    alt={car.name || 'Car'}
                    onError={(e) => { e.target.src = '/cars/placeholder.png'; }}
                  />
                </div>
                <div className="car-info">
                  <div className="car-name">{car.name}</div>
                  <div className="car-details">
                    {car.year}년식 | {car.mileage?.toLocaleString()}km
                  </div>
                  <div className="car-price">
                    {parseInt(car.price || 0).toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="ai-section">
          <a href="/ai-recommend" className="ai-button">
            AI 차량 추천 받기
          </a>
        </div>
      </div>
    </>
  );
}
