import { AlienSprite, LaserSprite } from "./icons";
import { ALIENS, ROW_TOP, colX } from "./simulation";
import type { Shot, VideoState } from "./state";
import styles from "./LtcVideo.module.css";

/**
 * The space-invaders canvas: six aliens, the cannon, and the shots between them.
 *
 * The cannon moves on `transform`, so its glide runs on the compositor instead of laying out the
 * playfield on every frame.
 */
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
 * The cannon. Its column is a translate across the playfield, so consecutive moves join into one
 * continuous glide.
 *
 * A percentage in `translateX` resolves against the element's own width, not its container, so
 * the cannon rides a full-width rail and the sprite is centred on that rail's leading edge.
 * Overshooting the right edge is the error the learner has to fix, so that state deliberately
 * translates past 100% and lets the canvas clip it.
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
 * A white streak from the cannon up to the alien it kills.
 *
 * The prototype measured both endpoints off the live DOM and removed the node on a timer. The
 * geometry is knowable from the board layout, so it is expressed as percentages of a full-height
 * rail and the node retires on its own `animationend` — no forced layout, no untracked timer.
 */
function ShotStreak({ shot, onEnd }: { shot: Shot; onEnd: (id: number) => void }) {
  const target = ALIENS[shot.target];
  // The cannon's nose, and the middle of the alien it is aimed at.
  const from = 88;
  const to = ROW_TOP[target.row] + 4;

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
