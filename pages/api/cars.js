export default async function handler(req, res) {
  try {
    const SHEET_ID = '1O20FPRuyN3ZAZ_z_Ho1kBGz7Gqw4P9CXvzbWY3dAjcQ';
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

    const response = await fetch(SHEET_URL);
    const csvText = await response.text();

    // 쉼표로 구분 (CSV 표준)
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    const cars = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      // CSV 파싱 (쉼표 구분, 따옴표 처리)
      const values = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
      const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());
      
      const car = {};
      
      headers.forEach((header, index) => {
        const key = header;
        let value = cleanValues[index] || '';
        
        // 숫자 변환
        if (key === 'id' || key === 'price' || key === 'year' || key === 'mileage') {
          value = parseInt(value) || 0;
        }
        
        // 이미지 배열 변환
        if (key === 'images' && value) {
          value = value.split(',').map(img => img.trim());
        }
        
        car[key] = value;
      });
      
      // 판매중인 차량만 (status 체크)
      if (car.status === '판매중' || !car.status) {
        cars.push(car);
      }
    }

    res.status(200).json({ success: true, data: cars, count: cars.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
