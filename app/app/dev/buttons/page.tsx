"use client";

import styles from "./page.module.css";

export default function ButtonShowcasePage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>ui-btn Showcase</h1>
          <p className={styles.intro}>All button variants using the ui-btn class system.</p>
        </div>

        {/* Primary Buttons */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Primary Buttons</h2>
          <div className={styles.row}>
            <button className="ui-btn ui-btn-default ui-btn-primary">Blue (Default)</button>
            <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-purple">Purple</button>
            <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-green">Green</button>
            <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-amber">Amber</button>
            <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-red">Red</button>
            <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-gray">Gray</button>
          </div>
        </section>

        {/* Secondary Buttons */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Secondary Buttons</h2>
          <div className={styles.row}>
            <button className="ui-btn ui-btn-default ui-btn-secondary">Blue (Default)</button>
            <button className="ui-btn ui-btn-default ui-btn-secondary ui-btn-purple">Purple</button>
            <button className="ui-btn ui-btn-default ui-btn-secondary ui-btn-green">Green</button>
            <button className="ui-btn ui-btn-default ui-btn-secondary ui-btn-amber">Amber</button>
            <button className="ui-btn ui-btn-default ui-btn-secondary ui-btn-red">Red</button>
            <button className="ui-btn ui-btn-default ui-btn-secondary ui-btn-gray">Gray</button>
          </div>
        </section>

        {/* Tertiary & Subtle */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tertiary & Subtle</h2>
          <div className={styles.row}>
            <button className="ui-btn ui-btn-default ui-btn-tertiary">Tertiary</button>
            <button className="ui-btn ui-btn-default ui-btn-subtle">Subtle</button>
          </div>
        </section>

        {/* Danger Button */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Danger Button</h2>
          <div className={styles.row}>
            <button className="ui-btn ui-btn-default ui-btn-danger">Danger Action</button>
          </div>
        </section>

        {/* Sizes */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Sizes</h2>
          <div className={styles.rowEnd}>
            <button className="ui-btn ui-btn-small ui-btn-primary">Small</button>
            <button className="ui-btn ui-btn-default ui-btn-primary">Default</button>
            <button className="ui-btn ui-btn-large ui-btn-primary">Large</button>
            <button className="ui-btn ui-btn-xlarge ui-btn-primary">X-Large</button>
          </div>
        </section>

        {/* States */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>States</h2>
          <div className={styles.stateGroups}>
            <div>
              <h3 className={styles.stateLabel}>Loading</h3>
              <div className={styles.row}>
                <button className="ui-btn ui-btn-default ui-btn-primary ui-btn-loading">Loading</button>
                <button className="ui-btn ui-btn-default ui-btn-secondary ui-btn-loading">Loading</button>
                <button className="ui-btn ui-btn-default ui-btn-tertiary ui-btn-loading">Loading</button>
              </div>
            </div>
            <div>
              <h3 className={styles.stateLabel}>Disabled</h3>
              <div className={styles.row}>
                <button className="ui-btn ui-btn-default ui-btn-primary" disabled>
                  Disabled
                </button>
                <button className="ui-btn ui-btn-default ui-btn-secondary" disabled>
                  Disabled
                </button>
                <button className="ui-btn ui-btn-default ui-btn-tertiary" disabled>
                  Disabled
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* As Links */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>As Links (anchor tags)</h2>
          <div className={styles.row}>
            <a href="#" className="ui-btn ui-btn-default ui-btn-primary">
              Primary Link
            </a>
            <a href="#" className="ui-btn ui-btn-default ui-btn-secondary">
              Secondary Link
            </a>
            <a href="#" className="ui-btn ui-btn-default ui-btn-tertiary">
              Tertiary Link
            </a>
          </div>
        </section>

        {/* On Dark Background */}
        <section className={styles.colorfulSection}>
          <h2 className={styles.colorfulSectionTitle}>On Colorful Background</h2>
          <div className={styles.row}>
            <button className="ui-btn ui-btn-default ui-btn-for-colorful-background">For Colorful BG</button>
          </div>
        </section>
      </div>
    </div>
  );
}
