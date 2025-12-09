import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const cars = [
    { id: 1, name: 'Car 1', price: '6000만원', image: '/cars/car1.png' },
    { id: 2, name: 'Car 2', price: '12000만원', image: '/cars/car2.png' },
    { id: 3, name: 'Car 3', price: '18000만원', image: '/cars/car3.png' },
    { id: 4, name: 'Car 4', price: '26000만원', image: '/cars/car4.png' }
  ];

  const shown = cars.slice(0, 4);

  const slots = {
    leftNear: shown[0],
    leftMid: shown[1],
    rightFar: shown[2],
    rightMid: shown[3]
  };

  const goToDetail = (carId) => {
    router.push(`/car/${carId}`);
  };

  return (
    <>
      <style jsx global>{`
        body { overflow: hidden; }
        
        .showroom-wrapper {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: url('/bg-showroom.jpg') center/cover no-repeat;
          overflow: hidden;
        }

        .top-menu {
          position: fixed; top: 0; left: 0; width: 100%; height: 60px;
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 5%;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(50, 50, 80, 0.5));
          backdrop-filter: blur(10px); z-index: 100;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
        }
        .menu-logo { font-size: 24px; font-weight: bold; color: #fff; letter-spacing: 2px; }
        .menu-items { display: flex; gap: 30px; }
        .menu-item { color: #ddd; font-size: 15px; cursor: pointer; transition: color 0.2s; position: relative; }
        .menu-item:hover { color: #fff; }
        .menu-item.active { color: #4fc3f7; font-weight: bold; }
        .menu-item.active::after {
          content: ''; position: absolute; bottom: -5px; left: 0;
          width: 100%; height: 2px; background: #4fc3f7;
        }

        .vehicle-card {
          position: absolute;
          width: 360px;
          transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.2));
        }

        .slot-left-near { left: 8%; bottom: 10%; transform: scale(1.1); z-index: 2; }
        .slot-left-mid { left: 25%; bottom: 25%; transform: scale(0.75); z-index: 1; }
        .slot-right-far { right: 25%; bottom: 25%; transform: scale(0.62); z-index: 0; }
        .slot-right-mid { right: 8%; bottom: 10%; transform: scale(0.78); z-index: 1; }

        .vehicle-card:hover {
          transform: translateY(-30px) scale(1.15) !important;
          filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))
                  drop-shadow(0 0 80px rgba(255, 215, 0, 0.9))
                  drop-shadow(0 0 120px rgba(255, 200, 0, 0.6)) !important;
          z-index: 50 !important;
        }

        .vehicle-image { 
          width: 100%; 
          object-fit: contain; 
          display: block;
          position: relative;
        }

        .vehicle-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.9);
          padding: 20px 35px;
          border-radius: 15px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
          border: 2px solid rgba(255, 215, 0, 0.4);
          z-index: 999;
        }

        .vehicle-card:hover .vehicle-overlay { opacity: 1; }

        .vehicle-overlay p { margin: 0; color: #fff; text-align: center; }
        .vehicle-title { font-weight: bold; font-size: 22px; margin-bottom: 8px; }
        .vehicle-cost { color: #ffd700; font-size: 20px; font-weight: 600; }
      `}</style>

      <div className="showroom-wrapper">
        <nav className="top-menu">
          <div className="menu-logo">SHOWROOM</div>
          <div className="menu-items">
            <div className="menu-item active" onClick={() => router.push('/')}>쇼룸</div>
            <div className="menu-item" onClick={() => router.push('/inventory')}>차량 목록</div>
            <div className="menu-item" onClick={() => router.push('/ai-recommend')}>AI 추천</div>
            <div className="menu-item" onClick={() => router.push('/seller')}>판매자 정보</div>
          </div>
        </nav>

        {slots.leftNear && (
          <div className="vehicle-card slot-left-near" onClick={() => goToDetail(slots.leftNear.id)}>
            <img src={slots.leftNear.image} alt={slots.leftNear.name} className="vehicle-image" />
            <div className="vehicle-overlay">
              <p className="vehicle-title">{slots.leftNear.name}</p>
              <p className="vehicle-cost">{slots.leftNear.price}</p>
            </div>
          </div>
        )}

        {slots.leftMid && (
          <div className="vehicle-card slot-left-mid" onClick={() => goToDetail(slots.leftMid.id)}>
            <img src={slots.leftMid.image} alt={slots.leftMid.name} className="vehicle-image" />
            <div className="vehicle-overlay">
              <p className="vehicle-title">{slots.leftMid.name}</p>
              <p className="vehicle-cost">{slots.leftMid.price}</p>
            </div>
          </div>
        )}

        {slots.rightFar && (
          <div className="vehicle-card slot-right-far" onClick={() => goToDetail(slots.rightFar.id)}>
            <img src={slots.rightFar.image} alt={slots.rightFar.name} className="vehicle-image" />
            <div className="vehicle-overlay">
              <p className="vehicle-title">{slots.rightFar.name}</p>
              <p className="vehicle-cost">{slots.rightFar.price}</p>
            </div>
          </div>
        )}

        {slots.rightMid && (
          <div className="vehicle-card slot-right-mid" onClick={() => goToDetail(slots.rightMid.id)}>
            <img src={slots.rightMid.image} alt={slots.rightMid.name} className="vehicle-image" />
            <div className="vehicle-overlay">
              <p className="vehicle-title">{slots.rightMid.name}</p>
              <p className="vehicle-cost">{slots.rightMid.price}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
