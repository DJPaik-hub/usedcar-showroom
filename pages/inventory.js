import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Inventory() {
  const router = useRouter();
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carType, setCarType] = useState('전체');
  const [sortBy, setSortBy] = useState('등록순');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Google Sheets에서 데이터 가져오기
  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await fetch('/api/cars');
        const result = await response.json();
        
        if (result.success) {
          setAllCars(result.data);
        }
      } catch (error) {
        console.error('차량 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCars();
  }, []);

  // 필터링
  let filtered = allCars;
  if (carType !== '전체') {
    filtered = filtered.filter(car => car.carType === carType);
  }

  // 검색
  if (searchKeyword) {
    filtered = filtered.filter(car =>
      car.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }

  // 정렬
  if (sortBy === '낮은 가격') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === '높은 가격') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === '최신순') {
    filtered = [...filtered].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  } else if (sortBy === '등록순') {
    filtered = [...filtered].sort((a, b) => new Date(b.registeredDate) - new Date(a.registeredDate));
  }

  const goToDetail = (carId) => {
    router.push(`/car/${carId}`);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        background: '#f8f9fa'
      }}>
        차량 데이터 로딩 중...
      </div>
    );
  }

  return (
    <>
      <nav className="top-menu">
        <div className="menu-logo">SHOWROOM</div>
        <div className="menu-items">
          <div className="menu-item" onClick={() => router.push('/')}>쇼룸</div>
          <div className="menu-item active">차량 목록</div>
          <div className="menu-item" onClick={() => router.push('/ai-recommend')}>AI 추천</div>
          <div className="menu-item" onClick={() => router.push('/seller')}>판매자 정보</div>
        </div>
      </nav>

      <div className="inventory-page">
        <div className="title-section">
          <h1>판매 중인 차량</h1>
          <p>총 {filtered.length}대의 차량이 있습니다</p>
        </div>

        <div className="filter-bar">
          <div className="car-type-tabs">
            {['전체', '경차', '소형차', '중형차', '준대형차', '대형차', 'SUV'].map(type => (
              <button
                key={type}
                className={carType === type ? 'active' : ''}
                onClick={() => setCarType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="sort-search">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="등록순">등록순</option>
              <option value="최신순">최신 출시순</option>
              <option value="낮은 가격">낮은 가격순</option>
              <option value="높은 가격">높은 가격순</option>
            </select>

            <input
              type="text"
              placeholder="차량명 검색..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>

        <div className="car-grid">
          {filtered.map(car => (
            <div key={car.id} className="car-card" onClick={() => goToDetail(car.id)}>
              <div className="car-image-wrap">
                <img src={car.mainImage} alt={car.name} />
              </div>
              <div className="car-detail">
                <h3>{car.name}</h3>
                <p className="price">{car.price.toLocaleString()}원</p>
                <div className="specs">
                  <span>{car.year}년식</span>
                  <span>{car.mileage.toLocaleString()}km</span>
                  <span>{car.fuelType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { overflow-y: scroll; }
        body { font-family: 'Segoe UI', sans-serif; background: #f8f9fa; overflow-y: auto; height: auto; }
        .inventory-page { padding-top: 80px; padding-bottom: 60px; min-height: 100vh; overflow-y: visible; }
        .top-menu { position: fixed; top: 0; left: 0; width: 100%; height: 60px; display: flex; justify-content: space-between; align-items: center; padding: 0 5%; background: linear-gradient(135deg, rgba(0,0,0,0.6), rgba(50,50,80,0.5)); backdrop-filter: blur(10px); z-index: 100; box-shadow: 0 2px 15px rgba(0,0,0,0.3); }
        .menu-logo { font-size: 24px; font-weight: bold; color: #fff; letter-spacing: 2px; }
        .menu-items { display: flex; gap: 30px; }
        .menu-item { color: #ddd; font-size: 15px; cursor: pointer; transition: color 0.2s; position: relative; }
        .menu-item:hover { color: #fff; }
        .menu-item.active { color: #4fc3f7; font-weight: bold; }
        .menu-item.active::after { content: ''; position: absolute; bottom: -5px; left: 0; width: 100%; height: 2px; background: #4fc3f7; }
        .title-section { text-align: center; padding: 40px 20px 20px; }
        .title-section h1 { font-size: 36px; margin-bottom: 10px; }
        .title-section p { color: #666; font-size: 16px; }
        .filter-bar { max-width: 1200px; margin: 0 auto 40px; padding: 0 20px; }
        .car-type-tabs { display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; }
        .car-type-tabs button { padding: 10px 20px; border: 1px solid #ddd; background: #fff; border-radius: 25px; cursor: pointer; transition: all 0.2s; }
        .car-type-tabs button:hover { background: #f0f0f0; }
        .car-type-tabs button.active { background: #4fc3f7; color: #fff; border-color: #4fc3f7; }
        .sort-search { display: flex; gap: 10px; }
        .sort-search select, .sort-search input { padding: 10px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
        .sort-search input { flex: 1; }
        .car-grid { max-width: 1200px; margin: 0 auto; padding: 0 20px 60px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; }
        .car-card { background: #fff; border-radius: 12px; overflow: hidden; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s, box-shadow 0.2s; }
        .car-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
        .car-image-wrap { width: 100%; height: 180px; background: #f5f5f5; overflow: hidden; }
        .car-image-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .car-detail { padding: 15px; }
        .car-detail h3 { font-size: 16px; margin-bottom: 8px; }
        .car-detail .price { color: #4fc3f7; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .specs { display: flex; gap: 8px; font-size: 12px; color: #666; }
        .specs span { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; }
        @media (max-width: 1024px) { .car-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .car-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .car-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
