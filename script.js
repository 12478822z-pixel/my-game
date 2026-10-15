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
		backLeftX: 50, // 상판 뒤쪽 왼쪽 x 좌표
		backRightX: 750, // 상판 뒤쪽 오른쪽 x 좌표
		frontLeftX: 12, // 상판 앞쪽 왼쪽 x 좌표
		frontRightX: 788, // 상판 앞쪽 오른쪽 x 좌표
		backY: 314, // 상판 뒤쪽 y 좌표
		frontY: 372, // 상판 앞쪽 y 좌표
		frontDepth: 16, // 상판 앞면의 깊이
		legBottomY: 540, // 책상 다리 아래쪽 y 좌표
		legWidth: 16, // 책상 다리 너비
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
		screenHeight: 48, // 화면 높이
		standWidth: 18, // 모니터 받침대 너비
		standHeight: 24, // 모니터 받침대 높이
		baseWidth: 38, // 받침대 바닥 너비
		baseHeight: 8, // 받침대 바닥 높이
		keyboardWidth: 60, // 키보드 너비
		keyboardHeight: 7, // 키보드 높이
		keyboardY: 338, // 키보드 위쪽 y 좌표
	},
	player: { x: 384, y: 445, width: 32, height: 32 }, // 가운데 컴퓨터 앞 플레이어
	obstacle: { x: 110, y: 500, size: 64 }, // 좌우 이동을 추가할 장애물의 시작 위치와 크기
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
};

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
ctx.textBaseline = "top";
ctx.fillText("진도 따라잡기", layout.title.x, layout.title.y);

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

// 왼쪽에서 오른쪽으로 무작위 이동할 파란색 장애물을 정지 상태로 그립니다.
ctx.fillStyle = colors.obstacle;
ctx.fillRect(layout.obstacle.x, layout.obstacle.y, layout.obstacle.size, layout.obstacle.size);
