export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // 1. Google Sheets에서 차량 데이터 가져오기
    const SHEET_ID = '1O20FPRuyN3ZAZ_z_Ho1kBGz7Gqw4P9CXvzbWY3dAjcQ';
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
    
    const sheetResponse = await fetch(SHEET_URL);
    const csvText = await sheetResponse.text();
    
    // CSV 파싱
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const allCars = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const car = {};
      headers.forEach((h, idx) => {
        let value = values[idx] ? values[idx].trim() : '';
        if (h === 'id' || h === 'price' || h === 'year' || h === 'mileage') {
          value = parseInt(value) || 0;
        }
        car[h] = value;
      });
      if (car.status === '판매중') {
        allCars.push(car);
      }
    }

    // 2. n8n AI 추천 호출
    const N8N_URL = 'https://n8n-study-1zwz.onrender.com/webhook/ai-recommend';
    const n8nResponse = await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(30000)
    });

    const n8nData = await n8nResponse.json();

// 3. AI 추천과 실제 차량 데이터 매칭
if (n8nData.success && n8nData.recommendations) {
  const enrichedRecommendations = n8nData.recommendations.map(rec => {
    const car = allCars.find(c => c.id === rec.id || parseInt(c.id) === rec.id);
    if (car) {
      return {
        id: car.id,
        name: car.name,
        price: car.price,
        year: car.year,
        mileage: car.mileage,
        fuelType: car.fuelType,
        carType: car.carType,
        mainImage: car.mainImage,
        matchReason: rec.matchReason
      };
    }
    return null;
  }).filter(r => r !== null);

  // 추천 결과가 있으면 반환
  if (enrichedRecommendations.length > 0) {
    return res.status(200).json({
      success: true,
      recommendations: enrichedRecommendations
    });
  }
}

// AI 추천 실패 또는 빈 결과 → 기본 추천
const fallbackRecommendations = allCars.slice(0, 3).map(car => ({
  id: car.id,
  name: car.name,
  price: car.price,
  year: car.year,
  mileage: car.mileage,
  fuelType: car.fuelType,
  carType: car.carType,
  mainImage: car.mainImage,
  matchReason: `${query}에 적합할 수 있는 차량입니다.`
}));

return res.status(200).json({
  success: true,
  recommendations: fallbackRecommendations
});


    // n8n 실패 시 전체 목록 반환
    return res.status(200).json({
      success: true,
      recommendations: allCars.slice(0, 3).map(car => ({
        ...car,
        matchReason: `${query}에 적합한 차량입니다.`
      }))
    });

  } catch (error) {
    console.error('오류:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
