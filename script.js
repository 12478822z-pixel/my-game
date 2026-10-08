const gameChoices = document.querySelectorAll(".game-choice");
const selectionNote = document.querySelector(".selection-note");
const todayDate = document.querySelector("#today-date");

if (todayDate) {
  const now = new Date();
  const localDate = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  todayDate.dateTime = localDate;
  todayDate.textContent = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(now);
}

gameChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    const isSelected = choice.getAttribute("aria-pressed") === "true";
    choice.setAttribute("aria-pressed", String(!isSelected));
    choice.querySelector(".game-action").textContent = isSelected ? "선택" : "선택됨";

    const selectedCount = document.querySelectorAll('.game-choice[aria-pressed="true"]').length;
    selectionNote.textContent = selectedCount
      ? `좋아하는 게임 ${selectedCount}개를 골랐어요.`
      : "마음에 드는 게임을 골라 보세요.";
  });
});
