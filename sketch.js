let characterSheet; // 載入單一的角色圖片資源
let attackSheet;    // 載入攻擊的圖片資源
let projectileSheet; // 載入投射物的圖片資源
let newCharacterSheet; // 載入新角色的圖片資源
let newCharacterSheet2; // 載入第二個新角色的圖片資源
let touchSheet11; // 載入角色3的觸碰動畫資源
let smileSheet10; // 載入角色2的微笑動畫資源
let fallDownSheet10; // 載入角色2的倒下動畫資源
let decorationSheet; // 載入裝飾動畫資源 (30/全.png)
let decorationSheet40; // 載入裝飾動畫資源 (40/全.png)

// --- 動畫資料庫 ---
// 集中管理所有動畫的設定
const animations = {
  idle: {
    img: null, // 預載入後設定
    frames: [0, 1, 2, 3, 4, 3, 2, 1], // 使用春麗的呼吸/站立畫格序列
    frameWidth: 192.4, // 2309 / 12
    frameHeight: 193,
    speed: 10, // 調整呼吸動畫速度
  },
  walk: {
    img: null, // 預載入後設定
    frames: [5, 6, 7, 8, 9, 10, 11], // 使用春麗的走路畫格序列
    frameWidth: 192.4, // 2309 / 12
    frameHeight: 193,
    speed: 5,
  },
  jump: {
    img: null, // 預載入後設定
    frames: [0], // 暫時使用站立畫格作為跳躍
    frameWidth: 192.4,
    frameHeight: 193,
    speed: 1,
    loops: false, // 跳躍動畫只播放一次
  },
  attack: {
    img: null, // 預載入後設定
    frames: [0, 1, 2, 3], // 播放所有攻擊畫格
    frameWidth: 154,         // 616 / 4
    frameHeight: 193,
    speed: 5,
    loops: false, // 攻擊動畫只播放一次
    projectileFrame: 2, // 在第3個畫格 (索引2) 發射投射物
  },
};

// --- 角色物件 ---
// 集中管理角色的所有狀態與屬性
const character = {
  x: 0,
  y: 0,
  vy: 0, // Vertical velocity (垂直速度)
  gravity: 0.8,
  jumpStrength: -20, // 跳躍力道 (負數向上)
  speed: 5,
  direction: 1, // 1: 右, -1: 左
  state: 'idle', // 'idle', 'walk', 'jump', 'attack'
  animationIndex: 0,
  previousState: 'idle', // 用於偵測狀態變化
  isOnGround: true,
  groundY: 0, // 地面高度
};

// --- 投射物管理 ---
const projectiles = [];
const projectileInfo = {
  img: null, // 預載入後設定
  speed: 10, // 投射物飛行速度
  frames: [0, 1, 2], // 使用月牙波的畫格
  frameWidth: 197, // 591 / 3
  frameHeight: 229,
  animationIndex: 0,
  animationSpeed: 6, // 投射物自身的動畫速度
};

// --- 新角色物件 ---
const newCharacter = {
  x: 0,
  y: 0,
  state: 'stop', // 'stop', 'smile'
  previousState: 'stop',
  animationIndex: 0,
  touchDistance: 150,
  displayText: "", // 要顯示的文字
  isVisible: true, // 控制角色是否可見
  animations: {
    stop: {
      img: null,
      frames: [0, 1, 2, 3, 4, 5, 6, 7],
      frameWidth: 467 / 8,
      frameHeight: 95,
      speed: 10,
    },
    smile: {
      img: null,
      // 假設 smile_10.png 也是 8 幀, 467x95
      frames: [0, 1, 2, 3, 4, 5, 6, 7],
      frameWidth: 467 / 8,
      frameHeight: 95,
      speed: 8,
    },
    fall: {
      img: null,
      frames: [0, 1, 2, 3],
      frameWidth: 375 / 4,
      frameHeight: 83,
      speed: 10,
      loops: false, // 只播放一次
    },
  },
};

// --- 第二個新角色物件 ---
const newCharacter2 = {
  x: 0,
  y: 0,
  direction: 1,
  state: 'stop', // 'stop', 'touch'
  previousState: 'stop',
  animationIndex: 0,
  touchDistance: 250, // 觸發狀態改變的距離 (增加距離)
  displayText: "", // 要顯示的文字
  showHint: false, // 是否顯示提示
  animations: {
    stop: {
      img: null,
      frames: [0, 1, 2, 3, 4, 5],
      frameWidth: 343 / 6,
      frameHeight: 40,
      speed: 10,
    },
    touch: {
      img: null,
      frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      frameWidth: 732 / 11,
      frameHeight: 69,
      speed: 8, // 可以為新動畫設定不同速度
    }
  },
};

// --- 裝飾動畫物件 ---
const decoration = {
  x: 0,
  y: 0,
  img: null,
  frames: [0, 1, 2, 3, 4, 5], // 6張照片
  frameWidth: 757 / 6, // 總寬度 757 除以 6
  frameHeight: 150,
  speed: 10,
  animationIndex: 0,
  displayText: "" // 新增文字屬性
};

// --- 裝飾動畫物件 40 ---
const decoration40 = {
  x: 0,
  y: 0,
  img: null,
  frames: [0, 1, 2, 3, 4, 5, 6, 7, 8], // 9張照片
  frameWidth: 472 / 9, // 總寬度 472 除以 9
  frameHeight: 80,
  speed: 10,
  animationIndex: 0,
  displayText: "", // 新增文字屬性
  isVisible: true // 新增可見屬性
};

// --- 互動相關變數 ---
let inputBox; // 用於文字輸入
let isChatting = false; // 是否正在與角色2互動
let quizTable; // 儲存從 CSV 載入的測驗題庫
let currentQuestionRow; // 當前抽到的題目行
let quizPhase = 'idle'; // 測驗的階段: 'idle', 'asking', 'feedback'
let bgImg; // 背景圖片變數
let bgImg2; // 第二張背景圖片變數
let lastAnswerWasCorrect = false; // 紀錄上一次回答是否正確
let hasWonFirstRound = false; // 新增：紀錄是否已答對過第一題 (解鎖左邊角色)
let hasWonSecondRound = false; // 新增：紀錄是否已答對過第二題 (解鎖最左邊角色)
let gameWon = false; // 遊戲是否勝利
let confetti = []; // 彩帶特效陣列

function preload() {
  // 載入春麗的角色圖片資源
  characterSheet = loadImage('2/全2.png');
  attackSheet = loadImage('4/全4.png'); // 角色攻擊動畫
  projectileSheet = loadImage('3/全3.png'); // 投射物動畫
  newCharacterSheet = loadImage('10/stop/stop_10.png'); // 載入新角色圖片
  smileSheet10 = loadImage('10/smile/smile_10.png'); // 載入角色2微笑動畫
  fallDownSheet10 = loadImage('10/fall_down/fall_down_10.png'); // 載入角色2倒下動畫
  newCharacterSheet2 = loadImage('11/stop/stop_11.png'); // 載入第二個新角色圖片
  touchSheet11 = loadImage('11/touch/touch_11.png'); // 載入角色3的觸碰動畫
  quizTable = loadTable('quiz.csv', 'csv', 'header'); // 載入測驗題庫
  decorationSheet = loadImage('30/全.png', null, (err) => {
    decorationSheet = null;
  }); // 載入裝飾動畫圖片，若失敗則設為 null
  decorationSheet40 = loadImage('40/全.png', null, (err) => {
    decorationSheet40 = null;
  }); // 載入裝飾動畫圖片 40，若失敗則設為 null
  bgImg = loadImage('20/background.jpg', null, (err) => {
    bgImg = null; // 如果載入失敗，將變數設為 null
  });
  // 載入第二張背景圖片 (資料夾 20 裡的 b)
  bgImg2 = loadImage('20/b.jpg', null, (err) => {
    bgImg2 = null;
  });
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 將載入的圖片連結到所有動畫
  animations.idle.img = characterSheet;
  animations.walk.img = characterSheet;
  animations.jump.img = characterSheet; // 跳躍暫時使用角色圖
  animations.attack.img = attackSheet;

  // 將載入的圖片連結到投射物
  projectileInfo.img = projectileSheet;

  // 初始化角色位置
  character.x = width / 2;
  // 將「地面」設定在畫面的垂直中心
  character.groundY = height / 2;
  character.y = character.groundY;

  // 初始化新角色的圖片與位置
  newCharacter.animations.stop.img = newCharacterSheet;
  newCharacter.animations.smile.img = smileSheet10;
  newCharacter.animations.fall.img = fallDownSheet10;
  // 將新角色放在主角色左邊
  newCharacter.x = character.x - 200;
  newCharacter.y = character.groundY;

  // 初始化第二個新角色的圖片與位置
  newCharacter2.animations.stop.img = newCharacterSheet2;
  newCharacter2.animations.touch.img = touchSheet11;
  newCharacter2.x = character.x + 200;
  newCharacter2.y = character.groundY;

  // 初始化裝飾動畫的位置 (放在左邊貓 newCharacter 的旁邊)
  decoration.img = decorationSheet;
  decoration.x = 200; // 放置在畫面最左邊 (往右移一點)
  decoration.y = character.groundY;

  // 初始化裝飾動畫 40 的位置 (放在米色人 decoration 與 橘色貓 newCharacter 中間)
  decoration40.img = decorationSheet40;
  decoration40.x = (decoration.x + newCharacter.x) / 2;
  decoration40.y = character.groundY;

  // 建立文字輸入框並隱藏
  inputBox = createInput();
  inputBox.position(-width, -height); // 先移出畫面外
  inputBox.size(150);
  inputBox.changed(onInputSubmit); // 綁定 Enter 事件
}

function draw() {
  // 設定背景顏色為 #d5bdaf
  if (bgImg) {
    background(bgImg); // 使用載入的圖片作為背景
  } else {
    background('#d5bdaf'); // 如果圖片載入失敗，使用預設顏色
  }

  // 在處理輸入前，先記錄當前的狀態
  character.previousState = character.state;

  // --- 1. 玩家輸入與狀態更新 ---

  // 只有在地面上且不處於攻擊狀態時，才處理移動/跳躍
  if (character.isOnGround && character.state !== 'attack') {
    if (keyIsDown(RIGHT_ARROW)) {
      character.direction = 1;
      character.state = 'walk';
      character.x += character.speed;
    } else if (keyIsDown(LEFT_ARROW)) {
      character.direction = -1;
      character.state = 'walk';
      character.x -= character.speed;
    } else {
      character.state = 'idle';
    }

    // 處理跳躍輸入
    if (keyIsDown(UP_ARROW)) {
      character.isOnGround = false;
      character.vy = character.jumpStrength;
      character.state = 'jump';
      character.animationIndex = 0; // 每次跳躍都從第一格動畫開始
    }

    // 處理攻擊輸入 (改為向下方向鍵)
    if (keyIsDown(DOWN_ARROW)) {
      character.state = 'attack';
      character.animationIndex = 0;
    }
  }

  // --- 2. 套用物理效果 (重力) ---
  character.y += character.vy;

  // 只有在空中時才施加重力
  if (!character.isOnGround) {
    character.vy += character.gravity;
  }

  // --- 3. 著陸判斷 ---
  if (character.y >= character.groundY && !character.isOnGround) {
    character.y = character.groundY;
    character.vy = 0;
    character.isOnGround = true;
    // 著陸後，根據按鍵決定是走路還是站立
    if (character.state === 'jump') {
      character.state = keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) ? 'walk' : 'idle';
    }
  }

  // --- 4. 繪製角色 ---
  const anim = animations[character.state]; // 根據當前狀態取得對應的動畫資料

  // 如果狀態發生了變化 (且不是跳躍或攻擊中)，重設動畫索引以從頭播放
  if (character.state !== character.previousState && character.state !== 'jump' && character.state !== 'attack') {
    character.animationIndex = 0;
  }

  // 每 anim.speed 個繪圖幀更新一次動畫
  if (frameCount % anim.speed === 0) {
    // 如果動畫不循環 (如跳躍/攻擊)
    if (anim.loops === false) {
      if (character.animationIndex < anim.frames.length - 1) {
        character.animationIndex++;

        // 在攻擊動畫的特定畫格發射投射物
        if (character.state === 'attack' && character.animationIndex === anim.projectileFrame) {
          createProjectile();
        }
      } else {
        // 動畫播放完畢
        if (character.state === 'attack') {
          character.state = 'idle'; // 攻擊完畢，回到站立狀態
        }
      }
    } else {
      character.animationIndex = (character.animationIndex + 1) % anim.frames.length;
    }
  }

  const frameIndex = anim.frames[character.animationIndex];
  const sx = frameIndex * anim.frameWidth;

  push(); // 儲存當前的繪圖設定
  translate(character.x, character.y); // 將畫布原點移動到角色位置
  scale(character.direction, 1); // 根據角色方向翻轉畫布

  // 繪製當前畫格
  imageMode(CENTER);
  // 攻擊動畫有不同的Y軸偏移，需要微調讓腳對齊地面
  const yOffset = (character.state === 'attack') ? -10 : 0;
  image(anim.img, 0, yOffset, anim.frameWidth, anim.frameHeight, sx, 0, anim.frameWidth, anim.frameHeight);

  pop(); // 恢復原本的繪圖設定

  // --- 繪製裝飾動畫 (30/全.png) ---
  if (decoration.img) {
    // 更新動畫索引
    if (frameCount % decoration.speed === 0) {
      decoration.animationIndex = (decoration.animationIndex + 1) % decoration.frames.length;
    }
    const decFrame = decoration.frames[decoration.animationIndex];
    const decSx = decFrame * decoration.frameWidth;
    push();
    imageMode(CENTER);
    image(decoration.img, decoration.x, decoration.y, decoration.frameWidth, decoration.frameHeight, decSx, 0, decoration.frameWidth, decoration.frameHeight);
    pop();
  } else {
    // 如果圖片載入失敗，顯示替代方塊，讓使用者知道位置
    push();
    rectMode(CENTER);
    fill(255, 0, 0, 150); // 紅色半透明方塊
    rect(decoration.x, decoration.y, decoration.frameWidth, decoration.frameHeight);
    fill(255);
    textAlign(CENTER, CENTER);
    text("圖片未找到\n30/全.png", decoration.x, decoration.y);
    pop();
  }
  
  // --- 繪製米色人 (decoration) 頭上的文字 ---
  if (decoration.displayText) {
    push();
    textSize(16);
    const textContent = decoration.displayText;
    const padding = 10;
    
    const lines = textContent.split('\n');
    let maxWidth = 0;
    for (let line of lines) {
      let w = textWidth(line);
      if (w > maxWidth) maxWidth = w;
    }
    const boxWidth = maxWidth + padding * 2;
    const lineHeight = textAscent() + textDescent() + 5;
    const boxHeight = lines.length * lineHeight + padding * 2;
    
    const yPos = decoration.y - decoration.frameHeight / 2 - 10 - boxHeight / 2;

    rectMode(CENTER);
    noStroke();
    fill(0); // 黑色背景
    rect(decoration.x, yPos, boxWidth, boxHeight, 5);

    fill(255); // 白色文字
    textAlign(CENTER, CENTER);
    text(textContent, decoration.x, yPos);
    pop();
  }

  // --- 繪製裝飾動畫 40 (40/全.png) ---
  if (decoration40.isVisible) {
    if (decoration40.img) {
      // 更新動畫索引
      if (frameCount % decoration40.speed === 0) {
        decoration40.animationIndex = (decoration40.animationIndex + 1) % decoration40.frames.length;
      }
      const decFrame40 = decoration40.frames[decoration40.animationIndex];
      const decSx40 = decFrame40 * decoration40.frameWidth;
      push();
      imageMode(CENTER);
      // 放大 2 倍繪製
      image(decoration40.img, decoration40.x, decoration40.y, decoration40.frameWidth * 2, decoration40.frameHeight * 2, decSx40, 0, decoration40.frameWidth, decoration40.frameHeight);
      pop();
    } else {
      // 如果圖片載入失敗，顯示替代方塊 (藍色)
      push();
      rectMode(CENTER);
      fill(0, 0, 255, 150); // 藍色半透明方塊
      rect(decoration40.x, decoration40.y, decoration40.frameWidth * 2, decoration40.frameHeight * 2);
      fill(255);
      textAlign(CENTER, CENTER);
      text("圖片未找到\n40/全.png", decoration40.x, decoration40.y);
      pop();
    }
  }
  
  // --- 繪製藍色人 (decoration40) 頭上的文字 ---
  if (decoration40.isVisible && decoration40.displayText) {
    push();
    textSize(16);
    const textContent = decoration40.displayText;
    const padding = 10;
    
    const lines = textContent.split('\n');
    let maxWidth = 0;
    for (let line of lines) {
      let w = textWidth(line);
      if (w > maxWidth) maxWidth = w;
    }
    const boxWidth = maxWidth + padding * 2;
    const lineHeight = textAscent() + textDescent() + 5;
    const boxHeight = lines.length * lineHeight + padding * 2;
    
    // 注意：因為藍色人放大了2倍，所以高度計算要用 frameHeight * 2
    const yPos = decoration40.y - (decoration40.frameHeight * 2) / 2 - 10 - boxHeight / 2;

    rectMode(CENTER);
    noStroke();
    fill(0); // 黑色背景
    rect(decoration40.x, yPos, boxWidth, boxHeight, 5);

    fill(255); // 白色文字
    textAlign(CENTER, CENTER);
    text(textContent, decoration40.x, yPos);
    pop();
  }

  // --- 繪製新角色 ---
  if (newCharacter.isVisible) {
    newCharacter.previousState = newCharacter.state;

    // 檢查與角色1的距離
    const distToChar2 = abs(character.x - newCharacter.x);

    // 如果角色2倒下了，靠近它可以讓它恢復狀態
    if (newCharacter.state === 'fall' && distToChar2 < newCharacter.touchDistance) {
      newCharacter.state = 'stop';
      newCharacter.animationIndex = 0;
    }

    // 處理與新角色 (橘色貓) 的互動
    if (newCharacter.state !== 'fall') {
      // 修改：只有在還沒通過第一關，或者正在與橘色貓對話時，才進行互動
      if (!hasWonFirstRound || (isChatting && newCharacter.displayText !== "")) {
        if (distToChar2 < newCharacter.touchDistance && !isChatting) {
          isChatting = true;
          askNewQuestion(true);
        } else if (distToChar2 >= newCharacter.touchDistance && isChatting && abs(character.x - newCharacter2.x) >= newCharacter2.touchDistance) {
          isChatting = false;
          quizPhase = 'idle';
          newCharacter.displayText = "";
          inputBox.position(-width, -height);
        }
      }
    }

    const newAnim = newCharacter.animations[newCharacter.state];

    // 更新新角色的動畫
    if (frameCount % newAnim.speed === 0) {
      // 如果動畫不循環 (如倒下)
      if (newAnim.loops === false) {
        if (newCharacter.animationIndex < newAnim.frames.length - 1) {
          newCharacter.animationIndex++;
        }
      } else {
        // 如果狀態改變，重設循環動畫的索引
        if (newCharacter.state !== newCharacter.previousState) {
          newCharacter.animationIndex = 0;
        }
        newCharacter.animationIndex = (newCharacter.animationIndex + 1) % newAnim.frames.length;
      }
    } else if (newCharacter.state !== newCharacter.previousState && newAnim.loops !== false) {
      // 立即重設循環動畫的索引，避免延遲
      newCharacter.animationIndex = 0;
    }

    const newFrameIndex = newAnim.frames[newCharacter.animationIndex];
    const newSx = newFrameIndex * newAnim.frameWidth;

    // 繪製新角色的當前畫格
    push();
    imageMode(CENTER);
    image(newAnim.img, newCharacter.x, newCharacter.y, newAnim.frameWidth, newAnim.frameHeight, newSx, 0, newAnim.frameWidth, newAnim.frameHeight);
    pop();

    // 繪製角色1頭上的文字 (題目與回饋)
    if (newCharacter.displayText) {
      push();
      textSize(16);
      const textContent = newCharacter.displayText;
      const padding = 10;
      
      // 計算多行文字的寬度與高度，確保框框能包住文字
      const lines = textContent.split('\n');
      let maxWidth = 0;
      for (let line of lines) {
        let w = textWidth(line);
        if (w > maxWidth) maxWidth = w;
      }
      const boxWidth = maxWidth + padding * 2;
      const lineHeight = textAscent() + textDescent() + 5;
      const boxHeight = lines.length * lineHeight + padding * 2;
      
      const yPos = newCharacter.y - newCharacter.animations.stop.frameHeight / 2 - 10 - boxHeight / 2;

      rectMode(CENTER);
      noStroke();
      fill(0); // 改為黑色背景，與作答框一致
      rect(newCharacter.x, yPos, boxWidth, boxHeight, 5);

      fill(255); // 改為白色文字
      textAlign(CENTER, CENTER);
      text(textContent, newCharacter.x, yPos);
      pop();
    }
  }

  // 如果在互動中，持續更新輸入框位置
  if (isChatting) {
    const labelText = "請作答";
    textSize(16);
    const labelW = textWidth(labelText);
    const padding = 10;
    const boxHeight = 40;
    const totalWidth = labelW + 150 + padding * 3; // 150 是輸入框寬度

    const centerX = character.x;
    const centerY = character.y - 150; // 將輸入框移回跑動的角色上方

    // 繪製黑色背景方塊
    rectMode(CENTER);
    fill(0); // 黑色
    noStroke();
    rect(centerX, centerY, totalWidth, boxHeight, 5);

    // 繪製提示文字
    fill(255); // 白色文字
    textAlign(LEFT, CENTER);
    text(labelText, centerX - totalWidth / 2 + padding, centerY);

    // 更新輸入框位置
    // 輸入框位於文字右側
    const inputX = centerX - totalWidth / 2 + padding + labelW + padding;
    inputBox.position(inputX, centerY - 10); // 垂直置中微調
  }

  // --- 處理與藍色人 (decoration40) 的互動 ---
  // 只有在通過第一關後才啟用
  if (hasWonFirstRound) {
    // 修改：只有在還沒通過第二關，或者正在與藍色人對話時，才進行互動
    if (!hasWonSecondRound || (isChatting && decoration40.displayText !== "")) {
      const distToDec40 = abs(character.x - decoration40.x);
      if (distToDec40 < 150 && !isChatting) { // 設定觸發距離為 150
        isChatting = true;
        newCharacter.isVisible = false; // 碰到藍色人時，橘色貓才消失
        askNewQuestion(true);
      } else if (distToDec40 >= 150 && isChatting && decoration40.displayText !== "") {
        isChatting = false;
        quizPhase = 'idle';
        decoration40.displayText = "";
        inputBox.position(-width, -height);
      }
    }
  }

  // --- 處理與米色人 (decoration) 的互動 ---
  // 只有在通過第二關後才啟用
  if (hasWonSecondRound) {
    const distToDec = abs(character.x - decoration.x);
    if (distToDec < 150 && !isChatting) {
        isChatting = true;
        decoration40.isVisible = false; // 碰到米色人時，藍色人消失
        askNewQuestion(true);
    } else if (distToDec >= 150 && isChatting && decoration.displayText !== "") {
        isChatting = false;
        quizPhase = 'idle';
        decoration.displayText = "";
        inputBox.position(-width, -height);
    }
  }

  // --- 繪製第二個新角色 ---
  newCharacter2.previousState = newCharacter2.state;

  // 根據與主要角色的距離，決定狀態
  const distToChar3 = abs(character.x - newCharacter2.x);
  if (distToChar3 < newCharacter2.touchDistance) {
    newCharacter2.state = 'touch';
  } else {
    newCharacter2.state = 'stop';
  }

  // 根據主要角色的位置，決定第二個新角色的方向
  if (character.x < newCharacter2.x) {
    newCharacter2.direction = -1; // 主要角色在左邊，角色3反向 (朝左)
  } else {
    newCharacter2.direction = 1; // 主要角色在右邊，角色3正常 (朝右)
  }

  // 處理與第二個新角色的互動
  if (distToChar3 < newCharacter2.touchDistance && !isChatting) {
    isChatting = true;
    askNewQuestion(true);
  } else if (distToChar3 >= newCharacter2.touchDistance && isChatting) {
    // 檢查是否也遠離了其他角色 (橘色貓與藍色人)，避免中斷其他角色的對話
    let farFromActive = true;
    if (!hasWonFirstRound) {
        // 第一關：檢查橘色貓
        farFromActive = abs(character.x - newCharacter.x) >= newCharacter.touchDistance;
    } else if (!hasWonSecondRound) {
        // 第二關：檢查藍色人
        farFromActive = abs(character.x - decoration40.x) >= 150;
    } else {
        // 第三關：檢查米色人
        farFromActive = abs(character.x - decoration.x) >= 150;
    }

    if (farFromActive) {
      isChatting = false;
      quizPhase = 'idle';
      newCharacter2.displayText = "";
      inputBox.position(-width, -height);
    }
  }

  const newAnim2 = newCharacter2.animations[newCharacter2.state];

  // 如果狀態改變，重設動畫索引
  if (newCharacter2.state !== newCharacter2.previousState) {
    newCharacter2.animationIndex = 0;
  }

  // 更新第二個新角色的動畫
  if (frameCount % newAnim2.speed === 0) {
    newCharacter2.animationIndex = (newCharacter2.animationIndex + 1) % newAnim2.frames.length;
  }

  const newFrameIndex2 = newAnim2.frames[newCharacter2.animationIndex];
  const newSx2 = newFrameIndex2 * newAnim2.frameWidth;
  // 繪製第二個新角色的當前畫格
  push();
  imageMode(CENTER);
  translate(newCharacter2.x, newCharacter2.y);
  scale(newCharacter2.direction, 1); // 根據方向翻轉圖片
  image(newAnim2.img, 0, 0, newAnim2.frameWidth * 1.5, newAnim2.frameHeight * 1.5, newSx2, 0, newAnim2.frameWidth, newAnim2.frameHeight);
  pop();

  // 繪製角色3 (右邊那隻) 頭上的文字
  if (newCharacter2.displayText) {
    push();
    // --- 文字與方框設定 ---
    textSize(16);
    const textContent = newCharacter2.displayText;
    const padding = 10;
    
    // 計算多行文字的寬度與高度
    const lines = textContent.split('\n');
    let maxWidth = 0;
    for (let line of lines) {
      let w = textWidth(line);
      if (w > maxWidth) maxWidth = w;
    }
    const boxWidth = maxWidth + padding * 2;
    const lineHeight = textAscent() + textDescent() + 5;
    const boxHeight = lines.length * lineHeight + padding * 2;
    
    // 調整高度，基於 newCharacter2 的高度
    const yPos = newCharacter2.y - newCharacter2.animations.stop.frameHeight / 2 - 30 - boxHeight / 2;

    // --- 繪製背景方框 ---
    rectMode(CENTER);
    noStroke();
    fill(0); // 改為黑色背景，與作答框一致
    rect(newCharacter2.x, yPos, boxWidth, boxHeight, 5);

    // --- 繪製文字 ---
    fill(255); // 改為白色文字
    textAlign(CENTER, CENTER);
    text(textContent, newCharacter2.x, yPos);
    pop();
  }

  // --- 5. 更新與繪製投射物 ---
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.x += p.speed * p.direction;

    // 更新投射物自己的動畫
    if (frameCount % projectileInfo.animationSpeed === 0) {
      p.animationIndex = (p.animationIndex + 1) % projectileInfo.frames.length;
    }
    const frameIndex = projectileInfo.frames[p.animationIndex];
    const sx = frameIndex * projectileInfo.frameWidth;
    push();
    translate(p.x, p.y + 30); // 微調Y軸，讓氣功波看起來在地面上
    scale(p.direction, 1);
    imageMode(CENTER);
    image(projectileInfo.img, 0, 0, projectileInfo.frameWidth, projectileInfo.frameHeight, sx, 0, projectileInfo.frameWidth, projectileInfo.frameHeight);
    pop();

    // 如果投射物飛出畫面，就將其移除
    if (p.x < 0 || p.x > width) {
      projectiles.splice(i, 1);
      continue; // 繼續下一個循環
    }

    // 檢查投射物與角色2的碰撞
    const pLeft = p.x - projectileInfo.frameWidth / 2;
    const pRight = p.x + projectileInfo.frameWidth / 2;
    const char2Left = newCharacter.x - newCharacter.animations.stop.frameWidth / 2;
    const char2Right = newCharacter.x + newCharacter.animations.stop.frameWidth / 2;

    if (newCharacter.isVisible && newCharacter.state !== 'fall' && pRight > char2Left && pLeft < char2Right) {
      newCharacter.state = 'fall';
      newCharacter.animationIndex = 0;
      projectiles.splice(i, 1); // 移除投射物
      continue; // 繼續下一個循環
    }
  }

  // --- 6. 邊界處理 (防止角色走出視窗) ---
  if (character.x > width) {
    character.x = width;
  }
  if (character.x < 0) {
    character.x = 0;
  }

  // --- 7. 繪製獲勝特效 ---
  if (gameWon) {
    drawWinEffect();
  }
}

function createProjectile() {
  const p = {
    x: character.x,
    y: character.y - 100, // 調整Y軸使大氣功波位置更合理
    direction: character.direction,
    speed: projectileInfo.speed,
    animationIndex: 0,
  };
  projectiles.push(p);
}

function askNewQuestion(isFirst) {
  const randomIndex = floor(random(quizTable.getRowCount()));
  currentQuestionRow = quizTable.getRow(randomIndex);
  newCharacter.displayText = currentQuestionRow.getString('question'); // 題目顯示在左邊角色
  
  // 只有在贏過第一輪後，左邊兩個角色才顯示題目
  // 修改：米色人不用顯示，只顯示在藍色人身上
  if (hasWonSecondRound) {
    // 第三關：米色人
    decoration.displayText = currentQuestionRow.getString('question');
    decoration40.displayText = "";
    newCharacter.displayText = "";
  } else if (hasWonFirstRound) {
    // 第二關：藍色人
    decoration.displayText = ""; // 米色人不用
    decoration40.displayText = currentQuestionRow.getString('question');
    newCharacter.displayText = ""; // 確保橘色貓不顯示
  } else {
    // 第一關：橘色貓
    decoration.displayText = "";
    decoration40.displayText = "";
    newCharacter.displayText = currentQuestionRow.getString('question'); // 題目顯示在橘色貓
  }

  if (isFirst) {
    newCharacter2.displayText = "正確請輸入1\n錯誤請輸入2"; // 操作提示顯示在右邊角色
  } else {
    newCharacter2.displayText = "";
  }
  quizPhase = 'asking'; // 設定階段為「提問中」
  inputBox.value(''); // 清空輸入框
}

function onInputSubmit() {
  if (isChatting) {
    if (quizPhase === 'asking') {
      const userAnswer = inputBox.value();
      const correctAnswer = currentQuestionRow.getString('answer');
      
      // 判斷是哪一關 (根據 hasWonFirstRound)
      if (!hasWonFirstRound) {
        // --- 第一關：橘色貓 ---
        if (userAnswer === correctAnswer) {
          newCharacter.displayText = currentQuestionRow.getString('correct_feedback') + "\n(按空白鍵繼續)";
          newCharacter2.displayText = "";
          hasWonFirstRound = true; // 標記通過第一關
          lastAnswerWasCorrect = true;
          // 注意：這裡不顯示藍色人的文字，也不隱藏橘色貓
        } else {
          newCharacter.displayText = currentQuestionRow.getString('wrong_feedback') + "\n(按空白鍵繼續)";
          if (currentQuestionRow.getString('hint')) newCharacter2.displayText = currentQuestionRow.getString('hint');
          lastAnswerWasCorrect = false;
        }
      } else if (!hasWonSecondRound) {
        // --- 第二關：藍色人 ---
        if (userAnswer === correctAnswer) {
          decoration40.displayText = currentQuestionRow.getString('correct_feedback') + "\n(按空白鍵繼續)";
          newCharacter2.displayText = "";
          hasWonSecondRound = true; // 標記通過第二關
          lastAnswerWasCorrect = true;
        } else {
          decoration40.displayText = currentQuestionRow.getString('wrong_feedback') + "\n(按空白鍵繼續)";
          if (currentQuestionRow.getString('hint')) newCharacter2.displayText = currentQuestionRow.getString('hint');
          lastAnswerWasCorrect = false;
        }
      } else {
        // --- 第三關：米色人 ---
        if (userAnswer === correctAnswer) {
          lastAnswerWasCorrect = true;
          gameWon = true; // 直接設定遊戲勝利
          // 結束對話，隱藏介面
          isChatting = false;
          quizPhase = 'idle';
          decoration.displayText = "";
          newCharacter2.displayText = "";
          inputBox.position(-width, -height);
          return; // 直接結束，不進入 feedback 階段
        } else {
          decoration.displayText = currentQuestionRow.getString('wrong_feedback') + "\n(按空白鍵繼續)";
          if (currentQuestionRow.getString('hint')) newCharacter2.displayText = currentQuestionRow.getString('hint');
          lastAnswerWasCorrect = false;
        }
      }
      
      quizPhase = 'feedback'; // 進入「回饋」階段
    } else if (quizPhase === 'feedback') {
      // 如果答對了且第二張背景有載入成功，則切換背景
      if (lastAnswerWasCorrect && bgImg2) {
        bgImg = bgImg2;
      }
      askNewQuestion(); // 提出下一個問題
    }
  }
}

function keyPressed() {
  if (gameWon && key === ' ') {
    gameWon = false;
    return;
  }

  if (isChatting && quizPhase === 'feedback' && key === ' ') {
    // 如果剛答對第一關 (橘色貓有文字 且 hasWonFirstRound 為真)
    if (newCharacter.displayText !== "" && hasWonFirstRound) {
       if (lastAnswerWasCorrect && bgImg2) bgImg = bgImg2;
       
       // 結束對話，讓玩家移動去找藍色人
       isChatting = false;
       quizPhase = 'idle';
       newCharacter.displayText = "";
       newCharacter2.displayText = "";
       inputBox.position(-width, -height);
       return; // 結束函式，不呼叫 askNewQuestion
    }

    // 如果剛答對第二關 (藍色人有文字 且 hasWonSecondRound 為真)
    if (decoration40.displayText !== "" && hasWonSecondRound) {
       if (lastAnswerWasCorrect && bgImg2) bgImg = bgImg2;
       
       // 結束對話，讓玩家移動去找米色人
       isChatting = false;
       quizPhase = 'idle';
       decoration40.displayText = "";
       newCharacter2.displayText = "";
       inputBox.position(-width, -height);
       return;
    }

    // 如果答對了且第二張背景有載入成功，則切換背景
    if (lastAnswerWasCorrect && bgImg2) {
      bgImg = bgImg2;
    }
    askNewQuestion(); // 提出下一個問題
  }
}

function drawWinEffect() {
  push();
  // 半透明黑色背景
  fill(0, 150);
  rectMode(CORNER);
  rect(0, 0, width, height);
  
  // 勝利文字
  textAlign(CENTER, CENTER);
  textSize(64);
  fill(255, 215, 0); // 金色
  stroke(0);
  strokeWeight(4);
  text("恭喜通關！", width / 2, height / 2);
  
  // 副標題
  textSize(32);
  fill(255);
  noStroke();
  text("你已完成所有挑戰", width / 2, height / 2 + 60);
  pop();

  // 產生彩帶
  if (frameCount % 5 === 0) {
    confetti.push(new Confetti(random(width), -10));
  }

  // 更新與繪製彩帶
  for (let i = confetti.length - 1; i >= 0; i--) {
    confetti[i].update();
    confetti[i].display();
    if (confetti[i].y > height) {
      confetti.splice(i, 1);
    }
  }
}

class Confetti {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(2, 5);
    this.size = random(5, 15);
    this.color = color(random(255), random(255), random(255));
    this.angle = random(TWO_PI);
    this.spin = random(-0.1, 0.1);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.spin;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(this.color);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.size, this.size);
    pop();
  }
}
