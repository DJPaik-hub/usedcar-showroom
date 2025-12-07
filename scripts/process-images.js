const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const REMOVEBG_API_KEY = 'u76gi2o3JASsP5whhyJz5i64';
const UPLOAD_DIR = path.join(__dirname, '../public/cars/upload');
const OUTPUT_DIR = path.join(__dirname, '../public/cars');

console.log('=== 이미지 자동 처리 시작 ===');
console.log('📁 업로드 폴더:', UPLOAD_DIR);
console.log('📁 출력 폴더:', OUTPUT_DIR);

// 폴더 생성
if (!fs.existsSync(UPLOAD_DIR)) {
  console.log('❌ 업로드 폴더가 없습니다. 생성 중...');
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log('✅ 업로드 폴더 생성 완료');
}

// 파일 목록 확인
console.log('\n🔍 이미지 스캔 중...');
const files = fs.readdirSync(UPLOAD_DIR);
console.log('📂 폴더 내 전체 파일:', files);

const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));
console.log('🖼️  이미지 파일:', imageFiles);

if (imageFiles.length === 0) {
  console.log('\n📭 처리할 이미지가 없습니다.');
  console.log('💡 public/cars/upload/ 폴더에 이미지를 추가하세요.');
  process.exit(0);
}

// 배경 제거 함수
async function removeBackground(inputPath, outputPath) {
  console.log('  🔄 배경 제거 중...');
  return new Promise((resolve, reject) => {
    const imageData = fs.readFileSync(inputPath);
    const base64Image = imageData.toString('base64');
    
    const postData = JSON.stringify({
      image_file_b64: base64Image,
      size: 'auto'
    });
    
    const options = {
      method: 'POST',
      hostname: 'api.remove.bg',
      path: '/v1.0/removebg',
      headers: {
        'X-Api-Key': REMOVEBG_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      console.log('  📡 API 응답 코드:', res.statusCode);
      
      if (res.statusCode === 200) {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          fs.writeFileSync(outputPath, Buffer.concat(chunks));
          console.log('  ✅ 배경 제거 완료');
          resolve(outputPath);
        });
      } else {
        let errorMsg = '';
        res.on('data', (chunk) => errorMsg += chunk);
        res.on('end', () => {
          console.error('  ❌ remove.bg 오류:', errorMsg);
          reject(new Error(`API 오류: ${res.statusCode}`));
        });
      }
    });

    req.on('error', (err) => {
      console.error('  ❌ 네트워크 오류:', err.message);
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}

// 이미지 리사이징
async function resizeImage(inputPath, outputPath, width, height) {
  console.log(`  🔄 리사이징 중 (${width}x${height})...`);
  await sharp(inputPath)
    .resize(width, height, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(outputPath);
  console.log('  ✅ 리사이징 완료');
}

// 메인 처리 함수
async function processImages() {
  for (const file of imageFiles) {
    try {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`🖼️  처리 중: ${file}`);
      
      const carName = path.parse(file).name;
      const carDir = path.join(OUTPUT_DIR, carName);
      
      console.log(`📁 차량 폴더: ${carName}/`);
      
      if (!fs.existsSync(carDir)) {
        fs.mkdirSync(carDir, { recursive: true });
        console.log('  ✅ 폴더 생성');
      }

      const inputPath = path.join(UPLOAD_DIR, file);
      const bgRemovedPath = path.join(carDir, 'temp-no-bg.png');
      const mainImagePath = path.join(carDir, 'main.png');
      const thumbnailPath = path.join(carDir, 'thumbnail.png');

      // 1. 배경 제거
      await removeBackground(inputPath, bgRemovedPath);

      // 2. 메인 이미지 (800x600)
      await resizeImage(bgRemovedPath, mainImagePath, 800, 600);

      // 3. 썸네일 (400x300)
      await resizeImage(bgRemovedPath, thumbnailPath, 400, 300);

      // 임시 파일 삭제
      fs.unlinkSync(bgRemovedPath);

      // 원본 파일 삭제
      fs.unlinkSync(inputPath);

      console.log(`\n✅ ${carName} 처리 완료!`);
      console.log(`   📂 /cars/${carName}/main.png`);
      console.log(`   📂 /cars/${carName}/thumbnail.png`);

    } catch (error) {
      console.error(`\n❌ 오류 발생: ${file}`);
      console.error('   에러:', error.message);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ 모든 이미지 처리 완료!\n');
}

// 실행
processImages().catch(err => {
  console.error('❌ 치명적 오류:', err);
  process.exit(1);
});
