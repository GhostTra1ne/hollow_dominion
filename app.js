const tg = window.Telegram.WebApp;
  renderHero();
  openTab("hero");
}

continueBtn.addEventListener("click", () => {
  if (!selectedRace) return;

  const race = races.find((r) => r.id === selectedRace);
  raceScreen.classList.add("hidden");
  classScreen.classList.remove("hidden");
  classSubtitle.textContent = `Раса: ${race.name}. Теперь выбери стартовый класс.`;
  updateSelectedClassText();
  renderClasses();
});

backBtn.addEventListener("click", () => {
  classScreen.classList.add("hidden");
  raceScreen.classList.remove("hidden");
});

finishBtn.addEventListener("click", () => {
  heroData = createHeroData();
  if (!heroData) return;
  showGame();
});

restartBtn.addEventListener("click", () => {
  localStorage.removeItem("selectedRace");
  localStorage.removeItem("selectedClass");
  localStorage.removeItem("heroData");

  selectedRace = null;
  selectedClass = null;
  heroData = null;

  gameScreen.classList.add("hidden");
  classScreen.classList.add("hidden");
  raceScreen.classList.remove("hidden");
  topSubtitle.textContent = "Создание героя";

  updateSelectedRaceText();
  updateSelectedClassText();
  renderRaces();
});

clanPlaceholderBtn.addEventListener("click", () => {
  alert("Кланы добавим позже. Сначала сделаем бой, карту и инвентарь.");
});

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    openTab(btn.dataset.tab);
  });
});

updateSelectedRaceText();
updateSelectedClassText();
renderRaces();

if (heroData) {
  showGame();
}