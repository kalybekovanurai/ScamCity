/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence } from "motion/react";
import { APP_ROUTES, NAV_ITEMS } from "./app/router";
import { useGameController } from "./app/useGameController";
import { Lobby } from "./components/Lobby";
import { MissionSelector } from "./components/MissionSelector";
import { Navigation } from "./components/Navigation";
import { ProfileView } from "./components/ProfileView";
import { ProgressCenter } from "./components/ProgressCenter";
import { ScenarioView } from "./components/ScenarioView";
import { SessionSummary } from "./components/SessionSummary";
import { SettingsModal } from "./components/SettingsModal";

export default function App() {
  const game = useGameController();

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${game.theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-[#f6f8fc] text-slate-900"} font-sans selection:bg-violet-100`}>
      <div className={`fixed inset-0 pointer-events-none scam-city-grid ${game.theme === "dark" ? "opacity-10" : "opacity-20"}`} />

      <Navigation
        theme={game.theme}
        gameState={game.gameState}
        setGameState={game.setGameState}
        toggleTheme={game.toggleTheme}
        level={game.currentLevel.level}
        xp={game.xp}
        navItems={NAV_ITEMS}
      />

      <main className="pt-24 pb-24 px-4 md:px-6 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {game.gameState === APP_ROUTES.lobby.id && <Lobby theme={game.theme} setGameState={game.setGameState} />}

          {game.gameState === APP_ROUTES.levels.id && (
            <MissionSelector
              theme={game.theme}
              categoryProgress={game.categoryProgress}
              activeCategory={game.activeCategory}
              setActiveCategory={game.setActiveCategory}
              setGameState={game.setGameState}
              startLevelSession={game.startLevelSession}
              sessionError={game.sessionError}
            />
          )}

          {game.gameState === APP_ROUTES.progress.id && (
            <ProgressCenter
              theme={game.theme}
              xp={game.xp}
              currentLevel={game.currentLevel}
              categoryProgress={game.categoryProgress}
              answers={game.answers}
              stats={game.stats}
            />
          )}

          {game.gameState === APP_ROUTES.profile.id && (
            <ProfileView
              theme={game.theme}
              level={game.currentLevel.level}
              subLevel={game.currentLevel.subLevel}
              xp={game.xp}
              stats={game.stats}
              setShowSettings={game.setShowSettings}
              handleLevelReset={game.handleLevelReset}
            />
          )}

          {game.gameState === APP_ROUTES.scenario.id && game.currentScenario && (
            <ScenarioView
              theme={game.theme}
              currentScenario={game.currentScenario}
              currentScenarioIndex={game.currentScenarioIndex}
              totalScenarios={game.currentLevelSession.length}
              isCorrect={game.isCorrect}
              selectedOption={game.selectedOption}
              handleOptionSelect={game.handleOptionSelect}
              handleNextInSession={game.handleNextInSession}
              setGameState={game.setGameState}
            />
          )}
        </AnimatePresence>
      </main>

      <SettingsModal
        theme={game.theme}
        showSettings={game.showSettings}
        setShowSettings={game.setShowSettings}
        toggleTheme={game.toggleTheme}
      />

      <SessionSummary
        theme={game.theme}
        showSessionSummary={game.showSessionSummary}
        sessionResults={game.sessionResults}
        isAnalyzing={game.isAnalyzing}
        sessionFeedback={game.sessionFeedback}
        onClose={game.closeSessionSummary}
      />

      <footer className="py-12 px-6 border-t border-white/5 text-center opacity-40">
        <p className="text-xs uppercase tracking-[0.3em] font-bold">Training safer digital instincts • 2026 • Scam City</p>
      </footer>
    </div>
  );
}
