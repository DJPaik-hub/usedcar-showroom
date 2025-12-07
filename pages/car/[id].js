import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

function CarDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchCarDetail() {
      if (!id) return;
      
      try {
        const response = await fetch('/api/cars');
        const result = await response.json();
        
        if (result.success) {
          const foundCar = result.data.find(c => c.id === parseInt(id));
          setCar(foundCar);
          if (foundCar) {
            setSelectedImage(foundCar.mainImage);
          }
        }
      } catch (error) {
        console.error('차량 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCarDetail();
  }, [id]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '24px'
      }}>
        로딩 중...
      </div>
    );
  }

  if (!car) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '24px'
      }}>
        차량을 찾을 수 없습니다
      </div>
    );
  }

  return (
    <div>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Arial, sans-serif;
          background: #f5f5f5;
        }
        .top-menu {
          position: fixed; top: 0; left: 0; width: 100%; height: 70px;
          background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; z-index: 1000;
        }
        .logo { font-size: 28px; font-weight: 700; color: #fff; cursor: pointer; }
        .logo:hover { color: #ffd700; }
        .menu-items { display: flex; gap: 35px; }
        .menu-item {
          color: #fff; font-size: 16px; cursor: pointer;
          padding: 8px 16px; border-radius: 6px; transition: all 0.3s;
        }
        .menu-item:hover { color: #ffd700; background: rgba(255, 255, 255, 0.1); }
        
        .detail-container {
          max-width: 1200px; margin: 100px auto 60px;
          padding: 0 20px;
        }
        
        .back-button {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; margin-bottom: 30px;
          background: white; border: 2px solid #667eea; border-radius: 8px;
          color: #667eea; font-size: 16px; font-weight: 600;
          cursor: pointer; transition: all 0.3s;
        }
        .back-button:hover {
          background: #667eea; color: white;
          transform: translateX(-5px);
        }
        
        .content-wrapper {
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
          background: white; border-radius: 16px;
          padding: 40px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }
        
        @media (max-width: 900px) {
          .content-wrapper { grid-template-columns: 1fr; }
        }
        
        .image-section {
          display: flex; flex-direction: column; gap: 20px;
        }
        
        .main-image {
          width: 100%; height: 400px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        
        .main-image img {
          width: 100%; height: 100%; object-fit: cover;
        }
        
        .info-section {
          display: flex; flex-direction: column; gap: 25px;
        }
        
        .title-price {
          border-bottom: 2px solid #f0f0f0; padding-bottom: 20px;
        }
        
        .car-title {
          font-size: 32px; font-weight: 800; color: #333;
          margin-bottom: 15px; line-height: 1.2;
        }
        
        .car-price {
          font-size: 36px; font-weight: 800; color: #667eea;
        }
        
        .specs-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 15px;
        }
        
        .spec-item {
          display: flex; flex-direction: column; gap: 5px;
          padding: 15px; background: #f8f9fa; border-radius: 8px;
        }
        
        .spec-label {
          font-size: 13px; color: #888; font-weight: 500;
        }
        
        .spec-value {
          font-size: 16px; color: #333; font-weight: 700;
        }
        
        .description-section {
          margin-top: 10px;
        }
        
        .section-title {
          font-size: 18px; font-weight: 700; color: #333;
          margin-bottom: 12px;
        }
        
        .description-text {
          font-size: 15px; line-height: 1.7; color: #555;
        }
        
        .action-buttons {
          display: flex; gap: 15px; margin-top: 20px;
        }
        
        .report-button {
          flex: 1; padding: 16px; background: #667eea; color: white;
          font-size: 18px; font-weight: 700; border: none; border-radius: 10px;
          cursor: pointer; transition: all 0.3s;
        }
        
        .report-button:hover {
          background: #5568d3; transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .list-button {
          flex: 1; padding: 16px; background: white; color: #667eea;
          font-size: 18px; font-weight: 700;
          border: 2px solid #667eea; border-radius: 10px;
          cursor: pointer; transition: all 0.3s;
        }
        
        .list-button:hover {
          background: #f0f2ff;
        }
        
        .badge {
          display: inline-block; padding: 6px 12px;
          background: #e8f4f8; color: #1e90ff;
          font-size: 13px; font-weight: 600; border-radius: 6px;
          margin-right: 8px;
        }

        .gallery-section {
          background: white; border-radius: 16px;
          padding: 40px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .gallery-title {
          font-size: 24px; font-weight: 700; color: #333;
          margin-bottom: 25px;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        @media (max-width: 600px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .gallery-item {
          width: 100%; height: 200px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px; overflow: hidden;
          cursor: pointer; transition: all 0.3s;
          border: 3px solid transparent;
        }

        .gallery-item:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .gallery-item.selected {
          border-color: #667eea;
          box-shadow: 0 0 0 2px #667eea;
        }

        .gallery-item img {
          width: 100%; height: 100%; object-fit: cover;
        }
      `}</style>

      <nav className="top-menu">
        <div className="logo" onClick={() => router.push('/')}>PREMIUM SHOWROOM</div>
        <div className="menu-items">
          <div className="menu-item" onClick={() => router.push('/')}>쇼룸</div>
          <div className="menu-item" onClick={() => router.push('/inventory')}>차량 목록</div>
          <div className="menu-item" onClick={() => router.push('/ai-recommend')}>AI 추천</div>
          <div className="menu-item" onClick={() => router.push('/seller')}>판매자 정보</div>
        </div>
      </nav>

      <div className="detail-container">
        <button className="back-button" onClick={() => router.back()}>
          ← 목록으로 돌아가기
        </button>

        <div className="content-wrapper">
          <div className="image-section">
            <div className="main-image">
              <img src={selectedImage} alt={car.name} />
            </div>
            <div>
              <span className="badge">사고 이력 무</span>
              <span className="badge">침수 이력 무</span>
              <span className="badge">정비 이력 확인</span>
            </div>
          </div>

          <div className="info-section">
            <div className="title-price">
              <h1 className="car-title">{car.name}</h1>
              <div className="car-price">{car.price.toLocaleString()}원</div>
            </div>

            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">차량 종류</span>
                <span className="spec-value">{car.carType}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">연식</span>
                <span className="spec-value">{car.year}년</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">출고일</span>
                <span className="spec-value">{car.releaseDate}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">주행거리</span>
                <span className="spec-value">{car.mileage.toLocaleString()}km</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">연료</span>
                <span className="spec-value">{car.fuelType}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">변속기</span>
                <span className="spec-value">{car.transmission}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">배기량</span>
                <span className="spec-value">{car.displacement}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">색상</span>
                <span className="spec-value">{car.color}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">승차 인원</span>
                <span className="spec-value">{car.passengers}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">등록일</span>
                <span className="spec-value">{car.registeredDate}</span>
              </div>
            </div>

            <div className="description-section">
              <div className="section-title">차량 설명</div>
              <p className="description-text">{car.description}</p>
            </div>

            <div className="action-buttons">
              <button 
                className="report-button"
                onClick={() => window.open(car.performanceReport, '_blank')}
              >
                📋 성능기록부 확인하기
              </button>
              <button className="list-button" onClick={() => router.push('/inventory')}>
                차량 목록 보기
              </button>
            </div>
          </div>
        </div>

        {car.images && car.images.length > 0 && (
          <div className="gallery-section">
            <h2 className="gallery-title">차량 상세 이미지</h2>
            <div className="gallery-grid">
              {car.images.map((image, index) => (
                <div 
                  key={index}
                  className={`gallery-item ${selectedImage === image ? 'selected' : ''}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt={`${car.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarDetail;
