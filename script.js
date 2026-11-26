const game = document.getElementById("game"); // 게임 화면으로 사용할 캔버스를 가져옵니다.
const ctx = game.getContext("2d"); // 캔버스에 2D 그림을 그릴 도구를 가져옵니다.

// 아래 좌표와 크기를 바꾸면 각 장면 요소의 위치와 크기를 조정할 수 있습니다.
const layout = {
	wall: { x: 0, y: 0, width: 800, height: 290 }, // 하얀 벽의 위치와 크기
	floor: {
		x: 0, // 바닥 왼쪽 위치
		y: 290, // 바닥과 벽이 만나는 높이
		width: 800, // 바닥 너비
		height: 310, // 바닥 높이
		vanishingPoint: { x: 400, y: 290 }, // 바닥 선이 모이는 소실점
		rayEndX: [0, 800], // 바닥 앞쪽까지 뻗는 투시선의 끝 x 좌표
		seamFractions: [0.12, 0.28, 0.5, 0.74], // 바닥 가로줄의 원근상 간격
	},
	title: { x: 32, y: 44 }, // 게임 제목을 표시할 위치
	classTime: {
		x: 32, // 남은 수업 시간 문구의 x 좌표
		y: 80, // 남은 수업 시간 문구의 y 좌표
		fontSize: 13, // 남은 수업 시간 글자 크기
	},
	desk: {
		backLeftX: 30, // 상판 뒤쪽 왼쪽 x 좌표
		backRightX: 770, // 상판 뒤쪽 오른쪽 x 좌표
		frontLeftX: 0, // 상판 앞쪽 왼쪽 x 좌표
		frontRightX: 800, // 상판 앞쪽 오른쪽 x 좌표
		backY: 300, // 상판 뒤쪽 y 좌표
		frontY: 408, // 상판 앞쪽 y 좌표
		frontDepth: 20, // 상판 앞면의 깊이
		legBottomY: 550, // 책상 다리 아래쪽 y 좌표
		legWidth: 20, // 책상 다리 너비
		legs: [
			{ topX: 58, bottomX: 68 }, // 왼쪽 책상 다리의 기울어진 위치
			{ topX: 726, bottomX: 716 }, // 오른쪽 책상 다리의 기울어진 위치
		],
	},
	computers: {
		xPositions: [70, 215, 360, 505, 650], // 다섯 컴퓨터의 왼쪽 x 좌표
		y: 214, // 모니터 앞면 위쪽 y 좌표
		width: 80, // 모니터 너비
		height: 64, // 모니터 앞면 높이
		topDepth: 8, // 위에서 보이는 모니터 윗면의 깊이
		perspectiveInset: 4, // 모니터 윗면과 앞면의 사선 정도
		screenInset: 6, // 모니터 테두리 안쪽 여백
		screenHeight: 40, // 화면 높이
		standWidth: 18, // 모니터 받침대 너비
		standHeight: 20, // 모니터 받침대 높이
		baseWidth: 38, // 받침대 바닥 너비
		baseHeight: 8, // 받침대 바닥 높이
		keyboardWidth: 60, // 키보드 너비
		keyboardHeight: 20, // 키보드 높이
		keyboardY: 320, // 키보드 위쪽 y 좌표
	},
	player: { x: 384, y: 445, width: 32, height: 32 }, // 가운데 컴퓨터 앞 플레이어
	obstacle: {
		x: 130, // 장애물의 시작 x 좌표
		y: 500, // 플레이어와 밑변을 맞춰 뒤에 보이게 하는 y 좌표
		size: 64, // 장애물 한 변의 길이
		visualScale: 3, // 장애물 그림을 충돌 범위의 세 배 크기로 표시하는 배율
		shoulderCutY: 36, // 상반신을 자르는 어깨 위치
		minX: 24, // 장애물이 왼쪽으로 이동할 수 있는 끝 위치
		maxX: 712, // 장애물이 오른쪽으로 이동할 수 있는 끝 위치
		speed: 190, // 장애물의 초당 이동 거리
		stopGap: 12, // 플레이어와 멈춘 장애물 사이의 간격
		stopChance: 0.45, // 플레이어 뒤에 도착했을 때 멈출 확률
		stopDurationSeconds: 10, // 확률적으로 멈춰 있는 시간(초)
		stopDrainMultiplier: 4, // 멈춰 있는 동안 타이머가 줄어드는 배율
	},
	camera: {
		stopZoomScale: 1.5, // 장애물이 멈췄을 때 게임 장면을 확대할 배율
	},
	gameOver: {
		fontSize: 56, // Game Over 글자의 크기
	},
	clear: {
		survivalSeconds: 60, // CLEAR를 위해 생존해야 하는 시간(초)
		fontSize: 72, // CLEAR 글자의 크기
	},
	arrowKeys: {
		centerX: 400, // 방향키 줄의 가로 중앙 위치
		y: 108, // 방향키 줄의 위쪽 y 좌표
		size: 42, // 방향키 한 칸의 너비와 높이
		gap: 8, // 방향키 칸 사이 간격
		count: 10, // 한 줄에 표시할 방향키 개수
	},
	lives: {
		labelX: 32, // 목숨 안내 글자의 x 좌표
		labelY: 24, // 목숨 안내 글자의 y 좌표
		circleStartX: 112, // 첫 번째 빨간 원의 x 좌표
		circleY: 24, // 빨간 원들의 y 좌표
		circleRadius: 7, // 목숨 원의 반지름
		circleGap: 12, // 목숨 원 사이 간격
		count: 3, // 시작 목숨 개수
	},
	timer: {
		x: 620, // 시간 바의 왼쪽 위 x 좌표
		y: 16, // 시간 바의 왼쪽 위 y 좌표
		width: 150, // 시간 바의 전체 너비
		height: 16, // 시간 바의 높이
		maxSeconds: 30, // 가득 찬 상태에서 남은 시간(초)
		refillSeconds: 0.5, // 방향키를 맞혔을 때 늘어나는 시간(초)
		penaltySeconds: 0.5, // 틀린 키를 눌렀을 때 줄어드는 시간(초)
	},
};

// 장면 요소에 사용할 색을 한곳에서 관리합니다.
const colors = {
	wall: "#ffffff", // 벽의 흰색
	floor: "#e5e8eb", // 바닥의 밝은 회색
	floorLine: "#c6cbd0", // 벽과 바닥의 경계선
	floorGrid: "#adadad", // 원근감을 표현하는 바닥 타일선
	desk: "#76533d", // 책상 상판의 나무색
	deskFront: "#50392c", // 책상 앞면과 다리의 어두운 색
	deskSide: "#624732", // 책상 옆면의 어두운 나무색
	deskTop: "#927052", // 위에서 보이는 책상 상판의 밝은 나무색
	computer: "#171a1e", // 컴퓨터 본체와 모니터 테두리의 검은색
	computerSide: "#101316", // 모니터 옆면의 어두운 색
	computerTop: "#30363b", // 위에서 보이는 모니터 윗면의 색
	screen: "#263d4b", // 모니터 화면의 어두운 청록색
	keyboard: "#272b30", // 키보드의 색
	player: "#3a3a3a", // 플레이어의 회색
	playerOutline: "#535d66", // 플레이어가 배경과 구분되도록 하는 테두리색
	obstacle: "#17191d", // 인물 옷의 검은색
	obstacleHighlight: "#000000", // 검은 옷의 밝은 주름선
	obstacleSkin: "#e6c0a4", // 목과 귀의 피부색
	obstacleHair: "#3d2b25", // 뒷머리 색
	title: "#20252a", // 제목 글자색
	key: "#252c33", // 아직 입력하지 않은 방향키 칸의 색
	keyCurrent: "#f2b84b", // 지금 입력해야 하는 방향키 칸의 색
	keyComplete: "#3d9b70", // 입력을 완료한 방향키 칸의 색
	keyText: "#ffffff", // 방향키 기호 색
	life: "#e33d3d", // 남은 목숨을 나타내는 빨간 원의 색
	timerTrack: "#d7dce0", // 시간 바가 줄어든 자리에 보이는 색
	timerFill: "#42a477", // 남은 시간을 나타내는 바의 색
	timerLow: "#e33d3d", // 시간이 얼마 남지 않았을 때 바의 색
	timerZoom: "#ffb223", // 화면 확대 중 시간 바의 노란색
	timerOutline: "#303840", // 시간 바의 테두리 색
	gameOverBackground: "#000000", // 게임 종료 화면의 검은 배경
	gameOverText: "#ffffff", // 게임 종료 문구의 흰색
	clearBackground: "#ffffff", // 게임 클리어 화면의 흰 배경
	clearText: "#000000", // 게임 클리어 문구의 검은색
};

// 게임에서 사용할 네 방향과 화면에 표시할 화살표 기호를 정합니다.
const arrowOptions = [
	{ key: "ArrowUp", symbol: "↑" },
	{ key: "ArrowDown", symbol: "↓" },
	{ key: "ArrowLeft", symbol: "←" },
	{ key: "ArrowRight", symbol: "→" },
];

// 방향키 칸 수만큼 무작위 방향을 골라 새 순서를 만듭니다.
function createArrowSequence() {
	return Array.from({ length: layout.arrowKeys.count }, () => {
		const randomIndex = Math.floor(Math.random() * arrowOptions.length);
		return arrowOptions[randomIndex];
	});
}

// 현재 게임 진행 상태를 저장합니다.
let arrowSequence = createArrowSequence(); // 무작위로 뽑힌 방향키 순서
let arrowProgress = 0; // 지금까지 맞게 입력한 방향키 수
let obstacleX = layout.obstacle.x; // 매 프레임 바뀌는 장애물의 x 좌표
let obstacleDirection = 1; // 1은 오른쪽, -1은 왼쪽 이동을 뜻합니다.
let obstacleStopRemaining = 0; // 장애물이 멈춰 있는 동안 남은 시간(초)
let previousFrameTime = 0; // 프레임 간 이동 시간을 계산할 기준 시각
let remainingLives = layout.lives.count; // 현재 남은 목숨 개수
let remainingTime = layout.timer.maxSeconds; // 현재 남은 제한 시간(초)
let isGameOver = false; // 목숨을 모두 잃었는지 저장합니다.
let survivalTime = 0; // 게임을 시작한 뒤 흐른 생존 시간(초)
let isClear = false; // 생존 목표를 달성했는지 저장합니다.

// 장애물을 사람의 뒷모습 실루엣으로 그립니다.
function drawObstaclePerson(x, y, size) {
	const unit = size / 64;
	const px = (value) => x + value * unit;
	const py = (value) => y + value * unit;

	// 옆으로 살짝 보이는 귀와 얼굴을 덮는 뒷머리
	ctx.fillStyle = colors.obstacleSkin;
	ctx.beginPath();
	ctx.ellipse(px(23), py(14), 3 * unit, 4 * unit, 0, 0, Math.PI * 2);
	ctx.ellipse(px(41), py(14), 3 * unit, 4 * unit, 0, 0, Math.PI * 2);
	ctx.fill();

	// 목을 먼저 그려 머리카락이 목 윗부분을 덮도록 합니다.
	ctx.fillStyle = colors.obstacleSkin;
	ctx.fillRect(px(28), py(19), 8 * unit, 6 * unit);

	ctx.fillStyle = colors.obstacleHair;
	ctx.beginPath();
	ctx.moveTo(px(23), py(18));
	ctx.lineTo(px(23), py(12));
	ctx.quadraticCurveTo(px(22), py(2), px(32), py(2));
	ctx.quadraticCurveTo(px(42), py(2), px(41), py(12));
	ctx.lineTo(px(41), py(18));
	ctx.lineTo(px(37), py(22));
	ctx.lineTo(px(34), py(19));
	ctx.lineTo(px(32), py(22));
	ctx.lineTo(px(30), py(19));
	ctx.lineTo(px(27), py(22));
	ctx.closePath();
	ctx.fill();

	// 팔이 갈라져 보이지 않도록 쇄골 아래에서 잘린 어깨 실루엣
	ctx.fillStyle = colors.obstacle;
	ctx.beginPath();
	ctx.moveTo(px(27), py(23));
	ctx.lineTo(px(20), py(25));
	ctx.quadraticCurveTo(px(12), py(28), px(9), py(layout.obstacle.shoulderCutY));
	ctx.lineTo(px(55), py(layout.obstacle.shoulderCutY));
	ctx.quadraticCurveTo(px(52), py(28), px(44), py(25));
	ctx.lineTo(px(37), py(23));
	ctx.closePath();
	ctx.fill();

	// 쇄골선을 간단히 표현해 팔과 상체가 나뉘어 보이지 않게 합니다.
	ctx.strokeStyle = colors.obstacleHighlight;
	ctx.lineWidth = Math.max(1, 1.5 * unit);
	ctx.beginPath();
	ctx.moveTo(px(27), py(27));
	ctx.lineTo(px(32), py(31));
	ctx.lineTo(px(37), py(27));
	ctx.stroke();
}

// 한 프레임의 전체 화면을 그립니다.
function drawScene() {
	ctx.clearRect(0, 0, game.width, game.height); // 이전 프레임 그림을 지웁니다.
	if (isGameOver) {
		ctx.fillStyle = colors.gameOverBackground; // 게임 종료 시 캔버스를 검게 채웁니다.
		ctx.fillRect(0, 0, game.width, game.height);
		ctx.fillStyle = colors.gameOverText; // 중앙 문구를 흰색으로 설정합니다.
		ctx.font = `bold ${layout.gameOver.fontSize}px sans-serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Game Over", game.width / 2, game.height / 2); // 화면 중앙에 종료 문구를 표시합니다.
		return;
	}
	if (isClear) {
		ctx.fillStyle = colors.clearBackground; // 게임 클리어 시 캔버스를 흰색으로 채웁니다.
		ctx.fillRect(0, 0, game.width, game.height);
		ctx.fillStyle = colors.clearText; // 중앙 문구를 검은색으로 설정합니다.
		ctx.font = `bold ${layout.clear.fontSize}px sans-serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("CLEAR", game.width / 2, game.height / 2); // 화면 정중앙에 클리어 문구를 표시합니다.
		return;
	}

	// 화면 전체에 벽과 바닥의 기본색을 깔아 확대할 때 빈 모서리가 생기지 않게 합니다.
ctx.fillStyle = colors.wall;
ctx.fillRect(layout.wall.x, layout.wall.y, layout.wall.width, layout.wall.height);
ctx.fillStyle = colors.floor;
ctx.fillRect(layout.floor.x, layout.floor.y, layout.floor.width, layout.floor.height);

const personSize = layout.obstacle.size * layout.obstacle.visualScale;
const personInset = (personSize - layout.obstacle.size) / 2;
const personX = obstacleX - personInset;
const personY = game.height - personSize * layout.obstacle.shoulderCutY / 64;
const personBounds = {
	left: personX + personSize * 9 / 64,
	right: personX + personSize * 55 / 64,
	top: personY + personSize * 2 / 64,
	bottom: personY + personSize * layout.obstacle.shoulderCutY / 64,
};

	// 장애물이 멈춘 동안 플레이어와 장애물을 중심으로 게임 장면만 확대합니다.
	ctx.save();
	const zoomScale = obstacleStopRemaining > 0 ? layout.camera.stopZoomScale : 1;
	if (zoomScale > 1) {
		const focusX = (obstacleX + layout.obstacle.size / 2 + layout.player.x + layout.player.width / 2) / 2;
		const zoomMargin = 12;
		const desiredX = game.width / 2 - focusX * zoomScale;
		const desiredY = game.height - personBounds.bottom * zoomScale;
		const minX = zoomMargin - personBounds.left * zoomScale;
		const maxX = game.width - zoomMargin - personBounds.right * zoomScale;
		const minY = zoomMargin - personBounds.top * zoomScale;
		const maxY = game.height - personBounds.bottom * zoomScale;
		ctx.translate(
			Math.max(minX, Math.min(maxX, desiredX)),
			Math.max(minY, Math.min(maxY, desiredY)),
		);
		ctx.scale(zoomScale, zoomScale);
	}

	// 흰 벽과 바닥을 그려 강의실의 배경을 만듭니다.
ctx.fillStyle = colors.floor;
ctx.fillRect(layout.floor.x, layout.floor.y, layout.floor.width, layout.floor.height);
ctx.strokeStyle = colors.floorLine;
ctx.beginPath();
ctx.moveTo(layout.floor.x, layout.floor.y);
ctx.lineTo(layout.floor.x + layout.floor.width, layout.floor.y);
ctx.stroke();

// 소실점에서 바닥 앞으로 퍼지는 선과 점점 간격이 넓어지는 가로줄을 그립니다.
ctx.strokeStyle = colors.floorGrid;
ctx.lineWidth = 1;
layout.floor.rayEndX.forEach((endX) => {
	ctx.beginPath();
	ctx.moveTo(layout.floor.vanishingPoint.x, layout.floor.vanishingPoint.y);
	ctx.lineTo(endX, layout.floor.y + layout.floor.height);
	ctx.stroke();
});
layout.floor.seamFractions.forEach((fraction) => {
	const y = layout.floor.y + layout.floor.height * fraction;
	const progress = (y - layout.floor.vanishingPoint.y) / layout.floor.height;
	const leftX = layout.floor.vanishingPoint.x * (1 - progress);
	const rightX = layout.floor.vanishingPoint.x + (layout.floor.width - layout.floor.vanishingPoint.x) * progress;
	ctx.beginPath();
	ctx.moveTo(leftX, y);
	ctx.lineTo(rightX, y);
	ctx.stroke();
});

// 책상 앞쪽에서 바닥으로 퍼지는 부드러운 그림자를 그립니다.
const tableShadowGradient = ctx.createLinearGradient(
	0,
	layout.desk.frontY + layout.desk.frontDepth,
	0,
	layout.desk.legBottomY + 20,
);
tableShadowGradient.addColorStop(0, "rgba(35, 29, 24, 0.2)");
tableShadowGradient.addColorStop(0.35, "rgba(35, 29, 24, 0.12)");
tableShadowGradient.addColorStop(1, "rgba(35, 29, 24, 0)");
ctx.save();
ctx.fillStyle = tableShadowGradient;
ctx.shadowColor = "rgba(35, 29, 24, 0.18)";
ctx.shadowBlur = 18;
ctx.beginPath();
ctx.moveTo(layout.desk.frontLeftX, layout.desk.frontY + layout.desk.frontDepth);
ctx.lineTo(layout.desk.frontRightX, layout.desk.frontY + layout.desk.frontDepth);
ctx.lineTo(layout.desk.frontRightX, layout.desk.legBottomY + 20);
ctx.lineTo(layout.desk.frontLeftX, layout.desk.legBottomY + 20);
ctx.closePath();
ctx.fill();
ctx.restore();

// 책상 다리를 사선으로 그려 바닥 쪽으로 깊어지는 느낌을 줍니다.
layout.desk.legs.forEach((leg) => {
	ctx.fillStyle = colors.deskFront;
	ctx.beginPath();
	ctx.moveTo(leg.topX, layout.desk.frontY + layout.desk.frontDepth);
	ctx.lineTo(leg.topX + layout.desk.legWidth, layout.desk.frontY + layout.desk.frontDepth);
	ctx.lineTo(leg.bottomX + layout.desk.legWidth, layout.desk.legBottomY);
	ctx.lineTo(leg.bottomX, layout.desk.legBottomY);
	ctx.closePath();
	ctx.fill();
});

// 사다리꼴 상판과 두께가 보이는 앞면·옆면으로 책상을 그립니다.
ctx.fillStyle = colors.deskSide;
ctx.beginPath();
ctx.moveTo(layout.desk.backLeftX, layout.desk.backY);
ctx.lineTo(layout.desk.frontLeftX, layout.desk.frontY);
ctx.lineTo(layout.desk.frontLeftX + 10, layout.desk.frontY + layout.desk.frontDepth);
ctx.lineTo(layout.desk.backLeftX + 10, layout.desk.backY + layout.desk.frontDepth);
ctx.closePath();
ctx.fill();
ctx.beginPath();
ctx.moveTo(layout.desk.backRightX, layout.desk.backY);
ctx.lineTo(layout.desk.frontRightX, layout.desk.frontY);
ctx.lineTo(layout.desk.frontRightX - 10, layout.desk.frontY + layout.desk.frontDepth);
ctx.lineTo(layout.desk.backRightX - 10, layout.desk.backY + layout.desk.frontDepth);
ctx.closePath();
ctx.fill();
ctx.fillStyle = colors.deskFront;
ctx.beginPath();
ctx.moveTo(layout.desk.frontLeftX, layout.desk.frontY);
ctx.lineTo(layout.desk.frontRightX, layout.desk.frontY);
ctx.lineTo(layout.desk.frontRightX - 10, layout.desk.frontY + layout.desk.frontDepth);
ctx.lineTo(layout.desk.frontLeftX + 10, layout.desk.frontY + layout.desk.frontDepth);
ctx.closePath();
ctx.fill();
ctx.fillStyle = colors.deskTop;
ctx.beginPath();
ctx.moveTo(layout.desk.backLeftX, layout.desk.backY);
ctx.lineTo(layout.desk.backRightX, layout.desk.backY);
ctx.lineTo(layout.desk.frontRightX, layout.desk.frontY);
ctx.lineTo(layout.desk.frontLeftX, layout.desk.frontY);
ctx.closePath();
ctx.fill();
ctx.strokeStyle = colors.desk;
ctx.lineWidth = 2;
ctx.stroke();

// 책상 위에 간격을 두고 검은색 컴퓨터 다섯 대를 그립니다.
layout.computers.xPositions.forEach((x) => {
	const computer = layout.computers;
	const standX = x + (computer.width - computer.standWidth) / 2;
	const baseX = x + (computer.width - computer.baseWidth) / 2;
	const keyboardX = x + (computer.width - computer.keyboardWidth) / 2;

	ctx.fillStyle = colors.computerTop;
	ctx.beginPath();
	ctx.moveTo(x + computer.perspectiveInset, computer.y);
	ctx.lineTo(x + computer.width - computer.perspectiveInset, computer.y);
	ctx.lineTo(x + computer.width + computer.topDepth, computer.y - computer.topDepth);
	ctx.lineTo(x - computer.topDepth, computer.y - computer.topDepth);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = colors.computerSide;
	ctx.beginPath();
	ctx.moveTo(x + computer.width - computer.perspectiveInset, computer.y);
	ctx.lineTo(x + computer.width + computer.topDepth, computer.y - computer.topDepth);
	ctx.lineTo(x + computer.width + computer.topDepth, computer.y + computer.height - computer.topDepth);
	ctx.lineTo(x + computer.width, computer.y + computer.height);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = colors.computer;
	ctx.fillRect(x, computer.y, computer.width, computer.height);
	ctx.fillStyle = colors.screen;
	ctx.fillRect(
		x + computer.screenInset,
		computer.y + computer.screenInset,
		computer.width - computer.screenInset * 2,
		computer.screenHeight,
	);
	ctx.fillStyle = colors.computer;
	ctx.fillRect(standX, computer.y + computer.height, computer.standWidth, computer.standHeight);
	ctx.fillRect(
		baseX,
		computer.y + computer.height + computer.standHeight,
		computer.baseWidth,
		computer.baseHeight,
	);
	ctx.fillRect(
		keyboardX,
		computer.keyboardY,
		computer.keyboardWidth,
		computer.keyboardHeight,
	);
});

// 어깨 아래를 짧게 자른 사람 뒷모습을 충돌 범위보다 조금 크게 표시합니다.
drawObstaclePerson(
	personX,
	personY,
	personSize,
);

// 가운데 컴퓨터 앞에 테두리가 있는 회색 플레이어를 그립니다.
ctx.fillStyle = colors.player;
ctx.fillRect(layout.player.x, layout.player.y, layout.player.width, layout.player.height);
ctx.strokeStyle = colors.playerOutline;
ctx.lineWidth = 2;
ctx.strokeRect(layout.player.x, layout.player.y, layout.player.width, layout.player.height);

	// 게임 장면 확대를 끝내고 고정 HUD를 그릴 수 있도록 원래 좌표계로 돌아갑니다.
	ctx.restore();

	// 벽 위에 게임 제목을 표시합니다.
	ctx.fillStyle = colors.title;
	ctx.font = "bold 24px sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("진도 따라잡기", layout.title.x, layout.title.y);

	// 왼쪽 위에 현재 남은 수업 시간을 초 단위로 표시합니다.
	ctx.fillStyle = colors.title;
	ctx.font = `${layout.classTime.fontSize}px sans-serif`;
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	const classTimeRemaining = Math.max(0, Math.ceil(layout.clear.survivalSeconds - survivalTime));
	ctx.fillText(`남은 수업 시간: ${classTimeRemaining}초`, layout.classTime.x, layout.classTime.y);

	// 왼쪽 위에 목숨 안내와 남은 목숨 수만큼의 빨간 원을 그립니다.
	ctx.fillStyle = colors.title;
	ctx.font = "12px sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.fillText("남은 목숨:", layout.lives.labelX, layout.lives.labelY);
	ctx.fillStyle = colors.life;
	for (let lifeIndex = 0; lifeIndex < remainingLives; lifeIndex += 1) {
		const circleX = layout.lives.circleStartX + lifeIndex * layout.lives.circleGap;
		ctx.beginPath();
		ctx.arc(circleX, layout.lives.circleY, layout.lives.circleRadius, 0, Math.PI * 2);
		ctx.fill();
	}

	// 오른쪽 위에 남은 시간 비율만큼 채워지는 사각형 시간 바를 그립니다.
	const timerRatio = remainingTime / layout.timer.maxSeconds;
	ctx.fillStyle = colors.timerTrack;
	ctx.fillRect(layout.timer.x, layout.timer.y, layout.timer.width, layout.timer.height);
	const timerFillColor = obstacleStopRemaining > 0
		? colors.timerZoom
		: timerRatio <= 0.2
			? colors.timerLow
			: colors.timerFill;
	ctx.fillStyle = timerFillColor; // 확대 중이면 노란색, 아니면 남은 시간에 맞는 색으로 바를 채웁니다.
	ctx.fillRect(layout.timer.x, layout.timer.y, layout.timer.width * timerRatio, layout.timer.height);
	ctx.strokeStyle = colors.timerOutline;
	ctx.lineWidth = 1;
	ctx.strokeRect(layout.timer.x, layout.timer.y, layout.timer.width, layout.timer.height);

// 무작위 방향 순서를 화면 가운데에 키 모양 칸으로 표시합니다.
const arrowRowWidth = layout.arrowKeys.count * layout.arrowKeys.size
	+ (layout.arrowKeys.count - 1) * layout.arrowKeys.gap;
const arrowStartX = layout.arrowKeys.centerX - arrowRowWidth / 2;
arrowSequence.forEach((arrow, index) => {
	const keyX = arrowStartX + index * (layout.arrowKeys.size + layout.arrowKeys.gap);
	const isComplete = index < arrowProgress;
	const isCurrent = index === arrowProgress;
	ctx.fillStyle = isComplete
		? colors.keyComplete
		: isCurrent
			? colors.keyCurrent
			: colors.key;
	ctx.fillRect(keyX, layout.arrowKeys.y, layout.arrowKeys.size, layout.arrowKeys.size);
	ctx.strokeStyle = colors.keyText;
	ctx.lineWidth = 1;
	ctx.strokeRect(keyX, layout.arrowKeys.y, layout.arrowKeys.size, layout.arrowKeys.size);
	ctx.fillStyle = colors.keyText;
	ctx.font = "bold 24px sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(arrow.symbol, keyX + layout.arrowKeys.size / 2, layout.arrowKeys.y + layout.arrowKeys.size / 2);
});

// 방향키 입력 진행 상황을 숫자로 알려 줍니다.
ctx.fillStyle = colors.title;
ctx.font = "14px sans-serif";
ctx.textAlign = "center";
ctx.textBaseline = "top";
ctx.fillText(`${arrowProgress} / ${layout.arrowKeys.count}`, layout.arrowKeys.centerX, layout.arrowKeys.y + layout.arrowKeys.size + 10);
}

// 장애물을 좌우로 움직이고 화면을 계속 다시 그립니다.
function animate(frameTime) {
	if (isGameOver || isClear) {
		drawScene(); // 종료 화면을 유지하고 더 이상 게임 상태를 갱신하지 않습니다.
		return;
	}
	const deltaSeconds = previousFrameTime === 0
		? 0
		: Math.min((frameTime - previousFrameTime) / 1000, 0.05);
	previousFrameTime = frameTime;
	survivalTime += deltaSeconds; // 게임 플레이 시간을 누적합니다.
	const isObstacleStopped = obstacleStopRemaining > 0;
	if (isObstacleStopped) {
		obstacleStopRemaining = Math.max(0, obstacleStopRemaining - deltaSeconds);
		remainingTime = Math.max(
			0,
			remainingTime - deltaSeconds * layout.obstacle.stopDrainMultiplier,
		);
	} else {
		const nextObstacleX = obstacleX + layout.obstacle.speed * obstacleDirection * deltaSeconds;
		const stopX = obstacleDirection > 0
			? layout.player.x - layout.obstacle.size - layout.obstacle.stopGap
			: layout.player.x + layout.player.width + layout.obstacle.stopGap;
		const reachedPlayerFromBehind = obstacleDirection > 0
			? obstacleX < stopX && nextObstacleX >= stopX
			: obstacleX > stopX && nextObstacleX <= stopX;

		if (reachedPlayerFromBehind && Math.random() < layout.obstacle.stopChance) {
			obstacleX = stopX;
			obstacleStopRemaining = layout.obstacle.stopDurationSeconds;
		} else {
			obstacleX = nextObstacleX;
		}
		remainingTime = Math.max(0, remainingTime - deltaSeconds);
		if (obstacleX <= layout.obstacle.minX) {
			obstacleX = layout.obstacle.minX;
			obstacleDirection = 1;
		} else if (obstacleX >= layout.obstacle.maxX) {
			obstacleX = layout.obstacle.maxX;
			obstacleDirection = -1;
		}
	}
	if (remainingTime <= 0) {
		remainingLives = Math.max(0, remainingLives - 1); // 시간이 끝나면 목숨을 하나 줄입니다.
		if (remainingLives === 0) {
			isGameOver = true; // 목숨을 모두 잃으면 게임을 종료합니다.
		} else {
			remainingTime = layout.timer.maxSeconds; // 남은 목숨이 있으면 다음 기회를 위해 시간을 다시 채웁니다.
		}
	}
	if (!isGameOver && remainingLives > 0 && survivalTime >= layout.clear.survivalSeconds) {
		isClear = true; // 목숨이 남아 있는 채 생존 목표 시간에 도달하면 클리어합니다.
	}
	updateFocusBgm(obstacleStopRemaining > 0 && !isGameOver && !isClear);
	if (isClear) {
		drawScene();
		return;
	}
	if (isGameOver) {
		drawScene();
		return;
	}
	drawScene();
	requestAnimationFrame(animate);
}

let audioContext;
let focusHumOscillator;
let focusHumGain;
let isFocusHumPlaying = false;

function updateFocusBgm(shouldPlay) {
	if (!audioContext || shouldPlay === isFocusHumPlaying) return;
	isFocusHumPlaying = shouldPlay;

	const now = audioContext.currentTime;
	if (shouldPlay) {
		focusHumOscillator = audioContext.createOscillator();
		focusHumGain = audioContext.createGain();
		const filter = audioContext.createBiquadFilter();
		focusHumOscillator.type = "sawtooth";
		focusHumOscillator.frequency.setValueAtTime(82, now);
		filter.type = "lowpass";
		filter.frequency.setValueAtTime(240, now);
		focusHumGain.gain.setValueAtTime(0.0001, now);
		focusHumGain.gain.exponentialRampToValueAtTime(0.025, now + 0.3);
		focusHumOscillator.connect(filter);
		filter.connect(focusHumGain);
		focusHumGain.connect(audioContext.destination);
		focusHumOscillator.start(now);
		return;
	}

	const stopTime = now + 0.3;
	focusHumGain.gain.cancelScheduledValues(now);
	focusHumGain.gain.setValueAtTime(Math.max(focusHumGain.gain.value, 0.0001), now);
	focusHumGain.gain.exponentialRampToValueAtTime(0.0001, stopTime);
	focusHumOscillator.stop(stopTime);
	focusHumOscillator = undefined;
	focusHumGain = undefined;
}

// 키 입력마다 짧은 클릭음을 재생합니다.
function playKeyClick() {
	if (!audioContext) {
		audioContext = new AudioContext();
	}
	if (audioContext.state === "suspended") {
		audioContext.resume();
	}

	const now = audioContext.currentTime;
	const thockDuration = 0.09;
	const noiseDuration = 0.035;

	const thock = audioContext.createOscillator();
	const thockGain = audioContext.createGain();
	thock.type = "triangle";
	thock.frequency.setValueAtTime(150, now);
	thock.frequency.exponentialRampToValueAtTime(70, now + thockDuration);
	thockGain.gain.setValueAtTime(0.18, now);
	thockGain.gain.exponentialRampToValueAtTime(0.001, now + thockDuration);
	thock.connect(thockGain);
	thockGain.connect(audioContext.destination);
	thock.start(now);
	thock.stop(now + thockDuration);

	const noiseBuffer = audioContext.createBuffer(
		1,
		Math.ceil(audioContext.sampleRate * noiseDuration),
		audioContext.sampleRate,
	);
	const noiseSamples = noiseBuffer.getChannelData(0);
	for (let index = 0; index < noiseSamples.length; index += 1) {
		noiseSamples[index] = Math.random() * 2 - 1;
	}
	const noise = audioContext.createBufferSource();
	const noiseFilter = audioContext.createBiquadFilter();
	const noiseGain = audioContext.createGain();
	noise.buffer = noiseBuffer;
	noiseFilter.type = "lowpass";
	noiseFilter.frequency.setValueAtTime(1800, now);
	noiseGain.gain.setValueAtTime(0.1, now);
	noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDuration);
	noise.connect(noiseFilter);
	noiseFilter.connect(noiseGain);
	noiseGain.connect(audioContext.destination);
	noise.start(now);
	noise.stop(now + noiseDuration);

	const click = audioContext.createBufferSource();
	const clickFilter = audioContext.createBiquadFilter();
	const clickGain = audioContext.createGain();
	click.buffer = noiseBuffer;
	clickFilter.type = "highpass";
	clickFilter.frequency.setValueAtTime(1800, now);
	clickGain.gain.setValueAtTime(0.12, now);
	clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
	click.connect(clickFilter);
	clickFilter.connect(clickGain);
	clickGain.connect(audioContext.destination);
	click.start(now);
	click.stop(now + 0.012);
}

function handleKeyInput(key) {
	if (isGameOver || isClear) return;
	playKeyClick();
	const pressedArrow = arrowOptions.find((arrow) => arrow.key === key);
	if (pressedArrow && pressedArrow.key === arrowSequence[arrowProgress].key) {
		arrowProgress += 1;
		remainingTime = Math.min(
			layout.timer.maxSeconds,
			remainingTime + layout.timer.refillSeconds,
		);
		if (arrowProgress === arrowSequence.length) {
			arrowSequence = createArrowSequence();
			arrowProgress = 0;
		}
	} else {
		remainingTime = Math.max(0, remainingTime - layout.timer.penaltySeconds);
		game.classList.remove("shake");
		void game.offsetWidth;
		game.classList.add("shake");
	}
	drawScene();
}

// 실제 키보드 방향키를 화면의 무작위 순서와 연결합니다.
window.addEventListener("keydown", (event) => {
	if (isGameOver || isClear) return; // 게임 종료 후에는 키 입력을 처리하지 않습니다.
	if (event.repeat) return; // 키를 길게 눌러 반복 입력되어도 감점은 한 번만 합니다.
	if (arrowOptions.some((arrow) => arrow.key === event.key)) {
		event.preventDefault(); // 방향키 입력으로 페이지가 스크롤되는 것을 막습니다.
	}
	handleKeyInput(event.key);
});

// 화면 방향키도 키보드 입력과 같은 게임 처리 함수를 사용합니다.
document.querySelectorAll(".direction-button").forEach((button) => {
	button.addEventListener("click", () => {
		handleKeyInput(button.dataset.direction);
	});
});

// 브라우저 애니메이션 프레임을 요청해 게임을 시작합니다.
requestAnimationFrame(animate);
