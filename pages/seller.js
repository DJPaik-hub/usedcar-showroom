import { useRouter } from 'next/router';

function Seller() {
  const router = useRouter();

  return (
    <div className="seller-page">
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
          <div className="menu-item" onClick={() => router.push('/ai-recommend')}>
            AI 추천
          </div>
          <div className="menu-item active">판매자 정보</div>
        </div>
      </nav>

      {/* 📄 컨텐츠 */}
      <div className="content-wrap">
        {/* 쇼룸 이름 */}
        <section className="intro-section">
          <h1>🚗 프리미엄 중고차 쇼룸</h1>
          <p className="subtitle">(가제)</p>
          <p className="description">
            고객님께 최상의 중고차 구매 경험을 제공하기 위해 최선을 다하고 있습니다.
          </p>
        </section>

        {/* 판매자 정보 */}
        <section className="info-section">
          <h2>👤 판매자 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">대표자명</span>
              <span className="value">000</span>
            </div>
            <div className="info-item">
              <span className="label">소속</span>
              <span className="value">00모터스</span>
            </div>
          </div>
        </section>

        {/* 연락처 */}
        <section className="info-section">
          <h2>📞 연락처</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">전화번호</span>
              <span className="value">010-0000-0000</span>
            </div>
          </div>
        </section>

        {/* 주소 & 영업시간 */}
        <section className="info-section">
          <h2>🏢 쇼룸 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">주소</span>
              <span className="value">경기도 수원시 권선구 서부로 1738 (중고차 단지)</span>
            </div>
            <div className="info-item">
              <span className="label">영업시간</span>
              <span className="value">
                평일 09:00 - 19:00<br />
                주말 10:00 - 17:00<br />
                <span style={{ color: '#ff6b6b' }}>※ 공휴일 휴무</span>
              </span>
            </div>
          </div>
        </section>

        {/* 찾아오시는 길 */}
        <section className="info-section">
          <h2>🗺️ 찾아오시는 길</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3173.8876547285804!2d126.98395831531758!3d37.26326797984109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b5d3f3e3c3e3d%3A0x3e3c3e3d3f3e3c3d!2z7Iic7JuQIOykkeuPmOywqOyngOyynO2VmA!5e0!3m2!1sko!2skr!4v1234567890123!5m2!1sko!2skr"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="address-box">
            <p><strong>📍 주소:</strong> 경기도 수원시 권선구 서부로 1738 (중고차 단지)</p>
            <p><strong>🚗 주차:</strong> 쇼룸 내 무료 주차 가능</p>
            <p><strong>🚌 대중교통:</strong> 수원역에서 버스 이용 (약 20분 소요)</p>
          </div>
        </section>
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
          background: #f8f9fa;
          overflow-y: auto;
          height: auto;
        }

        .seller-page {
          padding-top: 60px;
          min-height: 100vh;
          overflow-y: visible;
          position: relative;
        }

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

        .content-wrap {
          max-width: 900px;
          margin: 0 auto;
          padding: 60px 20px 80px;
        }

        .intro-section {
          text-align: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          color: #fff;
          margin-bottom: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .intro-section h1 {
          font-size: 36px;
          margin-bottom: 10px;
        }

        .intro-section .subtitle {
          font-size: 14px;
          opacity: 0.8;
          margin-bottom: 20px;
        }

        .intro-section .description {
          font-size: 16px;
          line-height: 1.6;
          opacity: 0.95;
        }

        .info-section {
          background: #fff;
          padding: 30px;
          border-radius: 15px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }

        .info-section h2 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #333;
          border-bottom: 2px solid #4fc3f7;
          padding-bottom: 10px;
        }

        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
          align-items: flex-start;
        }

        .info-item .label {
          font-weight: bold;
          color: #555;
          min-width: 120px;
        }

        .info-item .value {
          flex: 1;
          text-align: right;
          color: #333;
          line-height: 1.6;
        }

        .map-container {
          margin-bottom: 20px;
        }

        .address-box {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          line-height: 1.8;
        }

        .address-box p {
          margin-bottom: 8px;
          color: #555;
        }

        .address-box strong {
          color: #333;
        }

        @media (max-width: 768px) {
          .intro-section h1 {
            font-size: 28px;
          }

          .info-item {
            flex-direction: column;
            gap: 8px;
          }

          .info-item .value {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}

export default Seller;
