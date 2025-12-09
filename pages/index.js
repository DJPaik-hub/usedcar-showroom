import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Google Sheets에서 차량 데이터 가져오기
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
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">SHOWROOM</h1>
          <nav className="mt-4 flex gap-4">
            <Link href="/" className="text-blue-600 font-semibold">홈</Link>
            <Link href="/inventory" className="text-gray-600 hover:text-blue-600">차량 목록</Link>
            <Link href="/ai-recommend" className="text-gray-600 hover:text-blue-600">AI 추천</Link>
            <Link href="/seller-info" className="text-gray-600 hover:text-blue-600">판매자 정보</Link>
          </nav>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">추천 차량</h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">차량 정보를 불러오는 중...</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">판매 중인 차량이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.slice(0, 4).map((car) => (
              <Link href={`/car/${car.id}`} key={car.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="relative w-full h-48 bg-gray-100">
                    <Image
                      src={car.mainImage || '/cars/placeholder.png'}
                      alt={car.name || 'Car'}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{car.name}</h3>
                    <p className="text-gray-600 text-sm mb-1">
                      {car.year}년식 | {car.mileage}km
                    </p>
                    <p className="text-blue-600 font-bold text-xl">
                      {parseInt(car.price || 0).toLocaleString()}원
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* AI 추천 버튼 */}
        <div className="mt-12 text-center">
          <Link 
            href="/ai-recommend"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            AI 차량 추천 받기
          </Link>
        </div>
      </main>
    </div>
  );
}
