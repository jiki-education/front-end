import { AlienSprite, LaserSprite } from "./icons";
import { ALIENS, ROW_TOP, colX } from "./simulation";
import type { Shot, VideoState } from "./state";
import styles from "./LtcVideo.module.css";

/** The space-invaders canvas: six aliens, the cannon, and the shots between them. */
export function GameCanvas({ state, onShotEnd }: { state: VideoState; onShotEnd: (id: number) => void }) {
  return (
    <div className={styles.game}>
      <div className={styles.playfield}>
        {ALIENS.map((alien, i) => (
          <div
            key={i}
            className={`${styles.alien} ${state.deadAliens[i] ? styles.alienDead : ""}`}
            style={{ left: `${colX(alien.col)}%`, top: `${ROW_TOP[alien.row]}%` }}
          >
            <AlienSprite />
          </div>
        ))}

        {state.shots.map((shot) => (
          <ShotStreak key={shot.id} shot={shot} onEnd={onShotEnd} />
        ))}

        <Cannon state={state} />
      </div>
    </div>
  );
}

/**
 * The cannon, translated across a full-width rail so consecutive moves join into one glide. The
 * overshoot past the right edge (the error the learner fixes) translates past 100% and gets clipped.
 */
function Cannon({ state }: { state: VideoState }) {
  const offEdge = state.laserOffEdge;
  return (
    <div
      className={styles.laserRail}
      style={{ "--col-x": offEdge ? "calc(100% + 14px)" : `${colX(state.laserCol)}%` } as React.CSSProperties}
    >
      <div className={`${styles.laser} ${offEdge ? styles.laserOffEdge : ""}`}>
        <LaserSprite />
      </div>
    </div>
  );
}

/**
 * A white streak between the cannon and the alien it kills, sized from the board layout and retired
 * on `animationend`. A rewound kill runs the same streak the other way, back down into the cannon.
 */
function ShotStreak({ shot, onEnd }: { shot: Shot; onEnd: (id: number) => void }) {
  const target = ALIENS[shot.target];
  // The cannon's nose, and the middle of the alien it is aimed at.
  const nose = 88;
  const alien = ROW_TOP[target.row] + 4;
  const [from, to] = shot.dir === "down" ? [alien, nose] : [nose, alien];

  return (
    <div className={styles.shotRail} style={{ left: `${colX(shot.col)}%` }}>
      <div
        className={styles.shot}
        style={{ "--from": `${from}%`, "--to": `${to}%` } as React.CSSProperties}
        onAnimationEnd={() => onEnd(shot.id)}
      />
    </div>
  );
}
