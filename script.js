document.addEventListener("DOMContentLoaded", () => {
  const homeScreen = document.getElementById("homeScreen");
  const gameScreen = document.getElementById("gameScreen");
  const rulesModal = document.getElementById("rulesModal");
  const hpValue = document.getElementById("hpValue");
  const monsterPanel = document.getElementById("monsterPanel");
  const healthFill = document.getElementById("healthFill");
  const monsterBar = document.getElementById("monsterBar");
  const monsterState = document.getElementById("monsterState");
  const levelText = document.getElementById("levelText");
  const xpText = document.getElementById("xpText");
  const hunterHpText = document.getElementById("hunterHpText");
  const expFill = document.getElementById("expFill");
  const playerStatusBtn = document.getElementById("playerStatusBtn");
  const playerStatusDialog = document.getElementById("playerStatusDialog");
  const closePlayerStatusBtn = document.getElementById("closePlayerStatus");
  const statusLevel = document.getElementById("statusLevel");
  const statusHp = document.getElementById("statusHp");
  const statusAttack = document.getElementById("statusAttack");
  const statusDefense = document.getElementById("statusDefense");
  const statusLuck = document.getElementById("statusLuck");
  const statusEvasion = document.getElementById("statusEvasion");
  const statusExp = document.getElementById("statusExp");
  const statusPoints = document.getElementById("statusPoints");
  const monsterLuckStatus = document.getElementById("monsterLuckStatus");
  const monsterEvasionStatus = document.getElementById("monsterEvasionStatus");
  const comboValue = document.getElementById("comboValue");
  const battleLog = document.getElementById("battleLog");
  const battleArena = document.getElementById("battleArena");
  const damageVignette = document.getElementById("damageVignette");
  const scratchEffect = document.getElementById("scratchEffect");
  const battleOutcome = document.getElementById("battleOutcome");
  const battleOutcomeText = document.getElementById("battleOutcomeText");
  const continueAfterVictoryBtn = document.getElementById("continueAfterVictory");
  const restartAfterDeathBtn = document.getElementById("restartAfterDeath");
  const levelUpScreen = document.getElementById("levelUpScreen");
  const levelUpValue = document.getElementById("levelUpValue");
  const statPointsRemaining = document.getElementById("statPointsRemaining");
  const hpPointsSelected = document.getElementById("hpPointsSelected");
  const attackPointsSelected = document.getElementById("attackPointsSelected");
  const defensePointsSelected = document.getElementById("defensePointsSelected");
  const applyStatusPointsBtn = document.getElementById("applyStatusPoints");
  const combatFeedback = document.getElementById("combatFeedback");
  const mimicShield = document.getElementById("mimicShield");
  const battleActions = document.querySelector(".battle-actions");
  const mindarScene = document.getElementById("mindarScene");
  const scanMessage = document.getElementById("scanMessage");
  const scanPlaceholder = document.getElementById("scanPlaceholder");

  const startGameBtn = document.querySelector('[data-action="start-game"]');
  const rulesBtn = document.querySelector('[data-action="show-rules"]');
  const closeRulesBtn = document.getElementById("closeRules");
  const backHomeBtn = document.getElementById("backToHome");
  const attackBtn = document.getElementById("attackBtn");
  const defendBtn = document.getElementById("defendBtn");
  const runBtn = document.getElementById("runBtn");
  const scanBtn = document.getElementById("scanBtn");
  const scanAttackBtn = document.getElementById("scanAttackBtn");

  try {
    fetch("./target/combined_targets.mind", { cache: "force-cache" }).catch(() => {});
  } catch (e) {}

  const MONSTER_DATABASE = {
    forest_mushroom: {
      id: "forest_mushroom",
      targetIndex: 0,
      targetId: "forestMushroomImageTarget",
      modelId: "forestMushroomArModel",
      name: "Forest Mushroom",
      nameTh: "เห็ดมอนสเตอร์",
      level: 1,
      maxHp: 70,
      attackMin: 8,
      attackMax: 15,
      defense: 0,
      luck: 2,
      evasion: 3,
      expReward: 25,
      mindFile: "./target/forest_mushroom.mind",
      glbFile: "./model/forest_mushroom.glb",
      scale: { x: 0.5, y: 0.5, z: 0.5 },
      icon: "🍄"
    },
    mega_wyvern: {
      id: "mega_wyvern",
      targetIndex: 1,
      targetId: "megaWyvernImageTarget",
      modelId: "megaWyvernArModel",
      name: "Mega Wyvern",
      nameTh: "มังกรไวเวิร์น",
      level: 5,
      maxHp: 180,
      attackMin: 18,
      attackMax: 28,
      defense: 5,
      luck: 6,
      evasion: 6,
      expReward: 60,
      mindFile: "./target/mega_wyvern.mind",
      glbFile: "./model/mega_wyvern.glb",
      scale: { x: 0.25, y: 0.25, z: 0.25 },
      icon: "🐉"
    },
    mimic: {
      id: "mimic",
      targetIndex: 2,
      targetId: "mimicImageTarget",
      modelId: "mimicArModel",
      name: "Mimic Chest",
      nameTh: "กล่องมิมิก",
      level: 3,
      maxHp: 100,
      attackMin: 14,
      attackMax: 22,
      defense: 2,
      luck: 4,
      evasion: 5,
      expReward: 35,
      mindFile: "./target/mimic.mind",
      glbFile: "./model/mimic.glb",
      scale: { x: 0.7, y: 0.7, z: 0.7 },
      icon: "🧰"
    },
    quarry_horn: {
      id: "quarry_horn",
      targetIndex: 3,
      targetId: "quarryHornImageTarget",
      modelId: "quarryHornArModel",
      name: "Quarry Horn",
      nameTh: "ควอร์รี่ฮอร์น",
      level: 4,
      maxHp: 140,
      attackMin: 16,
      attackMax: 25,
      defense: 4,
      luck: 3,
      evasion: 4,
      expReward: 45,
      mindFile: "./target/quarry_horn.mind",
      glbFile: "./model/quarry_horn.glb",
      scale: { x: 0.4, y: 0.4, z: 0.4 },
      icon: "🦏"
    }
  };

  let activeMonsterKey = "mimic";
  let activeMonster = MONSTER_DATABASE.mimic;
  let monsterModelReadyMap = new Map();

  const SAVE_KEY = "AR_MONSTER_HUNTER_SAVE_V1";

  let playerHp = 100;
  let maxPlayerHp = 100;
  let attackBonus = 0;
  let defenseBonus = 0;
  let luckBonus = 0;
  let evasionBonus = 0;
  let monsterHp = 100;
  let level = 1;
  let exp = 0;
  let maxExp = 200;
  let unspentStatPoints = 0;
  let levelUpPending = false;
  let selectedStatPoints = { hp: 0, attack: 0, defense: 0, luck: 0, evasion: 0 };
  let combo = 1;

  let monsterResponseTimeoutId = null;
  let feedbackTimeoutId = null;
  let shieldTimeoutId = null;
  let scratchTimeoutId = null;
  let hitFlashTimeoutId = null;
  let outcomeTimeoutId = null;
  let monsterMotionFrameId = null;
  let monsterBaseTransform = null;
  let monsterMaterialStates = new Map();
  let mindarSystem = null;
  let scanSessionId = 0;
  let isScannerOpen = false;
  let isMimicScanned = false;
  let isMimicTargetVisible = false;
  let isPlayerTurn = true;
  let isBattleActive = false;
  let hasStartedBattle = false;
  let isEscaped = false;
  let isVictory = false;

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const soundMap = {
    attack: "sound/attack.mp3",
    critical: "sound/critical_hit.mp3",
    humanDamage: "sound/human_damage.mp3",
    noDamage: "sound/no_damage.mp3",
    monsterDead: "sound/monster_dead.mp3",
    shield: "sound/shield.mp3",
    victory: "sound/victory.mp3"
  };

  function playSound(name) {
    const src = soundMap[name];
    if (!src) return;

    try {
      const audio = new Audio(src);
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (error) {
      console.warn("Sound failed to load:", name, error);
    }
  }

  function savePlayerData() {
    const saveData = {
      level: level,
      exp: exp,
      maxExp: maxExp,
      maxPlayerHp: maxPlayerHp,
      attackBonus: attackBonus,
      defenseBonus: defenseBonus,
      luckBonus: luckBonus,
      evasionBonus: evasionBonus,
      unspentStatPoints: unspentStatPoints,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch (e) {
      console.warn("Save failed:", e);
    }
  }

  function loadPlayerData() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || typeof data.level !== "number") return false;

      level = data.level || 1;
      exp = data.exp || 0;
      maxExp = data.maxExp || 200;
      maxPlayerHp = data.maxPlayerHp || 100;
      playerHp = maxPlayerHp;
      attackBonus = data.attackBonus || 0;
      defenseBonus = data.defenseBonus || 0;
      luckBonus = data.luckBonus || 0;
      evasionBonus = data.evasionBonus || 0;
      unspentStatPoints = data.unspentStatPoints || 0;
      return true;
    } catch (e) {
      console.warn("Load failed:", e);
      return false;
    }
  }

  function resetPlayerDataOnDeath() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.warn("Clear save failed:", e);
    }
    level = 1;
    exp = 0;
    maxExp = 200;
    maxPlayerHp = 100;
    playerHp = 100;
    attackBonus = 0;
    defenseBonus = 0;
    luckBonus = 0;
    evasionBonus = 0;
    unspentStatPoints = 0;
    combo = 1;
  }

  function getActiveModelElement() {
    return document.getElementById(activeMonster.modelId);
  }

  function addLog(text, type = "normal") {
    if (!battleLog) return;

    const entry = document.createElement("div");
    entry.className = "log-line" + (type === "critical" ? " critical" : "");
    entry.innerHTML = '<span class="log-mark">✧</span><span>' + text + "</span>";

    const existing = battleLog.querySelectorAll(".log-line");
    if (existing.length >= 6) {
      existing[0].remove();
    }

    battleLog.appendChild(entry);
  }

  function captureMonsterAppearance() {
    const model = getActiveModelElement()?.object3D;
    if (!model) return;

    monsterBaseTransform = {
      position: { x: model.position.x, y: model.position.y, z: model.position.z },
      rotation: { x: model.rotation.x, y: model.rotation.y, z: model.rotation.z },
      scale: { x: model.scale.x, y: model.scale.y, z: model.scale.z }
    };

    monsterMaterialStates = new Map();
    getActiveModelElement()?.getObject3D("mesh")?.traverse((node) => {
      if (!node.isMesh) return;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach((material) => {
        if (material && !monsterMaterialStates.has(material)) {
          monsterMaterialStates.set(material, {
            opacity: material.opacity,
            transparent: material.transparent,
            depthWrite: material.depthWrite
          });
        }
      });
    });
  }

  function restoreMonsterAppearance() {
    if (monsterMotionFrameId !== null) {
      cancelAnimationFrame(monsterMotionFrameId);
      monsterMotionFrameId = null;
    }
    const model = getActiveModelElement()?.object3D;
    if (model && monsterBaseTransform) {
      model.position.set(
        monsterBaseTransform.position.x,
        monsterBaseTransform.position.y,
        monsterBaseTransform.position.z
      );
      model.rotation.set(
        monsterBaseTransform.rotation.x,
        monsterBaseTransform.rotation.y,
        monsterBaseTransform.rotation.z
      );
      model.scale.set(
        monsterBaseTransform.scale.x,
        monsterBaseTransform.scale.y,
        monsterBaseTransform.scale.z
      );
    }
    monsterMaterialStates.forEach((state, material) => {
      material.opacity = state.opacity;
      material.transparent = state.transparent;
      material.depthWrite = state.depthWrite;
      material.needsUpdate = true;
    });
  }

  function animateMonsterReaction(kind) {
    const model = getActiveModelElement()?.object3D;
    if (!model) return;
    if (!monsterBaseTransform) captureMonsterAppearance();
    if (monsterMotionFrameId !== null) cancelAnimationFrame(monsterMotionFrameId);

    const base = monsterBaseTransform;
    const startedAt = performance.now();
    const duration = kind === "dodge" ? 560 : 340;
    const runFrame = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const wave = Math.sin(progress * Math.PI * 8) * (1 - progress);

      if (kind === "dodge") {
        const lateral = progress < 0.42
          ? progress / 0.42
          : 1 - (progress - 0.42) / 0.58;
        model.position.set(
          base.position.x + Math.max(0, lateral) * 0.55,
          base.position.y,
          base.position.z
        );
        model.rotation.set(base.rotation.x, base.rotation.y, base.rotation.z + wave * 0.08);
      } else {
        model.position.set(
          base.position.x + wave * 0.12,
          base.position.y,
          base.position.z
        );
        model.rotation.set(base.rotation.x, base.rotation.y, base.rotation.z + wave * 0.12);
      }

      if (progress < 1) {
        monsterMotionFrameId = requestAnimationFrame(runFrame);
      } else {
        monsterMotionFrameId = null;
        model.position.set(base.position.x, base.position.y, base.position.z);
        model.rotation.set(base.rotation.x, base.rotation.y, base.rotation.z);
      }
    };

    monsterMotionFrameId = requestAnimationFrame(runFrame);
  }

  function showCombatFeedback(text, type) {
    if (!combatFeedback) return;
    clearTimeout(feedbackTimeoutId);
    combatFeedback.textContent = text;
    combatFeedback.classList.remove("hidden", "visible", "dodge", "block");
    if (type) combatFeedback.classList.add(type);
    void combatFeedback.offsetWidth;
    combatFeedback.classList.add("visible");
    feedbackTimeoutId = setTimeout(() => {
      combatFeedback.classList.remove("visible", "dodge", "block");
      combatFeedback.classList.add("hidden");
    }, 900);
  }

  function showMimicShield() {
    if (!mimicShield) return;
    clearTimeout(shieldTimeoutId);
    mimicShield.classList.remove("hidden", "visible");
    void mimicShield.offsetWidth;
    mimicShield.classList.add("visible");
    shieldTimeoutId = setTimeout(() => {
      mimicShield.classList.remove("visible");
      mimicShield.classList.add("hidden");
    }, 760);
  }

  function triggerPlayerDamageEffect() {
    if (scratchEffect) {
      clearTimeout(scratchTimeoutId);
      scratchEffect.classList.remove("active");
      void scratchEffect.offsetWidth;
      scratchEffect.classList.add("active");
      scratchTimeoutId = setTimeout(() => scratchEffect.classList.remove("active"), 520);
    }
    if (gameScreen) {
      gameScreen.classList.remove("damage-shake");
      void gameScreen.offsetWidth;
      gameScreen.classList.add("damage-shake");
      setTimeout(() => gameScreen.classList.remove("damage-shake"), 420);
    }
  }

  function flashMimicHit() {
    if (!battleArena) return;
    clearTimeout(hitFlashTimeoutId);
    battleArena.classList.remove("monster-hit");
    void battleArena.offsetWidth;
    battleArena.classList.add("monster-hit");
    hitFlashTimeoutId = setTimeout(() => battleArena.classList.remove("monster-hit"), 360);
  }

  function showBattleOutcome(text, type) {
    if (!battleOutcome || !battleOutcomeText) return;
    clearTimeout(outcomeTimeoutId);
    battleOutcomeText.textContent = text;
    battleOutcome.classList.remove("hidden", "death", "victory");
    battleOutcome.classList.add(type);
    if (continueAfterVictoryBtn) {
      continueAfterVictoryBtn.classList.toggle("hidden", type !== "victory");
    }
    if (restartAfterDeathBtn) {
      restartAfterDeathBtn.classList.toggle("hidden", type !== "death");
    }
  }

  function dissolveMonster() {
    const model = getActiveModelElement()?.object3D;
    if (!model) {
      showBattleOutcome("Victory", "victory");
      return;
    }
    if (!monsterBaseTransform) captureMonsterAppearance();
    if (monsterMotionFrameId !== null) cancelAnimationFrame(monsterMotionFrameId);

    const startedAt = performance.now();
    const duration = 1200;
    const runFrame = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const remaining = 1 - progress;
      model.scale.set(
        monsterBaseTransform.scale.x * remaining,
        monsterBaseTransform.scale.y * remaining,
        monsterBaseTransform.scale.z * remaining
      );
      model.position.set(
        monsterBaseTransform.position.x,
        monsterBaseTransform.position.y + progress * 0.22,
        monsterBaseTransform.position.z
      );
      monsterMaterialStates.forEach((state, material) => {
        material.transparent = true;
        material.depthWrite = false;
        material.opacity = state.opacity * remaining;
        material.needsUpdate = true;
      });

      if (progress < 1) {
        monsterMotionFrameId = requestAnimationFrame(runFrame);
      } else {
        monsterMotionFrameId = null;
        showBattleOutcome("Victory", "victory");
      }
    };

    monsterMotionFrameId = requestAnimationFrame(runFrame);
  }

  function resetBattleEffects() {
    clearTimeout(feedbackTimeoutId);
    clearTimeout(shieldTimeoutId);
    clearTimeout(scratchTimeoutId);
    clearTimeout(hitFlashTimeoutId);
    clearTimeout(outcomeTimeoutId);
    restoreMonsterAppearance();
    if (damageVignette) damageVignette.classList.remove("active");
    if (scratchEffect) scratchEffect.classList.remove("active");
    if (battleOutcome) {
      battleOutcome.classList.add("hidden");
      battleOutcome.classList.remove("death", "victory");
    }
    if (continueAfterVictoryBtn) continueAfterVictoryBtn.classList.add("hidden");
    if (restartAfterDeathBtn) restartAfterDeathBtn.classList.add("hidden");
    if (levelUpScreen) {
      levelUpScreen.classList.add("hidden");
      levelUpScreen.setAttribute("aria-hidden", "true");
    }
    if (combatFeedback) {
      combatFeedback.classList.add("hidden");
      combatFeedback.classList.remove("visible", "dodge", "block");
    }
    if (mimicShield) {
      mimicShield.classList.add("hidden");
      mimicShield.classList.remove("visible");
    }
    if (battleArena) battleArena.classList.remove("monster-hit");
    if (gameScreen) gameScreen.classList.remove("damage-shake");
  }

  function showScreen(screen) {
    if (homeScreen && gameScreen) {
      if (screen === "home") {
        homeScreen.classList.add("active");
        gameScreen.classList.remove("active");
      } else {
        homeScreen.classList.remove("active");
        gameScreen.classList.add("active");
      }
    }
  }

  function resetEncounter() {
    if (monsterResponseTimeoutId) {
      clearTimeout(monsterResponseTimeoutId);
      monsterResponseTimeoutId = null;
    }
    resetBattleEffects();
    playerHp = maxPlayerHp;
    monsterHp = activeMonster.maxHp;
    isBattleActive = true;
    isEscaped = false;
    isVictory = false;
    isPlayerTurn = true;
    if (monsterState) monsterState.textContent = "Tracking";
    if (battleArena) battleArena.classList.remove("waiting");
    updateBattleUi();
    addLog(activeMonster.nameTh + " ปรากฏตัวในระยะสั้น");
  }

  function hideMonsterView() {
    if (battleArena) battleArena.classList.add("waiting");
    if (monsterState) monsterState.textContent = "รอแสกนการ์ด";
  }

  function stopScanner() {
    isScannerOpen = false;
    scanSessionId += 1;
    if (mindarSystem) {
      const activeMindarSystem = mindarSystem;
      mindarSystem = null;
      try {
        const stopResult = activeMindarSystem.stop();
        if (stopResult?.catch) stopResult.catch((error) => console.warn("MindAR stop failed:", error));
      } catch (error) {
        console.warn("MindAR stop failed:", error);
      }
    }
  }

  function closeScannerView() {
    stopScanner();
    if (battleArena) battleArena.classList.remove("scanning");
    if (scanMessage) scanMessage.classList.add("hidden");
    if (scanBtn && !isBattleActive && !isVictory) {
      scanBtn.classList.remove("hidden");
    }
  }

  function setScanMessage(message, isError = false) {
    if (!scanMessage) return;
    scanMessage.textContent = message;
    scanMessage.classList.toggle("error", isError);
    scanMessage.classList.remove("hidden");
  }

  function showMonsterDetected() {
    if (!isScannerOpen || !isMimicTargetVisible) return;
    isMimicScanned = true;
    setScanMessage(`พบการ์ด ${activeMonster.nameTh} แล้ว โมเดลพร้อม`);
    if (scanPlaceholder) scanPlaceholder.classList.add("hidden");
    updateBattleUi();
    const modelEl = getActiveModelElement();
    if (modelEl?.object3D) modelEl.object3D.visible = true;
  }

  function waitForMindarScene() {
    if (mindarScene.hasLoaded) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error("MindAR scene load timed out")), 15000);
      mindarScene.addEventListener("loaded", () => {
        clearTimeout(timeoutId);
        resolve();
      }, { once: true });
    });
  }

  async function openScannerView() {
    if (isBattleActive || isVictory || !battleArena) return;

    closeScannerView();
    isMimicScanned = false;
    isMimicTargetVisible = false;
    if (scanAttackBtn) scanAttackBtn.classList.add("hidden");
    if (scanPlaceholder) {
      scanPlaceholder.textContent = "กำลังเตรียมกล้อง";
      scanPlaceholder.classList.remove("hidden");
    }

    battleArena.classList.add("scanning");
    if (scanBtn) scanBtn.classList.add("hidden");
    isScannerOpen = true;
    const currentScanSession = scanSessionId;
    setScanMessage("เล็งกล้องไปที่การ์ดมอนสเตอร์");

    if (!window.AFRAME || !mindarScene) {
      setScanMessage("โหลด MindAR ไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่", true);
      if (scanPlaceholder) scanPlaceholder.textContent = "โหลดระบบ AR ไม่สำเร็จ";
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) {
      setScanMessage("เปิดกล้องไม่ได้ กรุณาใช้หน้าเว็บผ่าน HTTPS หรือ localhost", true);
      if (scanPlaceholder) scanPlaceholder.textContent = "ไม่สามารถเข้าถึงกล้อง";
      return;
    }

    try {
      await waitForMindarScene();
      if (!isScannerOpen || currentScanSession !== scanSessionId) return;

      mindarSystem = mindarScene.systems["mindar-image-system"];
      if (!mindarSystem) throw new Error("MindAR image system is not initialized");

      await mindarSystem.start();
      if (!isScannerOpen || currentScanSession !== scanSessionId) {
        mindarSystem.stop();
        mindarSystem = null;
        return;
      }
      if (scanPlaceholder) scanPlaceholder.classList.add("hidden");
      setScanMessage("เล็งกล้องไปที่การ์ดมอนสเตอร์");
    } catch (error) {
      const scannerWasOpen = isScannerOpen;
      stopScanner();
      if (!scannerWasOpen) return;
      setScanMessage("เริ่ม AR ไม่สำเร็จ กรุณาอนุญาตกล้องและเปิดผ่าน HTTPS หรือ localhost", true);
      if (scanPlaceholder) scanPlaceholder.textContent = "ไม่สามารถเริ่มกล้อง AR";
      console.warn("MindAR scanner failed to start:", error);
    }
  }

  if (mindarScene) {
    mindarScene.addEventListener("arReady", () => {
      if (!isScannerOpen) return;
      if (scanPlaceholder) scanPlaceholder.classList.add("hidden");
      setScanMessage("เล็งกล้องไปที่การ์ดมอนสเตอร์");
    });

    mindarScene.addEventListener("arError", (event) => {
      if (!isScannerOpen) return;
      const cameraFailed = event.detail?.error === "VIDEO_FAIL";
      setScanMessage(
        cameraFailed
          ? "เปิดกล้องไม่ได้ กรุณาอนุญาตสิทธิ์กล้องให้เว็บไซต์"
          : "เริ่ม AR ไม่สำเร็จ กรุณาตรวจสอบกล้องและไฟล์การ์ด target",
        true
      );
      if (scanPlaceholder) {
        scanPlaceholder.textContent = cameraFailed ? "ไม่สามารถเข้าถึงกล้อง" : "เริ่ม AR ไม่สำเร็จ";
        scanPlaceholder.classList.remove("hidden");
      }
    });
  }

  Object.keys(MONSTER_DATABASE).forEach((mKey) => {
    const info = MONSTER_DATABASE[mKey];
    const targetEl = document.getElementById(info.targetId);
    const modelEl = document.getElementById(info.modelId);

    if (modelEl) {
      modelEl.addEventListener("model-loaded", () => {
        monsterModelReadyMap.set(mKey, true);
        if (isScannerOpen && activeMonsterKey === mKey && isMimicTargetVisible) {
          captureMonsterAppearance();
          showMonsterDetected();
        }
      });
    }

    if (targetEl) {
      targetEl.addEventListener("targetFound", () => {
        if (!isScannerOpen) return;
        activeMonsterKey = mKey;
        activeMonster = info;
        monsterHp = info.maxHp;
        isMimicTargetVisible = true;
        isMimicScanned = true;

        if (scanPlaceholder) scanPlaceholder.classList.add("hidden");
        captureMonsterAppearance();
        showMonsterDetected();
        updateBattleUi();
      });

      targetEl.addEventListener("targetLost", () => {
        if (activeMonsterKey !== mKey) return;
        isMimicTargetVisible = false;
        if (!isScannerOpen || isVictory) return;

        const encounterWasActive = hasStartedBattle || isBattleActive;
        isMimicScanned = false;
        hasStartedBattle = false;
        isBattleActive = false;
        isEscaped = false;
        playerHp = maxPlayerHp;
        monsterHp = activeMonster.maxHp;
        if (monsterResponseTimeoutId) {
          clearTimeout(monsterResponseTimeoutId);
          monsterResponseTimeoutId = null;
        }
        if (encounterWasActive) resetBattleEffects();
        if (battleArena) battleArena.classList.add("waiting");
        setScanMessage("เล็งกล้องไปที่การ์ดมอนสเตอร์");
        updateBattleUi();
      });
    }
  });

  function updateBattleUi() {
    const playerPercent = Math.max(0, playerHp);
    const monsterPercent = Math.max(0, (monsterHp / activeMonster.maxHp) * 100);

    if (healthFill) healthFill.style.width = Math.min(100, (playerPercent / maxPlayerHp) * 100) + "%";
    if (hunterHpText) hunterHpText.textContent = playerHp + " / " + maxPlayerHp;
    if (expFill) expFill.style.width = Math.min(100, (exp / maxExp) * 100) + "%";
    if (monsterBar) monsterBar.style.width = monsterPercent + "%";
    if (hpValue) hpValue.textContent = Math.max(0, monsterHp) + " / " + activeMonster.maxHp;
    if (comboValue) comboValue.textContent = "Combo x" + combo;
    if (levelText) levelText.textContent = "Lv. " + level;
    if (xpText) xpText.textContent = exp + " / " + maxExp;

    if (monsterPanel) {
      monsterPanel.classList.toggle("hidden", !hasStartedBattle);
      const nameSpan = monsterPanel.querySelector(".monster-name");
      const levelSpan = monsterPanel.querySelector(".monster-level");
      if (nameSpan) nameSpan.textContent = activeMonster.name;
      if (levelSpan) levelSpan.textContent = "Lv." + activeMonster.level;
    }

    if (damageVignette) {
      damageVignette.classList.toggle("active", isBattleActive && playerHp > 0 && playerHp <= 30);
    }
    if (scanMessage) {
      scanMessage.classList.toggle("hidden", !isScannerOpen || isBattleActive);
    }

    if (monsterState) {
      if (isVictory) {
        monsterState.textContent = "Victory";
      } else if (isEscaped) {
        monsterState.textContent = "Escaped";
      } else if (playerHp <= 0) {
        monsterState.textContent = "You Died";
      } else if (!hasStartedBattle) {
        monsterState.textContent = "รอแสกนการ์ด";
      } else if (monsterHp <= 0) {
        monsterState.textContent = "Defeated";
      } else if (monsterPercent <= 40) {
        monsterState.textContent = "Critical";
      } else if (monsterPercent <= 70) {
        monsterState.textContent = "Weak";
      } else {
        monsterState.textContent = "Tracking";
      }
    }

    const actionDisabled = !isBattleActive || isEscaped || isVictory || monsterHp <= 0;
    if (battleActions) {
      battleActions.classList.toggle("hidden", actionDisabled);
    }
    if (scanBtn) {
      scanBtn.classList.toggle("hidden", isBattleActive || isVictory || isScannerOpen || isMimicScanned);
    }
    if (scanAttackBtn) {
      scanAttackBtn.classList.toggle("hidden", !isMimicScanned || isBattleActive || isVictory);
    }
    [attackBtn, defendBtn, runBtn].forEach((button) => {
      if (button) {
        button.disabled = actionDisabled;
        button.style.opacity = actionDisabled ? "0.55" : "1";
        button.style.cursor = actionDisabled ? "not-allowed" : "pointer";
      }
    });

    if (battleArena) {
      battleArena.classList.toggle("victory", isVictory);
    }
    updatePlayerStatus();
  }

  function updatePlayerStatus() {
    if (statusLevel) statusLevel.textContent = "Lv. " + level;
    if (statusHp) statusHp.textContent = playerHp + " / " + maxPlayerHp;
    if (statusAttack) statusAttack.textContent = (14 + attackBonus) + "–" + (31 + attackBonus);
    if (statusDefense) statusDefense.textContent = String(defenseBonus);
    if (statusLuck) statusLuck.textContent = luckBonus + " · " + Math.round(getCriticalChance(luckBonus) * 100) + "%";
    if (statusEvasion) statusEvasion.textContent = evasionBonus + " · " + Math.round(getEvasionChance(evasionBonus) * 100) + "%";
    if (statusExp) statusExp.textContent = exp + " / " + maxExp;
    if (statusPoints) statusPoints.textContent = String(unspentStatPoints);
    if (monsterLuckStatus) monsterLuckStatus.textContent = activeMonster.luck + " · " + Math.round(getCriticalChance(activeMonster.luck) * 100) + "%";
    if (monsterEvasionStatus) monsterEvasionStatus.textContent = activeMonster.evasion + " · " + Math.round(getEvasionChance(activeMonster.evasion) * 100) + "%";
  }

  function getCriticalChance(luck) {
    return Math.min(0.65, 0.05 + luck * 0.03);
  }

  function getEvasionChance(evasion) {
    return Math.min(0.7, 0.1 + evasion * 0.03);
  }

  function gainExp(amount) {
    exp += amount;
    let levelsGained = 0;
    while (exp >= maxExp) {
      exp -= maxExp;
      level += 1;
      maxExp += 35;
      levelsGained += 1;
    }
    if (levelsGained > 0) {
      const newPoints = levelsGained * 3;
      unspentStatPoints += newPoints;
      levelUpPending = true;
      combo += levelsGained;
      addLog("LEVEL UP! ได้รับแต้มอัปสถานะ " + newPoints + " แต้ม", "critical");
    }
    savePlayerData();
    updateBattleUi();
  }

  function updateStatusAllocationUi() {
    if (levelUpValue) levelUpValue.textContent = String(level);
    if (statPointsRemaining) statPointsRemaining.textContent = String(unspentStatPoints);
    if (hpPointsSelected) hpPointsSelected.textContent = String(selectedStatPoints.hp);
    if (attackPointsSelected) attackPointsSelected.textContent = String(selectedStatPoints.attack);
    if (defensePointsSelected) defensePointsSelected.textContent = String(selectedStatPoints.defense);
    if (luckPointsSelected) luckPointsSelected.textContent = String(selectedStatPoints.luck);
    if (evasionPointsSelected) evasionPointsSelected.textContent = String(selectedStatPoints.evasion);
    document.querySelectorAll("[data-stat-upgrade]").forEach((button) => {
      button.disabled = unspentStatPoints <= 0;
    });
    if (applyStatusPointsBtn) applyStatusPointsBtn.disabled = unspentStatPoints > 0;
  }

  function allocateStatusPoint(stat) {
    if (unspentStatPoints <= 0 || !(stat in selectedStatPoints)) return;
    selectedStatPoints[stat] += 1;
    unspentStatPoints -= 1;
    updateStatusAllocationUi();
  }

  function openLevelUpScreen() {
    if (!levelUpScreen) return;
    selectedStatPoints = { hp: 0, attack: 0, defense: 0, luck: 0, evasion: 0 };
    updateStatusAllocationUi();
    if (battleOutcome) battleOutcome.classList.add("hidden");
    levelUpScreen.classList.remove("hidden");
    levelUpScreen.setAttribute("aria-hidden", "false");
  }

  function returnToScanner() {
    isVictory = false;
    isBattleActive = false;
    isEscaped = false;
    hasStartedBattle = false;
    isMimicScanned = false;
    playerHp = maxPlayerHp;
    monsterHp = activeMonster.maxHp;
    resetBattleEffects();
    if (battleArena) battleArena.classList.add("waiting");
    const activeModel = getActiveModelElement();
    if (isMimicTargetVisible && activeModel?.object3D) {
      activeModel.object3D.visible = false;
    }
    if (battleLog) battleLog.replaceChildren();
    addLog("รอแสกนการ์ด");
    updateBattleUi();

    if (isScannerOpen) {
      setScanMessage(isMimicTargetVisible ? "ยกการ์ดออกแล้วสแกนใหม่" : "เล็งกล้องไปที่การ์ดมอนสเตอร์");
    } else {
      openScannerView();
    }
  }

  function continueAfterVictory() {
    if (!isVictory) return;
    if (levelUpPending && unspentStatPoints > 0) {
      openLevelUpScreen();
      return;
    }
    returnToScanner();
  }

  function applyStatusPoints() {
    if (!levelUpPending || unspentStatPoints > 0) return;
    maxPlayerHp += selectedStatPoints.hp * 15;
    playerHp = Math.min(maxPlayerHp, playerHp + selectedStatPoints.hp * 15);
    attackBonus += selectedStatPoints.attack * 3;
    defenseBonus += selectedStatPoints.defense * 2;
    luckBonus += selectedStatPoints.luck;
    evasionBonus += selectedStatPoints.evasion;
    levelUpPending = false;
    savePlayerData();
    returnToScanner();
  }

  function finishDefeat(message) {
    isBattleActive = false;
    resetPlayerDataOnDeath();
    addLog(message, "critical");
    showBattleOutcome("You Died", "death");
    updateBattleUi();
  }

  function monsterTurn() {
    if (!isBattleActive || isEscaped || isVictory || monsterHp <= 0) return;

    const didEvade = Math.random() < getEvasionChance(evasionBonus);
    const isCritical = !didEvade && Math.random() < getCriticalChance(activeMonster.luck);
    const baseDamage = activeMonster.attackMin + Math.floor(Math.random() * (activeMonster.attackMax - activeMonster.attackMin + 1));
    const damage = didEvade
      ? 0
      : Math.max(1, baseDamage - defenseBonus) + (isCritical ? Math.ceil(baseDamage * 0.5) : 0);

    if (didEvade) {
      addLog(`คุณหลบการโจมตีของ ${activeMonster.name}!`, "normal");
      playSound("noDamage");
      showCombatFeedback("EVADE", "dodge");
    } else {
      playerHp = Math.max(0, playerHp - damage);
      addLog(`${activeMonster.name} โจมตีคุณ -${damage}${isCritical ? " (Critical!)" : ""}`, isCritical ? "critical" : "normal");
      playSound(isCritical ? "critical" : "humanDamage");
      triggerPlayerDamageEffect();
    }

    if (playerHp <= 0) {
      finishDefeat("คุณพ่ายแพ้! ระดับและสถานะถูกรีเซ็ตใหม่แล้ว");
      return;
    }

    updateBattleUi();
  }

  function delayMonsterTurn() {
    if (!isBattleActive || isEscaped || isVictory || monsterHp <= 0) return;

    if (monsterResponseTimeoutId) {
      clearTimeout(monsterResponseTimeoutId);
    }

    monsterResponseTimeoutId = setTimeout(() => {
      monsterResponseTimeoutId = null;
      monsterTurn();
    }, 1000);
  }

  function finishVictory() {
    if (monsterResponseTimeoutId) {
      clearTimeout(monsterResponseTimeoutId);
      monsterResponseTimeoutId = null;
    }
    isVictory = true;
    isBattleActive = false;
    const rewardExp = activeMonster.expReward;
    gainExp(rewardExp);
    playSound("victory");
    addLog(`Victory! ได้รับ ${rewardExp} EXP`, "critical");
    if (monsterState) monsterState.textContent = "Victory";
    updateBattleUi();
    dissolveMonster();
  }

  function resolvePlayerAttack() {
    if (!isBattleActive || isEscaped || isVictory) return;

    const monsterGuardChance = 0.28;
    const rawDamage = 14 + Math.floor(Math.random() * 18) + attackBonus;
    const defended = Math.random() < monsterGuardChance;

    if (defended) {
      const reducedDamage = Math.max(4, Math.floor(rawDamage * 0.45));
      const finalDamage = Math.max(0, rawDamage - reducedDamage);
      monsterHp = Math.max(0, monsterHp - finalDamage);
      addLog(`${activeMonster.name} ป้องกัน! ลดความเสียหายลงเหลือ -${finalDamage}`, "normal");
      playSound("shield");
      showMimicShield();
      showCombatFeedback("BLOCK", "block");
      if (monsterHp <= 0) {
        playSound("monsterDead");
        finishVictory();
        return;
      }
      delayMonsterTurn();
      updateBattleUi();
      return;
    }

    const isMiss = Math.random() < getEvasionChance(activeMonster.evasion);
    if (isMiss) {
      addLog(`${activeMonster.name} หลบการโจมตีได้!`, "normal");
      playSound("noDamage");
      animateMonsterReaction("dodge");
      showCombatFeedback("Dodge", "dodge");
      delayMonsterTurn();
      updateBattleUi();
      return;
    }

    const isCritical = Math.random() < getCriticalChance(luckBonus);
    const attackDamage = rawDamage + (isCritical ? Math.ceil(rawDamage * 0.5) : 0);
    monsterHp = Math.max(0, monsterHp - attackDamage);
    flashMimicHit();
    animateMonsterReaction("hit");
    addLog(`คุณโจมตี ${activeMonster.name} -${attackDamage}${isCritical ? " (Critical!)" : ""}`, isCritical ? "critical" : "normal");

    if (isCritical) {
      playSound("critical");
    } else {
      playSound("attack");
    }

    if (monsterHp <= 0) {
      playSound("monsterDead");
      finishVictory();
      return;
    }

    delayMonsterTurn();
    updateBattleUi();
  }

  if (startGameBtn) {
    startGameBtn.addEventListener("click", () => {
      closeScannerView();
      showScreen("game");
      isBattleActive = false;
      hasStartedBattle = false;
      isMimicScanned = false;
      isEscaped = false;
      isVictory = false;
      resetBattleEffects();
      hideMonsterView();
      updateBattleUi();
      if (battleLog) battleLog.replaceChildren();
      addLog("รอแสกนการ์ด");
    });
  }

  if (rulesBtn && rulesModal) {
    rulesBtn.addEventListener("click", () => {
      rulesModal.classList.remove("hidden");
      rulesModal.setAttribute("aria-hidden", "false");
    });
  }

  if (closeRulesBtn && rulesModal) {
    closeRulesBtn.addEventListener("click", () => {
      rulesModal.classList.add("hidden");
      rulesModal.setAttribute("aria-hidden", "true");
    });
  }

  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", () => {
      closeScannerView();
      if (monsterResponseTimeoutId) {
        clearTimeout(monsterResponseTimeoutId);
        monsterResponseTimeoutId = null;
      }
      showScreen("home");
    });
  }

  if (attackBtn) {
    attackBtn.addEventListener("click", () => {
      resolvePlayerAttack();
    });
  }

  if (defendBtn) {
    defendBtn.addEventListener("click", () => {
      if (!isBattleActive || isEscaped || isVictory) return;

      playSound("shield");
      addLog("คุณป้องกันและลดความเสียหายลง");
      setTimeout(() => {
        const damage = Math.max(2, activeMonster.attackMin + Math.floor(Math.random() * 8) - defenseBonus);
        const reducedDamage = Math.max(1, Math.floor(damage / 2));
        playerHp = Math.max(0, playerHp - reducedDamage);
        addLog(`${activeMonster.name} โจมตีคุณ -${reducedDamage}`, "normal");
        triggerPlayerDamageEffect();

        if (playerHp <= 0) {
          finishDefeat("คุณพ่ายแพ้! ระดับและสถานะถูกรีเซ็ตใหม่แล้ว");
          return;
        }

        updateBattleUi();
      }, 1000);

      updateBattleUi();
    });
  }

  if (runBtn) {
    runBtn.addEventListener("click", () => {
      if (!isBattleActive) return;
      isEscaped = true;
      isBattleActive = false;
      playSound("noDamage");
      hideMonsterView();
      addLog("คุณหลบหนีออกจากหน้ามอนสเตอร์ กลับสู่หน้ารอแสกน");
      if (monsterState) monsterState.textContent = "Escaped";
      updateBattleUi();
    });
  }

  if (scanBtn) {
    scanBtn.addEventListener("click", () => {
      openScannerView();
    });
  }

  if (scanAttackBtn) {
    scanAttackBtn.addEventListener("click", () => {
      if (!isMimicScanned) return;
      hasStartedBattle = true;
      resetEncounter();
      addLog(`เริ่มต่อสู้กับ ${activeMonster.name}`, "critical");
    });
  }

  if (continueAfterVictoryBtn) {
    continueAfterVictoryBtn.addEventListener("click", continueAfterVictory);
  }

  if (restartAfterDeathBtn) {
    restartAfterDeathBtn.addEventListener("click", () => {
      resetPlayerDataOnDeath();
      returnToScanner();
    });
  }

  document.querySelectorAll("[data-stat-upgrade]").forEach((button) => {
    button.addEventListener("click", () => {
      allocateStatusPoint(button.dataset.statUpgrade);
    });
  });

  if (applyStatusPointsBtn) {
    applyStatusPointsBtn.addEventListener("click", applyStatusPoints);
  }

  if (playerStatusBtn && playerStatusDialog) {
    playerStatusBtn.addEventListener("click", () => {
      updatePlayerStatus();
      playerStatusDialog.showModal();
    });
  }

  if (closePlayerStatusBtn && playerStatusDialog) {
    closePlayerStatusBtn.addEventListener("click", () => playerStatusDialog.close());
    playerStatusDialog.addEventListener("click", (event) => {
      if (event.target === playerStatusDialog) playerStatusDialog.close();
    });
  }



  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && battleArena?.classList.contains("scanning") && !isBattleActive) {
      isMimicScanned = false;
      closeScannerView();
      updateBattleUi();
    }
  });

  loadPlayerData();
  updateBattleUi();
  showScreen("game");
  hideMonsterView();
  updateBattleUi();
});
