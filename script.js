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
		y: 500, // 장애물의 y 좌표
		size: 64, // 장애물 한 변의 길이
		minX: 24, // 장애물이 왼쪽으로 이동할 수 있는 끝 위치
		maxX: 712, // 장애물이 오른쪽으로 이동할 수 있는 끝 위치
		speed: 190, // 장애물의 초당 이동 거리
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
	},
};

// 장면 요소에 사용할 색을 한곳에서 관리합니다.
const colors = {
	wall: "#ffffff", // 벽의 흰색
	floor: "#e5e8eb", // 바닥의 밝은 회색
	floorLine: "#c6cbd0", // 벽과 바닥의 경계선
	floorGrid: "#d3d8dc", // 원근감을 표현하는 바닥 타일선
	desk: "#76533d", // 책상 상판의 나무색
	deskFront: "#50392c", // 책상 앞면과 다리의 어두운 색
	deskSide: "#624732", // 책상 옆면의 어두운 나무색
	deskTop: "#927052", // 위에서 보이는 책상 상판의 밝은 나무색
	computer: "#171a1e", // 컴퓨터 본체와 모니터 테두리의 검은색
	computerSide: "#101316", // 모니터 옆면의 어두운 색
	computerTop: "#30363b", // 위에서 보이는 모니터 윗면의 색
	screen: "#263d4b", // 모니터 화면의 어두운 청록색
	keyboard: "#272b30", // 키보드의 색
	player: "#999999", // 플레이어의 회색
	playerOutline: "#535d66", // 플레이어가 배경과 구분되도록 하는 테두리색
	obstacle: "#2589e8", // 파란 장애물 색
	title: "#20252a", // 제목 글자색
	key: "#252c33", // 아직 입력하지 않은 방향키 칸의 색
	keyCurrent: "#f2b84b", // 지금 입력해야 하는 방향키 칸의 색
	keyComplete: "#3d9b70", // 입력을 완료한 방향키 칸의 색
	keyText: "#ffffff", // 방향키 기호 색
	life: "#e33d3d", // 남은 목숨을 나타내는 빨간 원의 색
	timerTrack: "#d7dce0", // 시간 바가 줄어든 자리에 보이는 색
	timerFill: "#42a477", // 남은 시간을 나타내는 바의 색
	timerLow: "#e33d3d", // 시간이 얼마 남지 않았을 때 바의 색
	timerOutline: "#303840", // 시간 바의 테두리 색
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
let previousFrameTime = 0; // 프레임 간 이동 시간을 계산할 기준 시각
let remainingLives = layout.lives.count; // 현재 남은 목숨 개수
let remainingTime = layout.timer.maxSeconds; // 현재 남은 제한 시간(초)

// 한 프레임의 전체 화면을 그립니다.
function drawScene() {
	ctx.clearRect(0, 0, game.width, game.height); // 이전 프레임 그림을 지웁니다.

	// 흰 벽과 바닥을 그려 강의실의 배경을 만듭니다.
ctx.fillStyle = colors.wall;
ctx.fillRect(layout.wall.x, layout.wall.y, layout.wall.width, layout.wall.height);
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

// 벽 위에 게임 제목을 표시합니다.
ctx.fillStyle = colors.title;
ctx.font = "bold 24px sans-serif";
ctx.textAlign = "left";
ctx.textBaseline = "top";
ctx.fillText("진도 따라잡기", layout.title.x, layout.title.y);

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
	ctx.fillStyle = timerRatio <= 0.2 ? colors.timerLow : colors.timerFill;
	ctx.fillRect(layout.timer.x, layout.timer.y, layout.timer.width * timerRatio, layout.timer.height);
	ctx.strokeStyle = colors.timerOutline;
	ctx.lineWidth = 1;
	ctx.strokeRect(layout.timer.x, layout.timer.y, layout.timer.width, layout.timer.height);

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

// 가운데 컴퓨터 앞에 테두리가 있는 흰색 플레이어를 그립니다.
ctx.fillStyle = colors.player;
ctx.fillRect(layout.player.x, layout.player.y, layout.player.width, layout.player.height);
ctx.strokeStyle = colors.playerOutline;
ctx.lineWidth = 2;
ctx.strokeRect(layout.player.x, layout.player.y, layout.player.width, layout.player.height);

// 현재 x 좌표의 파란 장애물을 그리고, 좌우 이동 좌표는 animate 함수가 갱신합니다.
ctx.fillStyle = colors.obstacle;
ctx.fillRect(obstacleX, layout.obstacle.y, layout.obstacle.size, layout.obstacle.size);

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
	const deltaSeconds = previousFrameTime === 0
		? 0
		: Math.min((frameTime - previousFrameTime) / 1000, 0.05);
	previousFrameTime = frameTime;
	obstacleX += layout.obstacle.speed * obstacleDirection * deltaSeconds;
	remainingTime = Math.max(0, remainingTime - deltaSeconds);
	if (obstacleX <= layout.obstacle.minX) {
		obstacleX = layout.obstacle.minX;
		obstacleDirection = 1;
	} else if (obstacleX >= layout.obstacle.maxX) {
		obstacleX = layout.obstacle.maxX;
		obstacleDirection = -1;
	}
	drawScene();
	requestAnimationFrame(animate);
}

// 실제 키보드 방향키를 화면의 무작위 순서와 연결합니다.
window.addEventListener("keydown", (event) => {
	const pressedArrow = arrowOptions.find((arrow) => arrow.key === event.key);
	if (!pressedArrow) return;
	event.preventDefault(); // 방향키 입력으로 페이지가 스크롤되는 것을 막습니다.
	if (pressedArrow.key === arrowSequence[arrowProgress].key) {
		arrowProgress += 1;
		remainingTime = Math.min(
			layout.timer.maxSeconds,
			remainingTime + layout.timer.refillSeconds,
		);
		if (arrowProgress === arrowSequence.length) {
			arrowSequence = createArrowSequence();
			arrowProgress = 0;
		}
		drawScene();
	}
});

// 브라우저 애니메이션 프레임을 요청해 게임을 시작합니다.
requestAnimationFrame(animate);
